import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useMemo } from 'react';
import { Linking, NativeModules, ScrollView, Share } from 'react-native';
import styled from 'styled-components';

import { useTheme } from '../../context/ThemeContext';
import AppVersionStamp from '../AppVersionStamp';
import { Column, ColumnWithDividers } from '../layout';
import {
  ListFooter,
  ListItem,
  ListItemArrowGroup,
  ListItemDivider,
} from '../list';
import { Icon } from '@cardstack/components';
import { SettingsExternalURLs } from '@cardstack/constants';
import { getReviewFeature } from '@cardstack/services';
import networkInfo from '@rainbow-me/helpers/networkInfo';
import WalletTypes from '@rainbow-me/helpers/walletTypes';
import {
  useAccountSettings,
  useSendFeedback,
  useWallets,
} from '@rainbow-me/hooks';
import {
  AppleReviewAddress,
  REVIEW_DONE_KEY,
} from '@rainbow-me/utils/reviewAlert';

const { RainbowRequestReview, RNReview } = NativeModules;

const VersionStampContainer = styled(Column).attrs({
  align: 'center',
  justify: 'end',
})`
  flex: 1;
  padding-bottom: 19;
`;

const checkAllWallets = wallets => {
  if (!wallets) return false;
  let areBackedUp = true;
  let canBeBackedUp = false;
  let allBackedUp = true;
  Object.keys(wallets).forEach(key => {
    if (!wallets[key].backedUp && wallets[key].type !== WalletTypes.readOnly) {
      allBackedUp = false;
    }

    if (
      !wallets[key].backedUp &&
      wallets[key].type !== WalletTypes.readOnly &&
      !wallets[key].imported
    ) {
      areBackedUp = false;
    }
    if (wallets[key].type !== WalletTypes.readOnly) {
      canBeBackedUp = true;
    }
  });
  return { allBackedUp, areBackedUp, canBeBackedUp };
};

export default function SettingsSection({
  onCloseModal,
  onPressDev,
  onPressBackup,
  onPressCurrency,
  onPressIcloudBackup,
  onPressNetwork,
  onPressNotifications,
  onPressShowSecret,
}) {
  const { wallets } = useWallets();
  const { nativeCurrency, network, accountAddress } = useAccountSettings();

  const { colors } = useTheme();

  const onSendFeedback = useSendFeedback();

  const [isReviewEnabled, setReviewEnabled] = useState(false);

  useEffect(() => {
    setReviewFeature();
  }, []);

  const onPressReview = useCallback(async () => {
    if (ios) {
      onCloseModal();
      RainbowRequestReview.requestReview(handled => {
        if (!handled) {
          AsyncStorage.setItem(REVIEW_DONE_KEY, 'true');
          Linking.openURL(AppleReviewAddress);
        }
      });
    } else {
      RNReview.show();
    }
  }, [onCloseModal]);

  const onPressShare = useCallback(() => {
    Share.share({
      message: `Hello, I wanted to introduce you to Card Wallet. It makes crypto payments and loyalty rewards easy. Download it today at ${SettingsExternalURLs.cardstackHomepage}`,
    });
  }, []);

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

  const { areBackedUp, canBeBackedUp } = useMemo(
    () => checkAllWallets(wallets),
    [wallets]
  );

  const setReviewFeature = async () => {
    const { reviewActive } = await getReviewFeature();
    setReviewEnabled(reviewActive);
  };

  return (
    <ScrollView backgroundColor={colors.white}>
      <ColumnWithDividers dividerRenderer={ListItemDivider} marginTop={7}>
        {canBeBackedUp && (
          <ListItem
            icon={<Icon color="settingsTeal" name="refresh" />}
            label="Backup"
            onPress={onPressBackup}
            onPressIcloudBackup={onPressIcloudBackup}
            onPressShowSecret={onPressShowSecret}
            testID="backup-section"
          >
            <ListItemArrowGroup>
              <Icon
                iconSize="medium"
                name={areBackedUp ? 'success' : 'warning'}
              />
            </ListItemArrowGroup>
          </ListItem>
        )}
        <ListItem
          icon={<Icon color="settingsTeal" name="dollar-sign" />}
          label="Currency"
          onPress={onPressCurrency}
          testID="currency-section"
        >
          <ListItemArrowGroup>{nativeCurrency || ''}</ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="cloud" />}
          label="Network"
          onPress={onPressNetwork}
          testID="network-section"
        >
          <ListItemArrowGroup>
            {networkInfo?.[network]?.name}
          </ListItemArrowGroup>
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="bell" />}
          label="Notifications"
          onPress={onPressNotifications}
          testID="notifications-section"
        >
          <ListItemArrowGroup />
        </ListItem>
        <ListItem
          icon={<Icon color="settingsTeal" name="eye" />}
          label="View on Blockscout"
          onPress={onPressBlockscout}
          testID="blockscout-section"
        />
      </ColumnWithDividers>
      <ListFooter />
      <ColumnWithDividers dividerRenderer={ListItemDivider}>
        <ListItem
          icon={<Icon name="cardstack" />}
          label="Share"
          onPress={onPressShare}
          testID="share-section"
          value={SettingsExternalURLs.cardstackHomepage}
        />
        <ListItem
          icon={<Icon name="discord" />}
          label="Discord"
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
        {isReviewEnabled && (
          <ListItem
            icon={<Icon color="settingsTeal" name="star" />}
            label="Review"
            onPress={onPressReview}
            testID="review-section"
          />
        )}
      </ColumnWithDividers>
      {IS_DEV && (
        <>
          <ListFooter height={10} />
          <ListItem
            icon={<Icon color="red" name="smartphone" />}
            label="Developer Settings"
            onPress={onPressDev}
            testID="developer-section"
          />
        </>
      )}
      <VersionStampContainer>
        <AppVersionStamp />
      </VersionStampContainer>
    </ScrollView>
  );
}
