import { Keypair } from '@solana/web3.js';
import base58 from 'bs58';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { truncateAddress } from '../utils/addressUtils';

export interface Account {
  publicKey: string;
  privateKey: string;
  name: string;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);
  const [newName, setNewName] = useState<string | undefined>(undefined);
  const [newPrivateKey, setNewPrivateKey] = useState<string | undefined>(undefined);
  const [resolvedNewPublicKey, setResolvedNewPublicKey] = useState<string | undefined>(undefined);
  const [addingNewAccount, setAddingNewAccount] = useState(false);
  const [newAccountError, setNewAccountError] = useState<string | undefined>(undefined);

  async function getAccounts() {
    const fetchedAccounts = await EncryptedStorage.getItem('accounts');
    console.log({ fetchedAccounts });

    if (fetchedAccounts) {
      setAccounts(JSON.parse(fetchedAccounts));
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { getAccounts(); }, []);

  function resolvePublicKey(enteredPrivateKey: string) {
    try {
      const keypair = Keypair.fromSecretKey(base58.decode(enteredPrivateKey));
      setResolvedNewPublicKey(keypair.publicKey.toBase58());
    } catch (e) {
      // ignore if private key isn't valid
    }
    setNewPrivateKey(enteredPrivateKey);
  }

  async function addAccount() {
    if (!newPrivateKey) {
      setNewAccountError('Private key is required');
      return;
    }

    if (!resolvedNewPublicKey) {
      setNewAccountError('Could not get wallet address');
      return;
    }

    if (accounts && accounts.findIndex(account => account.publicKey === resolvedNewPublicKey) !== -1) {
      setNewAccountError('Account already exists');
      return;
    }

    setAddingNewAccount(true);

    const index = ((accounts?.length) || 0) + 1;

    const newAccount: Account = {
      publicKey: resolvedNewPublicKey,
      privateKey: newPrivateKey,
      name: newName || `Wallet ${index}`,
    };

    let newAccounts;
    if (accounts) {
      newAccounts = [...accounts, newAccount];
    } else {
      newAccounts = [newAccount];
    }

    await EncryptedStorage.setItem('accounts', JSON.stringify(newAccounts));
    setAccounts(newAccounts);
    setAddingNewAccount(false);
    setNewAccountError(undefined);
    setNewName(undefined);
    setNewPrivateKey(undefined);
  }

  async function deleteAccount(publicKey: string) {
    const newAccounts = accounts?.filter(account => account.publicKey !== publicKey);
    await EncryptedStorage.setItem('accounts', JSON.stringify(newAccounts));
    setAccounts(newAccounts);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Connected accounts</Text>
      <View>
        {accounts?.map((account, index) => (
          <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{account.name}</Text>
            <Text>{truncateAddress(account.publicKey)}</Text>
            <Button title="Delete" onPress={() => deleteAccount(account.publicKey)} />
          </View>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={styles.titleText}>Add account</Text>

        <View style={styles.formElement}>
          <Text>Display Name (optional)</Text>
          <TextInput
            style={{ height: 40, borderWidth: 1, borderColor: 'gray', padding: 5 }}
            placeholder="Display Name"
            onChangeText={setNewName}
            defaultValue={newName}
          />
        </View>

        <View style={styles.formElement}>
          <Text>Private Key</Text>
          <TextInput
            secureTextEntry={true}
            style={{ height: 40, borderWidth: 1, borderColor: 'gray', padding: 5 }}
            placeholder="Enter private key"
            onChangeText={resolvePublicKey}
            defaultValue={newPrivateKey}
          />
        </View>

        {resolvedNewPublicKey && (
          <View style={styles.formElement}>
            <Text>✅ Wallet address: {truncateAddress(resolvedNewPublicKey)}</Text>
          </View>
        )}

        <View style={styles.formElement}>
          {addingNewAccount ? <ActivityIndicator /> : <Button title="Import" onPress={() => addAccount()} disabled={!newPrivateKey || !resolvedNewPublicKey} />}
          {newAccountError && <Text style={{ color: 'red' }}>{newAccountError}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  formElement: {
    marginTop: 16,
  },
});
