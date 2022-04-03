'use strict';

import React from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { BarCodeReadEvent, RNCamera } from 'react-native-camera';

export default function QRCodeScanScreen({ navigation }) {
  function onSuccess(e: BarCodeReadEvent) {
    const data = e.data;
    if (data.startsWith('solana:https')) {
      const url = decodeURI(data.slice('solana:'.length));
      console.log({ data, url });

      navigation.navigate('TransactionRequest', {
        solanaPayUrl: url,
      });
    } else {
      console.error('Unknown QR code format:', data);
    }
  }

  return (
    <QRCodeScanner
      onRead={onSuccess}
      flashMode={RNCamera.Constants.FlashMode.auto}
    />
  );
}
