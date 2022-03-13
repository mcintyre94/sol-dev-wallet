import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import ImageUri from '../components/ImageUri';

interface TransactionRequestStatus {
  type: 'FetchingDetails' | 'FetchedDetails' | 'FetchingTransaction' | 'FetchedTransaction',
}

const FetchingDetails: TransactionRequestStatus = {
  type: 'FetchingDetails',
};

interface FetchedDetails extends TransactionRequestStatus {
  type: 'FetchedDetails',
  label: string,
  icon: string
}

interface TransactionsGetResponse {
  label: string,
  icon: string,
}

interface TransactionPostResponse {
  transaction: string,
  message?: string,
}

export default function TransactionRequestScreen({ route }) {
  const [status, setStatus] = useState(FetchingDetails);

  const { solanaPayUrl } = route.params;
  const decodedUrl = decodeURIComponent(solanaPayUrl);
  const { hostname } = new URL(decodedUrl);

  async function fetchDetails() {
    const response = await axios.get(decodedUrl);
    const { label, icon } = await response.data as TransactionsGetResponse;
    setStatus({ type: 'FetchedDetails', label, icon } as FetchedDetails);
  }

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status.type === 'FetchingDetails') {
    return (
      <View style={styles.container}>
        <Text>Loading transaction from {hostname}...</Text>
        <ActivityIndicator />
      </View>
    );
  }

  if (status.type === 'FetchedDetails') {
    const fetchedDetails = status as FetchedDetails;
    console.log({ fetchedDetails });

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={fetchedDetails.icon} height={200} width={200} />
          <Text style={styles.titleText}>{fetchedDetails.label}</Text>
        </View>
        <View style={styles.bottomView}>
          <Button
            title="Fetch Transaction"
          // onPress={() => fetchTransaction(fetchedDetails)}
          />
          <Text>This will send your public key to {hostname}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flex: 1,
  },
  titleText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});
