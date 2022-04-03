import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      {/* <Button
        title="Go to Transaction"
        onPress={() =>
          navigation.navigate('TransactionRequest', {
            solanaPayUrl:
              //'https://solana-pay-nextjs-git-cm-next-api-get-deploy-mcintyre1994.vercel.app/api?recipient=9AUvdLggr4DezH1FEHFBVqQPNUF9q6sZGTYoPMyum2sk&amount=0.1234&reference=GMJuFXzLvvoty5p6La9H7tuTx6p2CSxbZtepa1aBA1q9&label=callum%27s cookies&message=enjoy your cookies%21',
              // 'http://localhost:3000/api/makeTransaction?box-of-cookies=1&basket-of-cookies=0&reference=4zPgV1YpA9ixQQD8Q53EC5C929iFv1aLFCFtSMrFWo7B',
              'https://solana-pay-tutorial-iockfnjq0-pointer-gg.vercel.app/api/makeTransaction?basket-of-cookies=0&box-of-cookies=1&reference=8nLhpC9qvFSVWQKi5ZK118Sz98SKMufdasXqjAsfegPq',
          })
        }
      /> */}
      <Button
        title="Accounts"
        onPress={() => navigation.navigate('Accounts')}
      />
      <Button
        title="Scan QR Code"
        onPress={() => navigation.navigate('QRCodeScan')}
      />
    </View>
  );
}
