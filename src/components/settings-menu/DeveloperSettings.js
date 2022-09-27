import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Alert, ScrollView } from 'react-native';
import GanacheUtils from '../../../cardstack/src/utils/ganache-utils';
import { ListFooter, ListItem } from '../list';
import { deleteAllBackups } from '@cardstack/models/rn-cloud';
import { Routes } from '@cardstack/navigation';
import { restartApp } from '@cardstack/utils';
import { useWallets } from '@rainbow-me/hooks';
import { resetWallet } from '@rainbow-me/model/wallet';
import { clearImageMetadataCache } from '@rainbow-me/redux/imageMetadata';
import store from '@rainbow-me/redux/store';
import { walletsUpdate } from '@rainbow-me/redux/wallets';

const DeveloperSettings = () => {
  const { navigate } = useNavigation();
  const { wallets } = useWallets();

  const connectToGanache = useCallback(async () => {
    GanacheUtils.connect(() => {
      navigate(Routes.HOME_SCREEN);
    });
  }, [navigate]);

  const removeBackups = async () => {
    const newWallets = { ...wallets };
    Object.keys(newWallets).forEach(key => {
      delete newWallets[key].backedUp;
      delete newWallets[key].backupDate;
      delete newWallets[key].backupFile;
      delete newWallets[key].backupType;
    });

    await store.dispatch(walletsUpdate(newWallets));

    // Delete all backups (debugging)
    await deleteAllBackups();

    Alert.alert('Backups deleted succesfully');
    restartApp();
  };

  return (
    <ScrollView testID="developer-settings-modal">
      <ListItem label="💥 Clear async storage" onPress={AsyncStorage.clear} />
      <ListItem
        label="📷️ Clear Image Metadata Cache"
        onPress={clearImageMetadataCache}
      />
      <ListItem
        label="💣 Reset Wallet"
        onPress={resetWallet}
        testID="reset-keychain-section"
      />
      <ListItem label="🔄 Restart app" onPress={restartApp} />
      <ListItem label="🗑️ Remove all backups" onPress={removeBackups} />
      <ListItem
        label="🤷 Restore default experimental config"
        onPress={() => AsyncStorage.removeItem('experimentalConfig')}
      />
      <ListItem
        label="‍👾 Connect to ganache"
        onPress={connectToGanache}
        testID="ganache-section"
      />
      <ListFooter />
    </ScrollView>
  );
};

export default DeveloperSettings;
