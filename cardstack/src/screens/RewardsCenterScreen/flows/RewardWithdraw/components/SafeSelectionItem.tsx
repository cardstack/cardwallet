import React, { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
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

interface SafeSelectionItemProps {
  safe: MerchantSafeType;
  primary?: boolean;
  onSafePress?: (safe: MerchantSafeType) => void;
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

    const avatarProps = useMemo(
      () => ({
        color: safe.merchantInfo?.color || palette.redDark,
        value: safe.merchantInfo?.name || safe.type,
        textColor: safe.merchantInfo?.textColor || 'white',
        size: 'large',
        style: styles.avatar,
      }),
      [safe]
    );

    return (
      <CardPressable
        onPress={() => onSafePress?.(safe)}
        disabled={!onSafePress}
      >
        <Container flexDirection="row">
          <Container justifyContent="center" alignContent="center">
            <ContactAvatar {...avatarProps} />
          </Container>
          <Container flex={1} paddingHorizontal={3}>
            <Text variant="body" weight="bold">
              {safe.merchantInfo?.name || safe.type}
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
