import { useRoute } from '@react-navigation/native';
import lang from 'i18n-js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard } from 'react-native';
import styled from 'styled-components';
import { isSamsungGalaxy } from '../../helpers/samsung';
import { saveBackupPassword } from '../../model/backup';
import { DelayedAlert } from '../alerts';
import { PasswordField } from '../fields';
import { Centered, Column } from '../layout';
import { GradientText } from '../text';
import BackupSheetKeyboardLayout from './BackupSheetKeyboardLayout';
import { Button, IconName, Text } from '@cardstack/components';
import { Device } from '@cardstack/utils/device';
import {
  cloudBackupPasswordMinLength,
  isCloudBackupPasswordValid,
} from '@rainbow-me/handlers/cloudBackup';
import {
  useBiometryIconName,
  useBooleanState,
  useDimensions,
  useRouteExistsInNavigationState,
  useWalletCloudBackup,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { margin, padding } from '@rainbow-me/styles';
import logger from 'logger';

const { cloudPlatform } = Device;

const DescriptionText = styled(Text).attrs(({ theme: { colors } }) => ({
  align: 'center',
  color: colors.alpha(colors.blueGreyDark, 0.5),
  lineHeight: 'looser',
  size: 'large',
}))`
  ${padding(0, 50)};
`;

const Masthead = styled(Centered).attrs({
  direction: 'column',
})`
  ${padding(24, 0, 42)}
  flex-shrink: 0;
`;

const MastheadIcon = styled(GradientText).attrs({
  align: 'center',
  angle: false,
  colors: ['#FFB114', '#FF54BB', '#00F0FF'],
  end: { x: 0, y: 0 },
  letterSpacing: 'roundedTight',
  size: 52,
  start: { x: 1, y: 1 },
  steps: [0, 0.5, 1],
  weight: 'bold',
})``;

const Title = styled(Text).attrs({
  size: 'large',
  weight: 'bold',
})`
  ${margin(15, 0, 12)};
`;

const samsungGalaxy = (Device.isAndroid && isSamsungGalaxy()) || false;

export default function BackupConfirmPasswordStep() {
  const { isTinyPhone } = useDimensions();
  const { params } = useRoute();
  const { goBack } = useNavigation();
  const walletCloudBackup = useWalletCloudBackup();
  const biometryIconName = useBiometryIconName();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [
    passwordFocused,
    setPasswordFocused,
    setPasswordBlurred,
  ] = useBooleanState(true);
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('􀎽 Confirm Backup');
  const passwordRef = useRef<any>();
  const { selectedWallet, setIsWalletLoading } = useWallets();
  const walletId = (params as any)?.walletId || selectedWallet.id;

  const isSettingsRoute = useRouteExistsInNavigationState(
    Routes.SETTINGS_MODAL
  );

  useEffect(() => {
    const keyboardDidShow = () => {
      setIsKeyboardOpen(true);
    };

    const keyboardDidHide = () => {
      setIsKeyboardOpen(false);
    };

    const didShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyboardDidShow
    );

    const didHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide
    );
    return () => {
      didShowListener.remove();
      didHideListener.remove();
    };
  }, []);

  useEffect(() => {
    let passwordIsValid = false;

    if (isCloudBackupPasswordValid(password)) {
      passwordIsValid = true;
      setLabel(`􀑙 Add to ${cloudPlatform} Backup`);
    }
    setValidPassword(passwordIsValid);
  }, [password, passwordFocused]);

  const onPasswordChange = useCallback(
    ({ nativeEvent: { text: inputText } }) => {
      setPassword(inputText);
    },
    []
  );

  const onError = useCallback(
    msg => {
      passwordRef.current?.focus();
      setIsWalletLoading(null);
      DelayedAlert({ title: msg }, 500);
    },
    [setIsWalletLoading]
  );

  const onSuccess = useCallback(async () => {
    logger.log('BackupConfirmPasswordStep:: saving backup password');
    await saveBackupPassword(password);
    if (!isSettingsRoute) {
      DelayedAlert({ title: lang.t('cloud.backup_success') }, 1000);
    }
    // This means the user didn't have the password saved
    // and at least an other account already backed up

    goBack();
  }, [goBack, isSettingsRoute, password]);

  const onSubmit = useCallback(async () => {
    if (!validPassword) return;
    await walletCloudBackup({
      onError,
      onSuccess,
      password,
      walletId,
    });
  }, [
    onError,
    onSuccess,
    password,
    validPassword,
    walletCloudBackup,
    walletId,
  ]);

  return (
    <BackupSheetKeyboardLayout
      footer={
        validPassword ? (
          <Button
            iconProps={
              biometryIconName
                ? {
                    iconSize: 'medium',
                    marginRight: 3,
                    name: biometryIconName as IconName,
                  }
                : undefined
            }
            onPress={onSubmit}
          >
            {label}
          </Button>
        ) : (
          <Text variant="subText">Minimum 8 characters</Text>
        )
      }
    >
      <Masthead>
        {(isTinyPhone || samsungGalaxy) && isKeyboardOpen ? null : (
          <MastheadIcon>􀙶</MastheadIcon>
        )}
        <Title>Enter backup password</Title>
        <DescriptionText>
          To add this account to your {cloudPlatform} backup, enter your
          existing backup password
        </DescriptionText>
      </Masthead>
      <Column align="center" flex={1}>
        <PasswordField
          autoFocus
          isInvalid={
            password !== '' &&
            password.length < cloudBackupPasswordMinLength &&
            !passwordRef?.current?.isFocused?.()
          }
          onBlur={setPasswordBlurred}
          onChange={onPasswordChange}
          onFocus={setPasswordFocused}
          onSubmitEditing={onSubmit}
          password={password}
          placeholder="Backup Password"
          ref={passwordRef}
        />
      </Column>
    </BackupSheetKeyboardLayout>
  );
}
