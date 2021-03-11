import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { removeFirstEmojiFromString } from '../../helpers/emojiHandler';
import { ButtonPressAnimation } from '../animations';
import { ContactAvatar } from '../contacts';
import ImageAvatar from '../contacts/ImageAvatar';
import { Column, ColumnWithMargins, Row } from '../layout';
import { TruncatedAddress } from '../text';
import { Icon, Text } from '@cardstack/components';

const sx = StyleSheet.create({
  accountRow: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 19,
  },
  rightContent: {
    flex: 0,
    flexDirection: 'row',
    marginLeft: 48,
  },
});

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

  let cleanedUpBalance = balance;
  if (balance === '0.00') {
    cleanedUpBalance = '0';
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
        <Row align="center">
          <Row align="center" flex={1} height={59}>
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
            <ColumnWithMargins margin={1}>
              {cleanedUpLabel || ens ? (
                <Text fontWeight="600">{cleanedUpLabel || ens}</Text>
              ) : (
                <TruncatedAddress
                  address={address}
                  firstSectionLength={4}
                  fontWeight="600"
                  truncationLength={6}
                />
              )}
              <Text variant="subText">{cleanedUpBalance || 0} ETH</Text>
            </ColumnWithMargins>
          </Row>
          <Column style={sx.rightContent}>
            {isReadOnly && (
              <Text color="backgroundBlue" fontWeight="700">
                Watching
              </Text>
            )}
            {!editMode && isSelected && (
              <Icon iconSize="medium" name="success" right={20} />
            )}
            {editMode && (
              <Icon color="black" name="more-horizontal" right={20} />
            )}
          </Column>
        </Row>
      </ButtonPressAnimation>
    </View>
  );
}
