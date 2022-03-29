import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Account } from '../screens/AccountsScreen';
import { FetchedDetails, styles } from '../screens/TransactionRequestScreen';
import { truncateAddress } from '../utils/addressUtils';
import ImageUri from './ImageUri';

interface AccountPickerProps {
  accounts: Account[];
  setSelectedAccount: Dispatch<SetStateAction<Account | undefined>>;
}

function AccountPicker({ accounts, setSelectedAccount }: AccountPickerProps) {
  const accountItems = accounts.map(account => ({
    label: `${account.name} (${truncateAddress(account.publicKey)})`,
    value: JSON.stringify(account),
  }));

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(accountItems);
  const [value, setValue] = useState(undefined);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onChangeValue={(accountJson) => {
        if (accountJson) {
          setSelectedAccount(JSON.parse(accountJson as string));
        } else {
          setSelectedAccount(undefined);
        }
      }}
    />
  );
}

interface FetchedDetailsSnippetProps {
  accounts: Account[];
  fetchedDetails: FetchedDetails;
  hostname: string;
  setSelectedAccount: Dispatch<SetStateAction<Account | undefined>>;
  fetchTransaction: (f: FetchedDetails) => Promise<void>
}

export default function FetchedDetailsSnippet({ accounts, fetchedDetails, hostname, setSelectedAccount, fetchTransaction }: FetchedDetailsSnippetProps) {
  return (
    <>
      <View style={styles.mainView}>
        <ImageUri uri={fetchedDetails.icon} height={200} width={200} />
        <Text style={styles.titleText}>{fetchedDetails.label}</Text>
      </View>
      <View style={styles.bottomView}>
        <AccountPicker accounts={accounts} setSelectedAccount={setSelectedAccount} />
        <Button
          title="Fetch Transaction"
          onPress={() => fetchTransaction(fetchedDetails)}
        />
        <Text>This will send your public key to {hostname}</Text>
      </View>
    </>
  );
}
