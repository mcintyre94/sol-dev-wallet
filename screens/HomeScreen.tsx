import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Transaction"
        onPress={() =>
          navigation.navigate('TransactionRequest', {
            solanaPayUrl:
              'https://solana-pay-nextjs-git-cm-next-api-get-deploy-mcintyre1994.vercel.app/api?recipient=9AUvdLggr4DezH1FEHFBVqQPNUF9q6sZGTYoPMyum2sk&amount=1&reference=48grsY5YrtBik6A7FWu3etvKHbqnYKdxqJ5wvALYRFnP&label=callum%27s cookies&message=thanks%21',
          })
        }
      />
    </View>
  );
}
