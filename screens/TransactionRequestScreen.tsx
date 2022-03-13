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

interface FetchingTransaction extends TransactionRequestStatus {
  type: 'FetchingTransaction',
  label: string,
  icon: string
}

interface FetchedTransaction extends TransactionRequestStatus {
  type: 'FetchedTransaction',
  transaction: string,
  label: string,
  icon: string,
  message?: string
}

interface TransactionDetailsResponse {
  label: string,
  icon: string,
}

interface TransactionResponse {
  transaction: string,
  message?: string,
}

const publicKey = 'Fkc4FN7PPhyGsAcHPW3dBBJ4BvtYkDr2rBFBgFpvy3nB';

export default function TransactionRequestScreen({ route }) {
  const [status, setStatus] = useState(FetchingDetails);

  const { solanaPayUrl } = route.params;
  const decodedUrl = decodeURIComponent(solanaPayUrl);
  const { hostname } = new URL(decodedUrl);

  async function fetchDetails() {
    const response = await axios.get(decodedUrl);
    const { label, icon } = await response.data as TransactionDetailsResponse;
    setStatus({ type: 'FetchedDetails', label, icon } as FetchedDetails);
  }

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTransaction(fetchedDetails: FetchedDetails) {
    setStatus({ type: 'FetchingTransaction', label: fetchedDetails.label, icon: fetchedDetails.icon } as FetchingTransaction);

    const response = await axios.post(decodedUrl, {
      account: publicKey,
    });

    const { transaction, message } = await response.data as TransactionResponse;

    setStatus({ type: 'FetchedTransaction', transaction, label: fetchedDetails.label, icon: fetchedDetails.icon, message } as FetchedTransaction);
  }

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

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={fetchedDetails.icon} height={200} width={200} />
          <Text style={styles.titleText}>{fetchedDetails.label}</Text>
        </View>
        <View style={styles.bottomView}>
          <Button
            title="Fetch Transaction"
            onPress={() => fetchTransaction(fetchedDetails)}
          />
          <Text>This will send your public key to {hostname}</Text>
        </View>
      </View>
    );
  }

  if (status.type === 'FetchingTransaction') {
    const fetchedDetails = status as FetchingTransaction;

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={fetchedDetails.icon} height={200} width={200} />
          <Text style={styles.titleText}>{fetchedDetails.label}</Text>
        </View>
        <View style={styles.bottomView}>
          <ActivityIndicator />
          <Text>This will send your public key to {hostname}</Text>
        </View>
      </View>
    );
  }

  if (status.type === 'FetchedTransaction') {
    const fetchedTransaction = status as FetchedTransaction;

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={fetchedTransaction.icon} height={200} width={200} />
          <Text style={styles.titleText}>{fetchedTransaction.label}</Text>
          {fetchedTransaction.message && <Text>{fetchedTransaction.message}</Text>}
          <Text>{fetchedTransaction.transaction}</Text>
        </View>
        <View style={styles.bottomView}>
          <Button
            title="Confirm Transaction"
          // onPress={() => fetchTransaction(fetchedDetails)}
          />
        </View>
      </View>
    )
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
