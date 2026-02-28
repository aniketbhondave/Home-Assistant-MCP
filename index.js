#!/usr/bin/env node
import fetch from 'node-fetch';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createSandboxServer } from './sandbox.js';
import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const HA_URL = process.env.HOME_ASSISTANT_URL ? process.env.HOME_ASSISTANT_URL.replace(/\/+$/, '') : undefined;
const HA_TOKEN = process.env.HOME_ASSISTANT_TOKEN;

if (!HA_URL || !HA_TOKEN) {
  console.error('Warning: HOME_ASSISTANT_URL and HOME_ASSISTANT_TOKEN environment variables not set. Server will work but tools may not function.');
}

const entityIdRegex = /^[a-z0-9_]+\.[a-z0-9_]+$/i;
const domainRegex = /^[a-z0-9_]+$/i;

const server = new McpServer({
  name: 'homeassistant',
  version: '1.0.0'
});

// Helper to get all entities from HA
async function getAllEntities() {
  try {
    const res = await fetch(`${HA_URL}/api/states`, {
      headers: { Authorization: `Bearer ${HA_TOKEN}` }
    });
    if (!res.ok) {
      throw new Error(`Home Assistant API error: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch entities:', error);
    return [];
  }
}

// Helper to call HA service
async function callService(domain, service, entity_id) {
  try {
    const res = await fetch(`${HA_URL}/api/services/${domain}/${service}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ entity_id })
    });
    if (!res.ok) {
      throw new Error(`Home Assistant API error: ${res.statusText}`);
    }
  } catch (error) {
    console.error(`Failed to call service ${domain}.${service}:`, error);
    throw error;
  }
}

// List all devices with friendly names
server.tool(
  'list_devices',
  { domain: z.string().optional().describe('filter by domain e.g. light, switch, fan') },
  async ({ domain }) => {
    if (domain && !domainRegex.test(domain)) {
      return { content: [{ type: 'text', text: 'Error: Invalid domain format.' }] };
    }
    const entities = await getAllEntities();
    const filtered = domain
      ? entities.filter(e => e.entity_id.startsWith(domain + '.'))
      : entities;

    const list = filtered
      .map(e => `${e.entity_id} | ${e.attributes.friendly_name || 'No name'} | ${e.state}`)
      .join('\n');

    return {
      content: [{ type: 'text', text: `Available devices:\n${list || 'None'}` }]
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
    // Sanitize input to prevent unexpected characters
    const sanitizedDesc = device_description.replace(/[^\w\s-]/gi, '').trim();
    if (!sanitizedDesc) {
      return { content: [{ type: 'text', text: 'Error: Please provide a valid device description.' }] };
    }

    const entities = await getAllEntities();

    // Build entity list with friendly names for Claude to match
    const entityList = entities
      .map(e => `${e.entity_id} | ${e.attributes.friendly_name || ''} | ${e.state}`)
      .join('\n');

    // Find best match using simple keyword matching
    const lowerDesc = sanitizedDesc.toLowerCase();
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
          text: `Could not find a device matching "${sanitizedDesc}".\n\nAvailable devices:\n${entityList || 'None'}`
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

    try {
      const [domain] = match.entity_id.split('.');
      await callService(domain, action, match.entity_id);

      return {
        content: [{
          type: 'text',
          text: `✅ ${action === 'turn_on' ? 'Turned on' : 'Turned off'} ${match.attributes.friendly_name || match.entity_id}`
        }]
      };
    } catch (error) {
      return {
        content: [{ type: 'text', text: `❌ Failed to ${action} ${match.entity_id}: ${error.message}` }]
      };
    }
  }
);

// Keep direct control tool for when entity_id is known
server.tool(
  'turn_on',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    if (!entityIdRegex.test(entity_id)) {
      return { content: [{ type: 'text', text: 'Error: Invalid entity_id format.' }] };
    }
    const [domain] = entity_id.split('.');
    try {
      await callService(domain, 'turn_on', entity_id);
      return { content: [{ type: 'text', text: `✅ Turned on ${entity_id}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `❌ Failed to turn on ${entity_id}: ${error.message}` }] };
    }
  }
);

server.tool(
  'turn_off',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    if (!entityIdRegex.test(entity_id)) {
      return { content: [{ type: 'text', text: 'Error: Invalid entity_id format.' }] };
    }
    const [domain] = entity_id.split('.');
    try {
      await callService(domain, 'turn_off', entity_id);
      return { content: [{ type: 'text', text: `✅ Turned off ${entity_id}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `❌ Failed to turn off ${entity_id}: ${error.message}` }] };
    }
  }
);

server.tool(
  'get_state',
  { entity_id: z.string() },
  async ({ entity_id }) => {
    if (!entityIdRegex.test(entity_id)) {
      return { content: [{ type: 'text', text: 'Error: Invalid entity_id format.' }] };
    }
    try {
      const res = await fetch(`${HA_URL}/api/states/${entity_id}`, {
        headers: { Authorization: `Bearer ${HA_TOKEN}` }
      });
      if (!res.ok) {
        throw new Error(`Home Assistant API error: ${res.statusText}`);
      }
      const data = await res.json();
      return { content: [{ type: 'text', text: `${entity_id} is ${data.state}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `❌ Failed to get state for ${entity_id}: ${error.message}` }] };
    }
  }
);

export { createSandboxServer };

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Home Assistant MCP Server running on stdio');
}

main().catch((error) => {
  console.error("Fatal error in main thread:", error);
  process.exit(1);
});