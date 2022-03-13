import React from "react";
import { View, Text } from "react-native";

export default function TransactionRequestScreen({ route }) {
  const { solanaPayUrl } = route.params;
  const decodedUrl = decodeURIComponent(solanaPayUrl);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{decodedUrl}</Text>
    </View>
  );
}
