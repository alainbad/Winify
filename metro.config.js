const { getDefaultConfig } = require('expo/metro-config')
const config = getDefaultConfig(__dirname)

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Supabase uses 'ws' for Node.js — use browser native WebSocket on web
  if (platform === 'web' && moduleName === 'ws') {
    return { type: 'empty' }
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
