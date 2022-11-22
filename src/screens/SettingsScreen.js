import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';

import { CenteredContainer, Icon, ScrollView } from '@cardstack/components';
import { SettingsExternalURLs } from '@cardstack/constants';
import { useSelectedWallet } from '@cardstack/hooks';
import { Routes } from '@cardstack/navigation';
import AppVersionStamp from '@rainbow-me/components/AppVersionStamp';
import { ColumnWithDividers } from '@rainbow-me/components/layout';
import {
  ListFooter,
  ListItem,
  ListItemArrowGroup,
  ListItemDivider,
} from '@rainbow-me/components/list';
import { useAccountSettings, useSendFeedback } from '@rainbow-me/hooks';

export default function SettingsScreen() {
  const { navigate } = useNavigation();
  const { params } = useRoute();
  const { hasManualBackup } = useSelectedWallet();
  const { nativeCurrency, network, accountAddress } = useAccountSettings();
  const networkName = getConstantByNetwork('name', network);
  const onSendFeedback = useSendFeedback();

  const onPressDiscord = useCallback(() => {
    Linking.openURL(SettingsExternalURLs.discordInviteLink);
  }, []);

  const onPressTwitter = useCallback(async () => {
    Linking.canOpenURL(SettingsExternalURLs.twitterDeepLink).then(supported =>
      supported
        ? Linking.openURL(SettingsExternalURLs.twitterDeepLink)
        : Linking.openURL(SettingsExternalURLs.twitterWebUrl)
    );
  }, []);

  const onPressBlockscout = useCallback(() => {
    const blockExplorer = getConstantByNetwork('blockExplorer', network);
    Linking.openURL(`${blockExplorer}/address/${accountAddress}`);
  }, [accountAddress, network]);

  const onPressSection = useCallback(
    section => () => {
      navigate(section, params);
    },
    [navigate, params]
  );

  useEffect(() => {
    if (params?.initialRoute) {
      navigate(params?.initialRoute, params);
    }
  }, [navigate, params]);

  return (
    <ScrollView backgroundColor="white">
      <ColumnWithDividers dividerRenderer={ListItemDivider} marginTop={7}>
        <ListItem
          icon={<Icon color="settingsTeal" name="camera-icon" />}
          label="My Wallet Address"
          onPress={onPressSection(Routes.MY_WALLET_ADDRESS_SECTION)}
        >
          <ListItemArrowGroup />
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="walletConnect" />}
          label="WalletConnect Sessions"
          onPress={onPressSection(Routes.WC_LEGACY_SESSIONS_SECTION)}
        >
          <ListItemArrowGroup />
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="walletConnect" />}
          label="WalletConnect v2"
          onPress={onPressSection(Routes.WC_SESSIONS_SECTION)}
        >
          <ListItemArrowGroup />
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="cloud" />}
          label="Network"
          onPress={onPressSection(Routes.NETWORK_SECTION)}
          testID="network-section"
        >
          <ListItemArrowGroup>{networkName}</ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="dollar-sign" />}
          label="Currency"
          onPress={onPressSection(Routes.CURRENCY_SECTION)}
          testID="currency-section"
        >
          <ListItemArrowGroup>{nativeCurrency || ''}</ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="bell" />}
          label="Notifications"
          onPress={onPressSection(Routes.NOTIFICATIONS_SECTION)}
          testID="notifications-section"
        >
          <ListItemArrowGroup />
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="lock" />}
          label="Security"
          onPress={onPressSection(Routes.SECURITY_SECTION)}
        >
          <ListItemArrowGroup />
        </ListItem>
      </ColumnWithDividers>
      <ListFooter />
      <ColumnWithDividers dividerRenderer={ListItemDivider}>
        <ListItem
          icon={<Icon color="settingsTeal" name="refresh" />}
          label="Backup"
          onPress={onPressSection(Routes.BACKUP_RECOVERY_PHRASE)}
          testID="backup-section"
        >
          <ListItemArrowGroup showArrow={false}>
            <Icon
              iconSize="medium"
              name={hasManualBackup ? 'success' : 'warning'}
            />
          </ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="eye" />}
          label="View on Blockscout"
          onPress={onPressBlockscout}
          testID="blockscout-section"
        />
        <ListItem
          icon={<Icon name="discord" />}
          label="Join Cardstack Discord"
          onPress={onPressDiscord}
          testID="discord-section"
          value={SettingsExternalURLs.cardstackHomepage}
        />
        <ListItem
          icon={<Icon color="settingsTeal" name="twitter" />}
          label="Follow"
          onPress={onPressTwitter}
          testID="twitter-section"
          value={SettingsExternalURLs.twitterWebUrl}
        />
        <ListItem
          icon={<Icon color="settingsTeal" name="life-buoy" />}
          label={ios ? 'Support' : 'Feedback & Bug Reports'}
          onPress={onSendFeedback}
          testID="feedback-section"
        />
      </ColumnWithDividers>
      {__DEV__ && (
        <>
          <ListFooter height={10} />
          <ListItem
            icon={<Icon color="red" name="smartphone" />}
            label="Developer Settings"
            onPress={onPressSection(Routes.DEV_SECTION)}
            testID="developer-section"
          />
          <ListFooter height={10} />
          <ListItem
            icon={<Icon color="black" name="archive" />}
            label="Design System"
            onPress={onPressSection(Routes.DESIGN_SYSTEM)}
          />
        </>
      )}
      <CenteredContainer flex={1} paddingBottom={8} paddingTop={2}>
        <AppVersionStamp showBetaUserDisclaimer />
      </CenteredContainer>
    </ScrollView>
  );
}
