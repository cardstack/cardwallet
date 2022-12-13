import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ScrollView } from 'react-native';
import { ListFooter, ListItem } from '../list';
import { deleteAllCloudBackups } from '@cardstack/models/rn-cloud';
import { restartApp } from '@cardstack/utils';
import { resetWallet } from '@rainbow-me/model/wallet';
import { clearImageMetadataCache } from '@rainbow-me/redux/imageMetadata';

const DeveloperSettings = () => (
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
    <ListItem label="🗑️ Remove all backups" onPress={deleteAllCloudBackups} />
    <ListFooter />
  </ScrollView>
);

export default DeveloperSettings;
