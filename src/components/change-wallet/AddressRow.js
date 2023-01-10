import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AnimatedPressable,
  Container,
  Icon,
  Text,
  TruncatedAddress,
} from '@cardstack/components';
import {
  getAddressPreview,
  getSymbolCharacterFromAddress,
  screenWidth,
} from '@cardstack/utils';

import { useAccountSettings } from '@rainbow-me/hooks';

import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import { ContactAvatar } from '../contacts';
import ImageAvatar from '../contacts/ImageAvatar';

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
    color,
    ens,
    image: accountImage,
    isSelected,
    isReadOnly,
    label,
    walletId,
  } = data;
  const { isOnCardPayNetwork } = useAccountSettings();

  const accountSubLabel = useMemo(
    () => (isOnCardPayNetwork ? getAddressPreview(address) : ''),
    [address, isOnCardPayNetwork]
  );

  let cleanedUpLabel = null;
  if (label) {
    cleanedUpLabel = removeFirstEmojiFromString(label).join('');
  }

  const onOptionsPress = useCallback(() => {
    onEditWallet(walletId, address, cleanedUpLabel);
  }, [address, cleanedUpLabel, onEditWallet, walletId]);

  return (
    <View style={sx.accountRow}>
      <AnimatedPressable
        onLongPress={onOptionsPress}
        onPress={editMode ? onOptionsPress : onPress}
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
                color={color}
                marginRight={10}
                size="medium"
                value={label || ens || getSymbolCharacterFromAddress(address)}
              />
            )}
            <Container
              margin={1}
              width={isReadOnly ? WITH_WATCHING_LABEL : WITHOUT_WATCHING_LABEL}
            >
              {cleanedUpLabel || ens ? (
                <Text ellipsizeMode="tail" numberOfLines={1} weight="bold">
                  {cleanedUpLabel || ens}
                </Text>
              ) : (
                <TruncatedAddress address={address} weight="bold" />
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
              <Text color="backgroundBlue" marginRight={2} weight="extraBold">
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
      </AnimatedPressable>
    </View>
  );
}
