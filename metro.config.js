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

// Create a resolver that excludes gesture-handler for web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block gesture-handler for web platform
  if (platform === 'web' && moduleName === 'react-native-gesture-handler') {
    return {
      type: 'empty',
    };
  }
  
  // Use default resolver for everything else
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;










