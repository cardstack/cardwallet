import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Alert, ScrollView } from 'react-native';
import RNRestart from 'react-native-restart';
import GanacheUtils from '../../../cardstack/src/utils/ganache-utils';
import { ListFooter, ListItem } from '../list';
import { Routes } from '@cardstack/navigation';
import { deleteAllBackups } from '@rainbow-me/handlers/cloudBackup';
import { useWallets } from '@rainbow-me/hooks';
import { wipeKeychain } from '@rainbow-me/model/keychain';
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
    RNRestart.Restart();
  };

  return (
    <ScrollView testID="developer-settings-modal">
      <ListItem label="💥 Clear async storage" onPress={AsyncStorage.clear} />
      <ListItem
        label="📷️ Clear Image Metadata Cache"
        onPress={clearImageMetadataCache}
      />
      <ListItem
        label="💣 Reset Keychain"
        onPress={wipeKeychain}
        testID="reset-keychain-section"
      />
      <ListItem label="🔄 Restart app" onPress={() => RNRestart.Restart()} />
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
