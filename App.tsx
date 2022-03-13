/* eslint-disable prettier/prettier */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TransactionRequestScreen from './screens/TransactionRequestScreen';

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
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
