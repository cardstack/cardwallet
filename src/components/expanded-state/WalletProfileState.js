import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { useTheme } from '../../context/ThemeContext';
import { getRandomColor } from '../../styles/colors';
import Divider from '../Divider';
import { ButtonPressAnimation } from '../animations';
import ImageAvatar from '../contacts/ImageAvatar';
import CopyTooltip from '../copy-tooltip';
import { ProfileAvatarButton, ProfileModal, ProfileNameInput } from './profile';
import {
  Container,
  OptionItem,
  Text,
  TruncatedAddress,
} from '@cardstack/components';
import theme from '@cardstack/theme';
import {
  removeFirstEmojiFromString,
  returnStringFirstEmoji,
} from '@rainbow-me/helpers/emojiHandler';
import { useAccountProfile, useBiometryIconName } from '@rainbow-me/hooks';

import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { padding } from '@rainbow-me/styles';

const Spacer = styled.View`
  height: 19;
`;

const ProfileImage = styled(ImageAvatar)`
  margin-bottom: 15;
`;

const WalletProfileDivider = styled(Divider).attrs(() => ({
  borderRadius: 1,
  color: theme.colors['borderGray'],
  inset: false,
}))``;

const WalletProfileModal = styled(ProfileModal).attrs({
  dividerRenderer: WalletProfileDivider,
})`
  ${padding(24, 0, 0)};
  width: 100%;
`;

export default function WalletProfileState({
  actionType,
  address,
  isNewProfile,
  onCloseModal,
  profile,
}) {
  const nameEmoji = returnStringFirstEmoji(profile?.name);
  const { goBack, navigate } = useNavigation();
  const { accountImage } = useAccountProfile();

  const { colors } = useTheme();
  const [color, setColor] = useState(
    (profile.color !== null && profile.color) || getRandomColor()
  );

  const [value, setValue] = useState(
    profile?.name ? removeFirstEmojiFromString(profile.name).join('') : ''
  );
  const inputRef = useRef(null);

  const handleCancel = useCallback(() => {
    goBack();
    if (actionType === 'Create') {
      navigate(Routes.CHANGE_WALLET_SHEET);
    }
  }, [actionType, goBack, navigate]);

  const handleSubmit = useCallback(() => {
    onCloseModal({
      color,
      name: nameEmoji ? `${nameEmoji} ${value}` : value,
    });

    // Dismiss WalletProfileModal
    goBack();

    if (actionType === 'Create' && isNewProfile) {
      navigate(Routes.CHANGE_WALLET_SHEET);
    }
  }, [
    actionType,
    color,
    goBack,
    isNewProfile,
    nameEmoji,
    navigate,
    onCloseModal,
    value,
  ]);

  const handleTriggerFocusInput = useCallback(() => inputRef.current?.focus(), [
    inputRef,
  ]);

  const biometryType = useBiometryIconName();

  return (
    <WalletProfileModal>
      <Container
        alignItems="center"
        paddingBottom={14}
        testID="wallet-info-modal"
        width="100%"
      >
        {accountImage ? (
          <ProfileImage image={accountImage} size="large" />
        ) : (
          <>
            <ProfileAvatarButton
              color={color}
              marginBottom={0}
              radiusAndroid={32}
              setColor={setColor}
              value={nameEmoji || value}
            />
            <Spacer />
          </>
        )}
        <ProfileNameInput
          onChange={setValue}
          onSubmitEditing={handleSubmit}
          placeholder="Name your account"
          ref={inputRef}
          selectionColor={colors.avatarColor[color]}
          testID="wallet-info-input"
          value={value}
        />
        {address && (
          <CopyTooltip
            onHide={handleTriggerFocusInput}
            textToCopy={address}
            tooltipText="Copy Address"
          >
            <TruncatedAddress
              address={address}
              color="blueText"
              fontSize={14}
              marginTop={1}
            />
          </CopyTooltip>
        )}
      </Container>
      <Container marginVertical={5}>
        <ButtonPressAnimation onPress={handleSubmit}>
          {isNewProfile ? (
            <OptionItem
              iconProps={{
                color: 'settingsTeal',
                visible: actionType === 'Create',
                name: biometryType,
              }}
              justifyContent="center"
              testID="wallet-info-submit-button"
              textProps={{ color: 'settingsTeal' }}
              title={`${actionType} Account`}
            />
          ) : (
            <Text color="settingsTeal" fontWeight="600" textAlign="center">
              Done
            </Text>
          )}
        </ButtonPressAnimation>
      </Container>
      <Container marginBottom={6} marginTop={5}>
        <ButtonPressAnimation onPress={handleCancel}>
          <Text color="grayText" fontWeight="600" textAlign="center">
            Cancel
          </Text>
        </ButtonPressAnimation>
      </Container>
    </WalletProfileModal>
  );
}
