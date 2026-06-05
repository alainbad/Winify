const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

config.resolver.extraNodeModules = {
  'web-streams-polyfill': path.resolve(__dirname, 'node_modules/web-streams-polyfill'),
}

module.exports = config
