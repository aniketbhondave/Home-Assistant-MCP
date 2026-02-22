# Home Assistant MCP

A Model Context Protocol (MCP) server that integrates Claude AI with your local Home Assistant instance, enabling natural language control of your smart home devices directly through Claude's chat interface.

## Overview

This project bridges Claude AI and Home Assistant, allowing you to:
- Control smart home devices using natural language in Claude chat
- Query device states and automation status
- Execute Home Assistant actions through conversational AI
- Keep everything local and secure with your own Home Assistant instance

## Features

- 🏠 **Local Home Assistant Integration** - Connects to your local Home Assistant instance
- 🤖 **Claude AI Control** - Use natural language to control devices
- 🔐 **Secure Credentials** - Environment-based configuration keeps tokens safe
- 🔌 **MCP Protocol** - Follows Model Context Protocol standard
- ⚡ **Real-time Device Control** - Execute automations and control devices instantly


## Compatibility

This MCP server works with any AI assistant that supports the Model Context Protocol standard, including:
- Claude (claude.ai, Claude API)
- VS Code (with MCP extension)
- Other MCP-compatible tools (growing ecosystem)

This means your smart home integration isn't vendor-locked and will work with future AI tools that adopt the MCP standard.


## Prerequisites

- Node.js 16+ 
- Local Home Assistant instance running
- Home Assistant long-lived access token
- Claude AI integration

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/aniketbhondave/Home-Assistant-MCP.git
cd Home-Assistant-MCP
npm install
```

### 2. Configure Environment Variables

Copy the example configuration:
```bash
cp .env.example .env
```

Edit `.env` and add your Home Assistant details:
```
HOME_ASSISTANT_URL=http://your-home-assistant-ip:8123
HOME_ASSISTANT_TOKEN=your_long_lived_access_token
NODE_ENV=development
```

**How to get your Home Assistant token:**
1. Go to your Home Assistant instance
2. Click your profile (bottom left)
3. Scroll to "Long-lived access tokens"
4. Create a new token
5. Copy and paste it in `.env`

### 3. Start the Server

```bash
npm start
```

The MCP server will be ready to connect with Claude.

## Usage

Once connected to Claude:

### Example Commands

- "List All my devices"
- "Turn on bedroom light"
- "What devices are currently on?"
- "Turn off all lights"

Claude will understand natural language and communicate with your Home Assistant instance to perform the requested actions.


## Configuration

All configuration is handled through environment variables in the `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `HOME_ASSISTANT_URL` | Your Home Assistant instance URL | `http://192.168.x.xxx:8123` |
| `HOME_ASSISTANT_TOKEN` | Long-lived access token | `eyJhbG...` |
| `NODE_ENV` | Environment mode | `development` or `production` |

## Deployment

### Local Testing
```bash
npm start
```

### Smithery Deployment

This project is designed to be deployed to Smithery. Instructions for Smithery deployment will be added once the project is published.

## Security Notes

- ⚠️ **Never commit `.env` file** - it contains sensitive credentials
- Always use HTTPS in production environments
- Keep your Home Assistant token secure and rotate it periodically
- Use strong authentication for your Home Assistant instance

## Status & Roadmap

🚧 **Work in Progress**

Current features and planned enhancements:

- [x] Basic MCP server setup
- [x] Home Assistant connection
- [x] Check Device Status via Claude
- [x] Turn On/OFF Devices via Claude
- [ ] Enhanced error handling
- [ ] Support for more complex automations
- [ ] Advanced scene management
- [ ] Device state caching for performance

## Troubleshooting

### Connection Issues
- Verify `HOME_ASSISTANT_URL` is accessible from your machine
- Check your Home Assistant logs for authentication errors
- Ensure the token hasn't expired

### Device Control Not Working
- Verify the token has appropriate permissions in Home Assistant
- Check that devices exist in your Home Assistant instance
- Review Claude's responses for error messages

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Check that variable names match exactly
- Restart the server after changing `.env`


## License

MIT License

Copyright (c) 2024 [Your Name/Username]

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

## Acknowledgments

- Built with [Home Assistant](https://www.home-assistant.io/)
- Powered by [Claude AI](https://claude.ai/)
- Follows [Model Context Protocol](https://modelcontextprotocol.io/) standards

---

**Note:** This project is in active development. Features and APIs may change. Please refer to the latest documentation for updates.
