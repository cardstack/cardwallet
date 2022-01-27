import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useContext } from 'react';
import { Alert, Linking, ScrollView } from 'react-native';
import { Restart } from 'react-native-restart';
import GanacheUtils from '../../../cardstack/src/utils/ganache-utils';
import { ListFooter, ListItem } from '../list';
import { RadioListItem } from '../radio-list';
import { deleteAllBackups } from '@rainbow-me/handlers/cloudBackup';
import { RainbowContext } from '@rainbow-me/helpers/RainbowContext';
import { useWallets } from '@rainbow-me/hooks';
import { wipeKeychain } from '@rainbow-me/model/keychain';
import { useNavigation } from '@rainbow-me/navigation/Navigation';
import { clearImageMetadataCache } from '@rainbow-me/redux/imageMetadata';
import store from '@rainbow-me/redux/store';
import { walletsUpdate } from '@rainbow-me/redux/wallets';
import Routes from '@rainbow-me/routes';

const DeveloperSettings = () => {
  const { navigate } = useNavigation();
  const { config, setConfig } = useContext(RainbowContext);
  const { wallets, selectedWallet } = useWallets();

  const onNetworkChange = useCallback(
    value => {
      setConfig({ ...config, [value]: !config[value] });
    },
    [config, setConfig]
  );

  const connectToGanache = useCallback(async () => {
    GanacheUtils.connect(() => {
      navigate(Routes.PROFILE_SCREEN);
    });
  }, [navigate]);

  /**
   * Opens Onramper Webview for testing porpuses.
   */
  const openOnramperWebview = useCallback(async () => {
    const params = {
      // apiKey: 'OUR_API_KEY',
      color: '00EBE5', // button color
      wallets: `ETH:${selectedWallet?.addresses?.[0].address}`,
      isAddressEditable: 'false',
    };
    // URLSearchParams does not work on Android:
    // https://github.com/facebook/react-native/issues/23922
    // const url = new URL(`https://widget.onramper.com`);
    // url.search = new URLSearchParams(params);
    // Linking.openURL(url.href);
    const url = `https://widget.onramper.com?${Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`;
    console.log(url);
    Linking.openURL(url);
  }, [selectedWallet]);

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
    Restart();
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
      <ListItem label="🔄 Restart app" onPress={Restart} />
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
      <ListItem
        label="🤑 Open Onramper"
        onPress={openOnramperWebview}
        testID="onramper-section"
      />
      <ListFooter />

      {Object.keys(config)
        .sort()
        .map(key => (
          <RadioListItem
            key={key}
            label={key}
            onPress={() => onNetworkChange(key)}
            selected={!!config[key]}
          />
        ))}
    </ScrollView>
  );
};

export default DeveloperSettings;
