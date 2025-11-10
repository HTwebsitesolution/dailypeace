// Import gesture-handler at the top (required for React Navigation on native)
// Metro config excludes it from web builds, so this is safe
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import App from './app/index';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);