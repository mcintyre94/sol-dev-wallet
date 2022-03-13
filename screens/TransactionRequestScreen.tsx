import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { Buffer } from 'buffer';
import base58 from 'bs58';
import ImageUri from '../components/ImageUri';

interface TransactionRequestStatus {
  type: 'FetchingDetails' | 'FetchedDetails' | 'FetchingTransaction' | 'SimulatingTransaction' | 'SimulatedTransaction',
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

interface SimulatingTransaction extends TransactionRequestStatus {
  type: 'SimulatingTransaction',
  transaction: Transaction,
  label: string,
  icon: string,
  message?: string
}

interface SimulatedTransaction extends TransactionRequestStatus {
  type: 'SimulatedTransaction',
  differenceInSol: number,
  feeInSol: number,
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

// const publicKey = 'Fkc4FN7PPhyGsAcHPW3dBBJ4BvtYkDr2rBFBgFpvy3nB';
const connection = new Connection(clusterApiUrl('devnet'));
const secretKey = '...';
const keypair = Keypair.fromSecretKey(base58.decode(secretKey));

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
      account: keypair.publicKey,
    });

    const { transaction, message } = await response.data as TransactionResponse;
    const parsedTransaction = Transaction.from(Buffer.from(transaction, 'base64'));

    setStatus({
      type: 'SimulatingTransaction',
      transaction: parsedTransaction,
      label: fetchedDetails.label,
      icon: fetchedDetails.icon,
      message,
    } as SimulatingTransaction);
  }

  async function simulateTransaction(simulatingTransaction: SimulatingTransaction) {
    const { transaction } = simulatingTransaction;

    const balance = await connection.getBalance(keypair.publicKey, 'confirmed');
    const { value: fee } = await connection.getFeeForMessage(simulatingTransaction.transaction.compileMessage(), 'confirmed');
    const { value: { accounts } } = await connection.simulateTransaction(transaction, [keypair], [keypair.publicKey]);

    console.log({ balance, fee, accounts });

    if (!accounts || accounts.length === 0 || accounts[0] === null) { throw new Error('No accounts'); }

    const newBalance = accounts[0].lamports;
    const difference = newBalance - balance + fee;

    const feeInSol = fee / LAMPORTS_PER_SOL;
    const differenceInSol = difference / LAMPORTS_PER_SOL;

    setStatus({
      type: 'SimulatedTransaction',
      differenceInSol,
      feeInSol,
      label: simulatingTransaction.label,
      icon: simulatingTransaction.icon,
      message: simulatingTransaction.message,
    } as SimulatedTransaction);
  }

  async function simulateTransactionWhenWeShould() {
    if (status.type === 'SimulatingTransaction') {
      await simulateTransaction((status as SimulatingTransaction));
    }
  }

  useEffect(() => {
    simulateTransactionWhenWeShould();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.type]);

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

  if (status.type === 'SimulatingTransaction') {
    const simulatingTransaction = status as SimulatingTransaction;

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={simulatingTransaction.icon} height={200} width={200} />
          <Text style={styles.titleText}>{simulatingTransaction.label}</Text>
          {simulatingTransaction.message && <Text style={styles.highlightedText}>{simulatingTransaction.message}</Text>}
          <ActivityIndicator />
        </View>
        <View style={styles.bottomView}>
          <Text>Simulating transaction...</Text>
        </View>
      </View>
    );
  }

  if (status.type === 'SimulatedTransaction') {
    const simulatedTransaction = status as SimulatedTransaction;

    return (
      <View style={styles.container}>
        <View style={styles.mainView}>
          <ImageUri uri={simulatedTransaction.icon} height={200} width={200} />
          <Text style={styles.titleText}>{simulatedTransaction.label}</Text>
          {simulatedTransaction.message && <Text style={styles.highlightedText}>{simulatedTransaction.message}</Text>}

          <View style={{ height: 40 }} />

          <Text style={[styles.highlightedText]}>{Math.abs(simulatedTransaction.differenceInSol)} SOL</Text>
          <Text>Fee: {simulatedTransaction.feeInSol} SOL</Text>
        </View>
        <View style={styles.bottomView}>
          <Button title="Send" />
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
  highlightedText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
