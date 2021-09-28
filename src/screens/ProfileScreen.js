import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { ENABLE_PAYMENTS } from '../../cardstack/src/constants';

import { BackButton, Header, HeaderButton } from '../components/header';
import { Page } from '../components/layout';
import { ProfileMasthead } from '../components/profile';
import { CopyToast, ToastPositionContainer } from '../components/toasts';
import { useAccountProfile, useAccountSettings } from '../hooks';
import { useNavigation } from '../navigation/Navigation';
import { Icon, TransactionList } from '@cardstack/components';
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
  const isFocused = useIsFocused();
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

  const addCashAvailable = network === networkTypes.mainnet && ENABLE_PAYMENTS;
  const [copiedText, setCopiedText] = useState(undefined);
  const [copyCount, setCopyCount] = useState(0);

  return (
    <ProfileScreenPage testID="profile-screen">
      <Header backgroundColor="backgroundBlue">
        <HeaderButton
          onPress={onPressSettings}
          opacityTouchable={false}
          radiusAndroid={42}
          radiusWrapperStyle={radiusWrapperStyle}
          testID="settings-button"
        >
          <Icon color="teal" iconSize="large" name="settings" />
        </HeaderButton>
        <BackButton
          color="teal"
          direction="right"
          onPress={onPressBackButton}
        />
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
        isFocused={isFocused}
      />
      <ToastPositionContainer>
        <CopyToast copiedText={copiedText} copyCount={copyCount} />
      </ToastPositionContainer>
    </ProfileScreenPage>
  );
}
