import { getConstantByNetwork } from '@cardstack/cardpay-sdk';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import { ButtonPressAnimation } from '../animations';
import { ContactAvatar } from '../contacts';
import ImageAvatar from '../contacts/ImageAvatar';
import { TruncatedAddress } from '../text';
import { Container, Icon, Text } from '@cardstack/components';
import { getAddressPreview, screenWidth } from '@cardstack/utils';
import networkInfo from '@rainbow-me/helpers/networkInfo';
import { useAccountSettings } from '@rainbow-me/hooks';

const sx = StyleSheet.create({
  accountRow: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 19,
  },
});

const WITH_WATCHING_LABEL = screenWidth * 0.44;
const WITHOUT_WATCHING_LABEL = screenWidth * 0.65;

export default function AddressRow({ data, editMode, onPress, onEditWallet }) {
  const {
    address,
    balance,
    color: accountColor,
    ens,
    image: accountImage,
    index,
    isSelected,
    isReadOnly,
    label,
    walletId,
  } = data;
  const { network } = useAccountSettings();
  const nativeTokenSymbol = getConstantByNetwork('nativeTokenSymbol', network);

  let accountSubLabel;

  if (networkInfo[network].layer === 2) {
    accountSubLabel = getAddressPreview(address);
  } else {
    let balanceAmount;
    if (balance === '0.00') {
      balanceAmount = `0`;
    } else {
      balanceAmount = `${balance || 0}`;
    }

    accountSubLabel = `${balanceAmount} ${nativeTokenSymbol}`;
  }

  let cleanedUpLabel = null;
  if (label) {
    cleanedUpLabel = removeFirstEmojiFromString(label).join('');
  }

  const onOptionsPress = useCallback(() => {
    onEditWallet(walletId, address, cleanedUpLabel);
  }, [address, cleanedUpLabel, onEditWallet, walletId]);

  return (
    <View style={sx.accountRow}>
      <ButtonPressAnimation
        enableHapticFeedback={!editMode}
        onLongPress={onOptionsPress}
        onPress={editMode ? onOptionsPress : onPress}
        scaleTo={editMode ? 1 : 0.98}
      >
        <Container alignItems="center" flexDirection="row">
          <Container alignItems="center" flexDirection="row" height={59}>
            {accountImage ? (
              <ImageAvatar
                image={accountImage}
                marginRight={10}
                size="medium"
              />
            ) : (
              <ContactAvatar
                color={accountColor}
                marginRight={10}
                size="medium"
                value={label || ens || `${index + 1}`}
              />
            )}
            <Container
              margin={1}
              width={isReadOnly ? WITH_WATCHING_LABEL : WITHOUT_WATCHING_LABEL}
            >
              {cleanedUpLabel || ens ? (
                <Text ellipsizeMode="tail" fontWeight="600" numberOfLines={1}>
                  {cleanedUpLabel || ens}
                </Text>
              ) : (
                <TruncatedAddress address={address} fontWeight="600" />
              )}
              <Text variant="subText">{accountSubLabel}</Text>
            </Container>
          </Container>
          <Container
            alignItems="center"
            flex={1}
            flexDirection="row"
            justifyContent="flex-end"
          >
            {isReadOnly && (
              <Text color="backgroundBlue" fontWeight="700" marginRight={2}>
                Watching
              </Text>
            )}
            <Container marginRight={5} width={30}>
              {!editMode && isSelected && (
                <Icon iconSize="medium" name="success" />
              )}
              {editMode && <Icon color="black" name="more-horizontal" />}
            </Container>
          </Container>
        </Container>
      </ButtonPressAnimation>
    </View>
  );
}
