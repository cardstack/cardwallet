import { toLower } from 'lodash';
import React, { useCallback } from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';

import { walletsSetSelected, walletsUpdate } from '../../redux/wallets';
import AvatarCircle from './AvatarCircle';
import {
  AnimatedPressable,
  Button,
  Container,
  Icon,
  Text,
} from '@cardstack/components';
import { Device, isLayer1, screenWidth } from '@cardstack/utils';

import showWalletErrorAlert from '@rainbow-me/helpers/support';
import {
  useAccountProfile,
  useAccountSettings,
  // useClipboard,
  useWallets,
} from '@rainbow-me/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import Routes from '@rainbow-me/routes';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

const ACCOUNT_CONTAINER = screenWidth * 0.85;
// const copyIconProps = {
//   color: 'teal',
//   marginRight: 2,
//   name: 'copy',
//   size: 18,
// };
// const qrCodeIconProps = {
//   marginRight: 2,
//   color: 'teal',
//   name: 'qr-code',
//   size: 18,
// };

export default function ProfileMasthead({
  addCashAvailable,
  // setCopiedText,
  // setCopyCount,
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
  const { network } = useAccountSettings();
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
    setTimeout(() => {
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
              return;
            }
            if (buttonIndex === 1) {
              onRemovePhoto();
              return;
            }
          }
        );
      }
    });
  }, [
    accountAddress,
    accountImage,
    dispatch,
    isAvatarImagePickerEnabled,
    onRemovePhoto,
    selectedWallet.id,
    wallets,
  ]);

  // const handlePressScan = useCallback(() => {
  //   navigate(Routes.QR_SCANNER_SCREEN);
  // }, [navigate]);

  const handlePress = useCallback(() => {
    if (isDamaged) {
      showWalletErrorAlert();
      return;
    }

    if (ios) {
      if (isLayer1(network)) {
        navigate(Routes.ADD_CASH_FLOW);
      } else {
        navigate(Routes.BUY_PREPAID_CARD);
      }
    } else {
      navigate(Routes.WYRE_WEBVIEW_NAVIGATOR, {
        params: {
          address: accountAddress,
        },
        screen: Routes.WYRE_WEBVIEW,
      });
    }
  }, [accountAddress, navigate, isDamaged, network]);

  const handlePressChangeWallet = useCallback(() => {
    navigate(Routes.CHANGE_WALLET_SHEET);
  }, [navigate]);

  // const { setClipboard } = useClipboard();
  // const handlePressCopyAddress = () => {
  //   setClipboard(accountAddress);
  //   setCopiedText(abbreviations.formatAddressForDisplay(accountAddress));
  //   setCopyCount(count => count + 1);
  // };

  return (
    <Container
      alignItems="center"
      backgroundColor="backgroundBlue"
      paddingBottom={6}
    >
      {/* [AvatarCircle -> ImageAvatar -> ImgixImage], so no need to sign accountImage here. */}
      <AvatarCircle
        accountColor={accountColor}
        accountSymbol={accountSymbol}
        image={accountImage}
        onPress={handlePressAvatar}
      />
      <AnimatedPressable onPress={handlePressChangeWallet}>
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
            marginRight={1}
            numberOfLines={1}
            weight="bold"
          >
            {accountName}
          </Text>
          <Icon color="white" name="chevron-down" />
        </Container>
      </AnimatedPressable>
      <Container marginTop={4}>
        {addCashAvailable && isLayer1(network) ? (
          <Button onPress={handlePress}>Add Funds</Button>
        ) : null}
        {!isLayer1(network) && Device.supportsFiatOnRamp ? (
          <Button onPress={handlePress}>Buy Prepaid Card</Button>
        ) : null}
      </Container>
    </Container>
  );
}
