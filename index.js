import fetch from 'node-fetch';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const HA_URL = process.env.HOME_ASSISTANT_URL;
const HA_TOKEN = process.env.HOME_ASSISTANT_TOKEN;

const server = new McpServer({
  name: 'homeassistant',
  version: '1.0.0'
});

// Helper to get all entities from HA
async function getAllEntities() {
  const res = await fetch(`${HA_URL}/api/states`, {
    headers: { Authorization: `Bearer ${HA_TOKEN}` }
  });
  return await res.json();
}

// Helper to call HA service
async function callService(domain, service, entity_id) {
  await fetch(`${HA_URL}/api/services/${domain}/${service}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ entity_id })
  });
}

// List all devices with friendly names
server.tool(
  'list_devices',
  { domain: z.string().optional().describe('filter by domain e.g. light, switch, fan') },
  async ({ domain }) => {
    const entities = await getAllEntities();
    const filtered = domain
      ? entities.filter(e => e.entity_id.startsWith(domain))
      : entities;

    const list = filtered
      .map(e => `${e.entity_id} | ${e.attributes.friendly_name || 'No name'} | ${e.state}`)
      .join('\n');

    return {
      content: [{ type: 'text', text: `Available devices:\n${list}` }]
    };
  }
);

// Smart control — Claude finds the best match and controls it
server.tool(
  'control_device',
  {
    action: z.enum(['turn_on', 'turn_off', 'get_state']).describe('action to perform'),
    device_description: z.string().describe('natural language name of the device e.g. tank light, bedroom fan')
  },
  async ({ action, device_description }) => {
    const entities = await getAllEntities();

    // Build entity list with friendly names for Claude to match
    const entityList = entities
      .map(e => `${e.entity_id} | ${e.attributes.friendly_name || ''} | ${e.state}`)
      .join('\n');

    // Find best match using simple keyword matching
    const lowerDesc = device_description.toLowerCase();
    const match = entities.find(e => {
      const friendlyName = (e.attributes.friendly_name || '').toLowerCase();
      const entityId = e.entity_id.toLowerCase();
      return (
        friendlyName.includes(lowerDesc) ||
        lowerDesc.includes(friendlyName) ||
        entityId.includes(lowerDesc.replace(/\s+/g, '_')) ||
        lowerDesc.includes(entityId.split('.')[1].replace(/_/g, ' '))
      );
    });

    if (!match) {
      return {
        content: [{
          type: 'text',
          text: `Could not find a device matching "${device_description}".\n\nAvailable devices:\n${entityList}`
        }]
      };
    }

    if (action === 'get_state') {
      return {
        content: [{
          type: 'text',
          text: `${match.attributes.friendly_name || match.entity_id} is currently ${match.state}`
        }]
      };
    }

    const [domain] = match.entity_id.split('.');
    await callService(domain, action, match.entity_id);

    return {
      content: [{
        type: 'text',
        text: `✅ ${action === 'turn_on' ? 'Turned on' : 'Turned off'} ${match.attributes.friendly_name || match.entity_id}`
      }]
    };
  }
);

// Keep direct control tool for when entity_id is known
server.tool(
  'turn_on',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    const [domain] = entity_id.split('.');
    await callService(domain, 'turn_on', entity_id);
    return { content: [{ type: 'text', text: `✅ Turned on ${entity_id}` }] };
  }
);

server.tool(
  'turn_off',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    const [domain] = entity_id.split('.');
    await callService(domain, 'turn_off', entity_id);
    return { content: [{ type: 'text', text: `✅ Turned off ${entity_id}` }] };
  }
);

server.tool(
  'get_state',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    const res = await fetch(`${HA_URL}/api/states/${entity_id}`, {
      headers: { Authorization: `Bearer ${HA_TOKEN}` }
    });
    const data = await res.json();
    return { content: [{ type: 'text', text: `${entity_id} is ${data.state}` }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);