import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function createSandboxServer() {
    const sandboxServer = new McpServer({
        name: 'homeassistant',
        version: '1.0.0'
    });

    sandboxServer.tool(
        'list_devices',
        { domain: z.string().optional().describe('filter by domain e.g. light, switch, fan') },
        async ({ domain }) => {
            return { content: [{ type: 'text', text: 'Mock: List devices' }] };
        }
    );

    sandboxServer.tool(
        'control_device',
        {
            action: z.enum(['turn_on', 'turn_off', 'get_state']).describe('action to perform'),
            device_description: z.string().describe('natural language name of the device e.g. tank light, bedroom fan')
        },
        async ({ action, device_description }) => {
            return { content: [{ type: 'text', text: 'Mock: Device controlled' }] };
        }
    );

    sandboxServer.tool(
        'turn_on',
        { entity_id: z.string() },
        async ({ entity_id }) => {
            return { content: [{ type: 'text', text: 'Mock: Device turned on' }] };
        }
    );

    sandboxServer.tool(
        'turn_off',
        { entity_id: z.string() },
        async ({ entity_id }) => {
            return { content: [{ type: 'text', text: 'Mock: Device turned off' }] };
        }
    );

    sandboxServer.tool(
        'get_state',
        { entity_id: z.string() },
        async ({ entity_id }) => {
            return { content: [{ type: 'text', text: 'Mock: Device state retrieved' }] };
        }
    );

    return sandboxServer;
}