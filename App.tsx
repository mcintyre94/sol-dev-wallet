import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TransactionRequestScreen from './screens/TransactionRequestScreen';

// Seems to be required for react-native-svg for some reason
// Put it here because you get a cycle warning if this is in index.js
import { fetch as fetchPolyfill } from 'whatwg-fetch';
import AccountsScreen from './screens/AccountsScreen';
global.fetch = fetchPolyfill;


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Solana Dev Wallet' }}
        />
        <Stack.Screen
          name="TransactionRequest"
          component={TransactionRequestScreen}
          options={{ title: 'Solana Pay' }}
        />
        <Stack.Screen
          name="Accounts"
          component={AccountsScreen}
          options={{ title: 'Accounts' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
