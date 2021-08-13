import analytics from '@segment/analytics-react-native';
import { toLower } from 'lodash';
import React, { useCallback, useRef } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';

import { walletsSetSelected, walletsUpdate } from '../../redux/wallets';
import { ButtonPressAnimation } from '../animations';
import AvatarCircle from './AvatarCircle';
import { Button, Container, Icon, Text } from '@cardstack/components';
import { screenWidth } from '@cardstack/utils';
import useExperimentalFlag, {
  AVATAR_PICKER,
} from '@rainbow-me/config/experimentalHooks';
import showWalletErrorAlert from '@rainbow-me/helpers/support';
import { useAccountProfile, useClipboard, useWallets } from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { abbreviations, showActionSheetWithOptions } from '@rainbow-me/utils';

const ACCOUNT_CONTAINER = screenWidth * 0.85;

export default function ProfileMasthead({
  addCashAvailable,
  recyclerListRef,
  setCopiedText,
  setCopyCount,
}) {
  const { wallets, selectedWallet, isDamaged } = useWallets();
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
  const isAvatarEmojiPickerEnabled = false;
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
            ...(isAvatarEmojiPickerEnabled ? ['Pick an Emoji'] : []),
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
              } else if (buttonIndex === 1 && accountImage) {
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

  const { setClipboard } = useClipboard();
  const handlePressCopyAddress = () => {
    setClipboard(accountAddress);
    setCopiedText(abbreviations.formatAddressForDisplay(accountAddress));
    setCopyCount(count => count + 1);
  };

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
        <Container
          alignItems="center"
          flexDirection="row"
          justifyContent="center"
          width={ACCOUNT_CONTAINER}
        >
          <Text
            color="white"
            ellipsizeMode="tail"
            fontSize={24}
            fontWeight="600"
            marginRight={1}
            numberOfLines={1}
          >
            {accountName}
          </Text>
          <Icon color="white" name="chevron-down" />
        </Container>
      </ButtonPressAnimation>
      {addCashAvailable && (
        <Container marginTop={4}>
          <Button onPress={handlePressAddCash}>Add Funds</Button>
        </Container>
      )}
      <Container
        flexDirection="row"
        justifyContent="space-between"
        padding={4}
        width="100%"
      >
        <Button
          iconProps={{
            color: 'teal',
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
            marginRight: 2,
            color: 'teal',
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
