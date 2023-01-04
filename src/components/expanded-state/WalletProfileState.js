import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import { getRandomColor } from '../../styles/colors';
import Divider from '../Divider';
import ImageAvatar from '../contacts/ImageAvatar';
import { ProfileAvatarButton, ProfileModal, ProfileNameInput } from './profile';
import {
  AnimatedPressable,
  Container,
  OptionItem,
  Text,
} from '@cardstack/components';
import { Routes, useDismissCurrentRoute } from '@cardstack/navigation';
import theme, { avatarColor } from '@cardstack/theme';
import {
  removeFirstEmojiFromString,
  returnStringFirstEmoji,
} from '@rainbow-me/helpers/emojiHandler';
import { useAccountProfile } from '@rainbow-me/hooks';

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
  isNewProfile,
  onCloseModal,
  profile,
}) {
  const nameEmoji = returnStringFirstEmoji(profile?.name);
  const { navigate } = useNavigation();
  const { accountImage } = useAccountProfile();

  const dismissProfileModal = useDismissCurrentRoute(Routes.MODAL_SCREEN);

  const [color, setColor] = useState(
    (profile.color !== null && profile.color) || getRandomColor()
  );

  const [value, setValue] = useState(
    profile?.name ? removeFirstEmojiFromString(profile.name).join('') : ''
  );
  const inputRef = useRef(null);

  const goToChangeWalletOnCreate = useCallback(() => {
    if (actionType === 'Create') {
      navigate(Routes.CHANGE_WALLET_SHEET);
    }
  }, [actionType, navigate]);

  const handleCancel = useCallback(() => {
    dismissProfileModal();

    goToChangeWalletOnCreate();
  }, [dismissProfileModal, goToChangeWalletOnCreate]);

  const handleSubmit = useCallback(async () => {
    dismissProfileModal();

    await onCloseModal({
      color,
      name: nameEmoji ? `${nameEmoji} ${value}` : value,
    });

    if (isNewProfile) {
      goToChangeWalletOnCreate();
    }
  }, [
    color,
    dismissProfileModal,
    isNewProfile,
    nameEmoji,
    goToChangeWalletOnCreate,
    onCloseModal,
    value,
  ]);

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
          selectionColor={avatarColor[color]}
          testID="wallet-info-input"
          value={value}
        />
      </Container>
      <Container marginVertical={5}>
        <AnimatedPressable onPress={handleSubmit}>
          {isNewProfile ? (
            <OptionItem
              justifyContent="center"
              testID="wallet-info-submit-button"
              textProps={{ color: 'settingsTeal' }}
              title={`${actionType} Account`}
            />
          ) : (
            <Text color="settingsTeal" textAlign="center" weight="bold">
              Done
            </Text>
          )}
        </AnimatedPressable>
      </Container>
      <Container marginBottom={6} marginTop={5}>
        <AnimatedPressable onPress={handleCancel}>
          <Text color="grayText" textAlign="center" weight="bold">
            Cancel
          </Text>
        </AnimatedPressable>
      </Container>
    </WalletProfileModal>
  );
}
