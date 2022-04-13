import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { DepotSafe } from '@cardstack/cardpay-sdk';
import { OptionalUnion } from 'globals';
import { strings } from './strings';
import { getAddressPreview } from '@cardstack/utils';
import {
  CardPressable,
  Container,
  Text,
  Icon,
  IconName,
} from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { MerchantSafeType } from '@cardstack/types';
import { palette } from '@cardstack/theme';

type MerchantOrDepotSafe = OptionalUnion<MerchantSafeType, DepotSafe>;

export interface SafeSelectionItemProps {
  safe: MerchantOrDepotSafe;
  primary?: boolean;
  onSafePress?: (safe: MerchantOrDepotSafe) => void;
  detailIconName?: IconName;
}

export const SafeSelectionItem = memo(
  ({
    safe,
    onSafePress,
    primary = false,
    detailIconName = 'chevron-right',
  }: SafeSelectionItemProps) => {
    const typeText = primary ? strings.primary : strings[safe.type];

    const merchantInfoOrSafeType = useMemo(
      () => safe?.merchantInfo?.name || strings[safe.type],
      [safe]
    );

    const avatarProps = useMemo(
      () => ({
        color: safe?.merchantInfo?.color || palette.redDark,
        value: merchantInfoOrSafeType,
        textColor: safe?.merchantInfo?.textColor || 'white',
        size: 'large',
        style: styles.avatar,
      }),
      [merchantInfoOrSafeType, safe]
    );

    const onPress = useCallback(() => {
      onSafePress?.(safe);
    }, [onSafePress, safe]);

    return (
      <CardPressable onPress={onPress} disabled={!onSafePress}>
        <Container flexDirection="row">
          <Container justifyContent="center" alignContent="center">
            <ContactAvatar {...avatarProps} />
          </Container>
          <Container flex={1} paddingHorizontal={3}>
            <Text variant="body" weight="bold">
              {merchantInfoOrSafeType}
            </Text>
            <Text size="xs" weight="semibold" color="secondaryText">
              {typeText}
            </Text>
            <Text size="xs" color="tertiaryText">
              {getAddressPreview(safe.address)}
            </Text>
          </Container>
          {!!onSafePress && (
            <Container justifyContent="center">
              <Icon name={detailIconName} color="black" size={20} />
            </Container>
          )}
        </Container>
      </CardPressable>
    );
  }
);

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  },
});
