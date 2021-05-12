import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { IS_TESTING } from 'react-native-dotenv';
import styled from 'styled-components';

import { ActivityList } from '../components/activity-list';
import { BackButton, Header, HeaderButton } from '../components/header';
import { Page } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import NetworkTypes from '../helpers/networkTypes';

import {
  useAccountSettings,
  useAccountTransactions,
  useRequests,
} from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import { Icon } from '@cardstack/components';
import Routes from '@rainbow-me/routes';
import { position } from '@rainbow-me/styles';

const ACTIVITY_LIST_INITIALIZATION_DELAY = 5000;

const ProfileScreenPage = styled(Page)`
  ${position.size('100%')};
  flex: 1;
`;

export default function ProfileScreen({ navigation }) {
  const [activityListInitialized, setActivityListInitialized] = useState(false);
  const isFocused = useIsFocused();
  const { navigate } = useNavigation();

  const accountTransactions = useAccountTransactions(
    activityListInitialized,
    isFocused
  );
  const {
    isLoadingTransactions: isLoading,
    sections,

    transactionsCount,
  } = accountTransactions;
  const { pendingRequestCount } = useRequests();
  const { network } = useAccountSettings();

  const isEmpty = !transactionsCount && !pendingRequestCount;

  useEffect(() => {
    setTimeout(() => {
      setActivityListInitialized(true);
    }, ACTIVITY_LIST_INITIALIZATION_DELAY);
  }, []);

  const onPressBackButton = useCallback(() => navigate(Routes.WALLET_SCREEN), [
    navigate,
  ]);

  const onPressSettings = useCallback(() => navigate(Routes.SETTINGS_MODAL), [
    navigate,
  ]);

  const onChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const addCashSupportedNetworks =
    network === NetworkTypes.kovan || network === NetworkTypes.mainnet;
  const addCashAvailable =
    IS_TESTING === 'true' ? false : addCashSupportedNetworks;

  return (
    <ProfileScreenPage testID="profile-screen">
      <Header backgroundColor="backgroundBlue">
        <HeaderButton
          onPress={onPressSettings}
          opacityTouchable={false}
          radiusAndroid={42}
          radiusWrapperStyle={{
            alignItems: 'center',
            height: 42,
            justifyContent: 'center',
            marginLeft: 5,
            width: 42,
          }}
          testID="settings-button"
        >
          <Icon color="blue" iconSize="large" name="settings" />
        </HeaderButton>
        <BackButton
          color="blue"
          direction="right"
          onPress={onPressBackButton}
        />
      </Header>
      <ActivityList
        addCashAvailable={addCashAvailable}
        header={
          <ProfileMasthead
            addCashAvailable={addCashAvailable}
            onChangeWallet={onChangeWallet}
          />
        }
        isEmpty={isEmpty}
        isLoading={isLoading}
        navigation={navigation}
        network={network}
        recyclerListView={ios}
        sections={sections}
        {...accountTransactions}
      />
    </ProfileScreenPage>
  );
}
