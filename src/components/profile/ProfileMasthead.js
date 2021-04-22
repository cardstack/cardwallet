import Clipboard from '@react-native-community/clipboard';
import analytics from '@segment/analytics-react-native';
import { toLower } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { walletsSetSelected, walletsUpdate } from '../../redux/wallets';
import Divider from '../Divider';
import { ButtonPressAnimation } from '../animations';
import { RainbowButton } from '../buttons';
import { FloatingEmojis } from '../floating-emojis';
import { Centered, Column, Row, RowWithMargins } from '../layout';
import { TruncatedText } from '../text';
import AvatarCircle from './AvatarCircle';
import ProfileAction from './ProfileAction';
import { Button, Container, Icon, Text } from '@cardstack/components';
import useExperimentalFlag, {
  AVATAR_PICKER,
} from '@rainbow-me/config/experimentalHooks';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import {
  useAccountProfile,
  useDimensions,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { abbreviations, showActionSheetWithOptions } from '@rainbow-me/utils';

const dropdownArrowWidth = 21;

const FloatingEmojisRegion = styled(FloatingEmojis).attrs({
  distance: 250,
  duration: 500,
  fadeOut: false,
  scaleTo: 0,
  size: 50,
  wiggleFactor: 0,
})`
  height: 0;
  left: 0;
  position: absolute;
  top: 0;
  width: 130;
`;

const AccountName = styled(TruncatedText).attrs({
  align: 'left',
  firstSectionLength: abbreviations.defaultNumCharsPerSection,
  letterSpacing: 'roundedMedium',
  size: 'bigger',
  truncationLength: 4,
  weight: 'bold',
})`
  height: ${android ? '38' : '33'};
  margin-top: ${android ? '-10' : '-1'};
  margin-bottom: ${android ? '10' : '1'};
  max-width: ${({ deviceWidth }) => deviceWidth - dropdownArrowWidth - 60};
  padding-right: 6;
`;

const AddCashButton = styled(RainbowButton).attrs({
  overflowMargin: 30,
  skipTopMargin: true,
  type: 'addCash',
})`
  margin-top: 16;
`;

const DropdownArrow = styled(Centered)`
  height: 9;
  margin-top: 11;
  width: ${dropdownArrowWidth};
`;

const ProfileMastheadDivider = styled(Divider).attrs(
  ({ theme: { colors } }) => ({
    color: colors.rowDividerLight,
  })
)`
  bottom: 0;
  position: absolute;
`;

export default function ProfileMasthead({
  addCashAvailable,
  recyclerListRef,
  showBottomDivider = true,
}) {
  const { wallets, selectedWallet, isDamaged } = useWallets();
  const onNewEmoji = useRef();
  const setOnNewEmoji = useCallback(
    newOnNewEmoji => (onNewEmoji.current = newOnNewEmoji),
    []
  );
  const { width: deviceWidth } = useDimensions();
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const {
    accountAddress,
    accountColor,
    accountSymbol,
    accountName,
    accountImage,
  } = useAccountProfile();
  const isAvatarPickerAvailable = useExperimentalFlag(AVATAR_PICKER);
  const isAvatarEmojiPickerEnabled = true;
  const isAvatarImagePickerEnabled = true;

  const onRemovePhoto = useCallback(async () => {
    const newWallets = {
      ...wallets,
      [selectedWallet.id]: {
        ...wallets[selectedWallet.id],
        addresses: wallets[selectedWallet.id].addresses.map(account =>
          toLower(account.address) === toLower(accountAddress)
            ? { ...account, image: null }
            : account
        ),
      },
    };

    dispatch(walletsSetSelected(newWallets[selectedWallet.id]));
    await dispatch(walletsUpdate(newWallets));
  }, [dispatch, selectedWallet, accountAddress, wallets]);

  const handlePressAvatar = useCallback(() => {
    recyclerListRef?.scrollToTop(true);
    setTimeout(
      () => {
        if (isAvatarImagePickerEnabled) {
          const processPhoto = image => {
            const stringIndex = image?.path.indexOf('/tmp');
            const newWallets = {
              ...wallets,
              [selectedWallet.id]: {
                ...wallets[selectedWallet.id],
                addresses: wallets[selectedWallet.id].addresses.map(account =>
                  toLower(account.address) === toLower(accountAddress)
                    ? {
                        ...account,
                        image: `~${image?.path.slice(stringIndex)}`,
                      }
                    : account
                ),
              },
            };
            dispatch(walletsSetSelected(newWallets[selectedWallet.id]));
            dispatch(walletsUpdate(newWallets));
          };

          const avatarActionSheetOptions = [
            'Choose from Library',
            ...(isAvatarPickerAvailable ? ['Pick an Emoji'] : []),
            ...(accountImage ? ['Remove Photo'] : []),
            ...(ios ? ['Cancel'] : []),
          ];

          showActionSheetWithOptions(
            {
              cancelButtonIndex: avatarActionSheetOptions.length - 1,
              destructiveButtonIndex: accountImage
                ? avatarActionSheetOptions.length - 2
                : undefined,
              options: avatarActionSheetOptions,
            },
            async buttonIndex => {
              if (buttonIndex === 0) {
                ImagePicker.openPicker({
                  cropperCircleOverlay: true,
                  cropping: true,
                }).then(processPhoto);
              } else if (buttonIndex === 1 && isAvatarEmojiPickerEnabled) {
                navigate(Routes.AVATAR_BUILDER, {
                  initialAccountColor: accountColor,
                  initialAccountName: accountName,
                });
              } else if (buttonIndex === 2 && accountImage) {
                onRemovePhoto();
              }
            }
          );
        } else if (isAvatarEmojiPickerEnabled) {
          navigate(Routes.AVATAR_BUILDER, {
            initialAccountColor: accountColor,
            initialAccountName: accountName,
          });
        }
      },
      recyclerListRef?.getCurrentScrollOffset() > 0 ? 200 : 1
    );
  }, [
    accountAddress,
    accountColor,
    accountImage,
    accountName,
    dispatch,
    isAvatarEmojiPickerEnabled,
    isAvatarImagePickerEnabled,
    isAvatarPickerAvailable,
    navigate,
    onRemovePhoto,
    recyclerListRef,
    selectedWallet.id,
    wallets,
  ]);

  const handlePressReceive = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }
    navigate(Routes.RECEIVE_MODAL);
  }, [navigate, isDamaged]);

  const handlePressAddCash = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }

    analytics.track('Tapped Add Cash', {
      category: 'add cash',
    });

    if (ios) {
      navigate(Routes.ADD_CASH_FLOW);
    } else {
      navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
        params: {
          address: accountAddress,
        },
        screen: Routes.WYRE_WEBVIEW,
      });
    }
  }, [accountAddress, navigate, isDamaged]);

  const handlePressChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  const handlePressCopyAddress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
    }
    if (onNewEmoji && onNewEmoji.current) {
      onNewEmoji.current();
    }
    Clipboard.setString(accountAddress);
  }, [accountAddress, isDamaged]);
  const { colors } = useTheme();

  return (
    <Container
      alignItems="center"
      backgroundColor="backgroundBlue"
      height={addCashAvailable ? 260 : 185}
      paddingBottom={6}
    >
      {/* [AvatarCircle -> ImageAvatar -> ImgixImage], so no need to sign accountImage here. */}
      <AvatarCircle
        accountColor={accountColor}
        accountSymbol={accountSymbol}
        image={accountImage}
        isAvatarPickerAvailable={isAvatarPickerAvailable}
        onPress={handlePressAvatar}
      />
      <ButtonPressAnimation onPress={handlePressChangeWallet}>
        <Container alignItems="center" flexDirection="row">
          <Text color="white" fontSize={24} fontWeight="600" marginRight={1}>
            {accountName}
          </Text>
          <Icon color="white" name="chevron-down" />
        </Container>
      </ButtonPressAnimation>
      {addCashAvailable && (
        <Button marginTop={4} onPress={handlePressAddCash}>
          Add Funds
        </Button>
      )}
      <Container
        flexDirection="row"
        justifyContent="space-between"
        padding={4}
        width="100%"
      >
        <Button
          iconProps={{
            color: 'white',
            marginRight: 2,
            name: 'copy',
            size: 18,
          }}
          onPress={handlePressCopyAddress}
          variant="smallBlue"
        >
          Copy Address
        </Button>
        <Button
          iconProps={{
            color: 'white',
            marginRight: 2,
            name: 'qr-code',
            size: 18,
          }}
          onPress={handlePressReceive}
          variant="smallBlue"
        >
          Receive
        </Button>
      </Container>
    </Container>
  );
}
