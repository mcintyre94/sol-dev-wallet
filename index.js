/* eslint-disable prettier/prettier */
/**
 * @format
 */

// URL polyfill: https://www.npmjs.com/package/react-native-url-polyfill
import 'react-native-url-polyfill/auto';


import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
