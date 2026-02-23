# Home Assistant MCP

A Model Context Protocol (MCP) server that integrates Claude AI with your local Home Assistant instance, enabling natural language control of your smart home devices directly through Claude's chat interface.

## Overview

This project bridges Claude AI and Home Assistant, allowing you to:
- Control smart home devices using natural language in Claude chat
- Query device states and automation status
- Execute Home Assistant actions through conversational AI
- Keep everything local and secure with your own Home Assistant instance

## Features

- 🏠 **Local Smart Home Integration** - Your Home Assistant instance and devices stay completely local; only your chat messages go to Claude for processing/Understanding your conversation
- 🤖 **Claude AI Control** - Use natural language to control devices
- 🔐 **Secure Credentials** - Environment-based configuration keeps tokens safe
- 🔌 **MCP Protocol** - Follows Model Context Protocol standard
- ⚡ **Real-time Device Control** - Execute automations and control devices instantly
- 🌐 **MCP Standard** - Works with any AI tool/chat that supports Model Context Protocol, not limited to Claude

## Compatibility

This MCP server works with any AI assistant that supports the Model Context Protocol standard, including:
- Claude (claude.ai, Claude Desktop, Claude API)
- VS Code (with MCP extension)
- Other MCP-compatible tools (growing ecosystem)

This means your smart home integration isn't vendor-locked and will work with future AI tools that adopt the MCP standard.

## Prerequisites

- Node.js 16+ 
- Local Home Assistant instance running
- Home Assistant long-lived access token
- Claude Desktop or Claude.ai with Developer access

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/aniketbhondave/Home-Assistant-MCP.git
cd Home-Assistant-MCP
npm install
```

### 2. Get Your Home Assistant Token

1. Open your Home Assistant instance
2. Click your profile (bottom left)
3. Scroll to "Long-lived access tokens"
4. Click "Create Token"
5. Name it (e.g., "Claude MCP") and copy the token

### 3. Add to Claude Desktop

1. Click the **settings icon** (gear) in the top right
2. Click **Developer** tab
3. Click **Edit Config** button
4. Paste this configuration:

```json
{
  "mcpServers": {
    "home-assistant": {
      "command": "bash",
      "args": [
        "-c",
        "cd /path/to/Home-Assistant-MCP && HOME_ASSISTANT_URL=http://192.168.x.xxx:8123 HOME_ASSISTANT_TOKEN=your-token-here node index.js"
      ]
    }
  }
}
```

5. Replace the following:
   - `/path/to/Home-Assistant-MCP` - Full path to your project (e.g., `/Users/yourname/Home-Assistant-MCP`)
   - `http://192.168.x.xxx:8123` - Your Home Assistant URL (use IP address, not homeassistant.local)
   - `your-token-here` - The token you copied from Home Assistant

6. Click **Save**
7. Restart Claude Desktop completely (close and reopen)

### 4. Test It

Ask Claude:
- "List all my devices"
- "Turn on the bedroom light"
- "What devices are currently on?"

Done! 🎉

### Example Commands

- "List all my devices"
- "Turn on the bedroom light"
- "What devices are currently on?"
- "Turn off all lights"
- "Get the status of my kitchen fan"

Claude will understand natural language and communicate with your Home Assistant instance to perform the requested actions.

## Project Structure

```
Home-Assistant-MCP/
├── index.js                 # Main MCP server entry point
├── .env.example            # Environment variables template
├── .gitignore              # Git configuration
├── package.json            # Node.js dependencies
├── README.md               # This file
└── LICENSE                 # MIT License
```

### Smithery Deployment

This MCP is ready and planned to be deployed to Smithery. Users will be able to install it directly through the Smithery marketplace (TODO).

## Security Notes

- Use IP addresses instead of hostnames (homeassistant.local) for Home Assistant URL
- Keep your Home Assistant token secure and rotate it periodically
- Use strong authentication for your Home Assistant instance
- Always verify the Home Assistant instance is accessible only from trusted networks

## Status & Roadmap

🚧 **Work in Progress**

Current features and planned enhancements:

- [x] Basic MCP server setup
- [x] Home Assistant connection
- [x] Check device status via Claude
- [x] Turn devices on/off via Claude
- [x] Natural language device matching
- [ ] Brightness and color control
- [ ] Automation triggering
- [ ] Climate control (temperature, humidity)
- [ ] Enhanced error handling
- [ ] Batch device operations
- [ ] Device state caching for performance
- [ ] Advanced scene management

## Troubleshooting

### "Server transport closed unexpectedly"
- Verify the path to your Home Assistant MCP project is correct
- Check that Home Assistant URL and token are correct (no typos)
- Ensure Home Assistant is accessible from your machine
- Restart Claude Desktop completely

### "Cannot connect to Home Assistant"
- Verify `HOME_ASSISTANT_URL` is correct (use IP, not hostname)
- Check the token hasn't expired - create a new one if needed
- Ensure Home Assistant is running
- Verify the machine running Claude can reach Home Assistant IP

### Device Control Not Working
- Verify the token has appropriate permissions in Home Assistant
- Check that devices exist in your Home Assistant instance
- Review Claude's responses for specific error messages

### MCP Server not showing in Claude
- Restart Claude Desktop completely (close and reopen)
- Check JSON syntax in config file (invalid JSON will be ignored)
- Verify all paths are absolute (full paths, not relative)

## License

MIT License

Copyright (c) 2026 Aniket Bhondave

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support

For help and questions:
- Check the [Troubleshooting](#troubleshooting) section above
- Review [Home Assistant documentation](https://www.home-assistant.io/docs/)
- Check [MCP documentation](https://modelcontextprotocol.io/docs/)
- Open an issue on [GitHub](https://github.com/aniketbhondave/Home-Assistant-MCP/issues)

## Acknowledgments

- Built with [Home Assistant](https://www.home-assistant.io/)
- Powered by [Claude AI](https://claude.ai/)
- Follows [Model Context Protocol](https://modelcontextprotocol.io/) standards

---

**Note:** This project is in active development. Features and APIs may change. Please refer to README for updates.
