const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude Sentry from web builds
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Exclude problematic packages from web builds
config.resolver.blockList = [
  /node_modules\/@sentry\/.*/,
  /node_modules\/sentry-expo\/.*/,
];

module.exports = config;







