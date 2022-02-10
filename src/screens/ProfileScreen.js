import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { BackButton, Header, HeaderButton } from '../components/header';
import { Page } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useAccountProfile, useAccountSettings } from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import {
  CenteredContainer,
  Icon,
  Text,
  TransactionList,
} from '@cardstack/components';
import { colors } from '@cardstack/theme';
import networkTypes from '@rainbow-me/helpers/networkTypes';
import Routes from '@rainbow-me/routes';
import { position } from '@rainbow-me/styles';

const ProfileScreenPage = styled(Page)`
  ${position.size('100%')};
  flex: 1;
`;

const radiusWrapperStyle = {
  alignItems: 'center',
  height: 42,
  justifyContent: 'center',
  marginLeft: 5,
  width: 42,
};

export default function ProfileScreen() {
  const { navigate } = useNavigation();

  const { network } = useAccountSettings();
  const { accountAddress } = useAccountProfile();

  const onPressBackButton = useCallback(() => navigate(Routes.WALLET_SCREEN), [
    navigate,
  ]);

  const onPressSettings = useCallback(() => navigate(Routes.SETTINGS_MODAL), [
    navigate,
  ]);

  const onChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const addCashAvailable = network === networkTypes.mainnet;

  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);

  return (
    <ProfileScreenPage color={colors.backgroundBlue} testID="profile-screen">
      <Header marginVertical={2}>
        <CenteredContainer
          flex={1}
          flexDirection="row"
          justifyContent="space-between"
        >
          <HeaderButton
            onPress={onPressSettings}
            opacityTouchable={false}
            radiusAndroid={42}
            radiusWrapperStyle={radiusWrapperStyle}
            testID="settings-button"
          >
            <Icon color="teal" iconSize="large" name="settings" />
          </HeaderButton>
          <Text color="white" fontWeight="bold">
            ACTIVITY
          </Text>
          <BackButton
            color="teal"
            direction="right"
            onPress={onPressBackButton}
          />
        </CenteredContainer>
      </Header>
      <TransactionList
        Header={
          <ProfileMasthead
            addCashAvailable={addCashAvailable}
            onChangeWallet={onChangeWallet}
            setCopiedText={setCopiedText}
            setCopyCount={setCopyCount}
          />
        }
        accountAddress={accountAddress}
      />
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </ProfileScreenPage>
  );
}
