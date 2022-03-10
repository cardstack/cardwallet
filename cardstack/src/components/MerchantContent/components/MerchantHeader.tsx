import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { strings } from '../strings';
import { Container, Icon, Text } from '@cardstack/components';
import { MerchantInformation, PrimarySafeUpdateProps } from '@cardstack/types';
import { ContactAvatar } from '@rainbow-me/components/contacts';

interface MerchantHeaderProps extends PrimarySafeUpdateProps {
  merchantInfo?: MerchantInformation;
}

export const MerchantHeader = ({
  merchantInfo,
  isPrimarySafe,
  changeToPrimarySafe,
  showSafePrimarySelection = false,
}: MerchantHeaderProps) => (
  <Container
    width="100%"
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    padding={15}
    testID="merchant-header"
  >
    {merchantInfo ? (
      <Container marginRight={2}>
        <ContactAvatar
          color={merchantInfo?.color}
          size="xlarge"
          value={merchantInfo?.name}
          textColor={merchantInfo?.textColor}
        />
      </Container>
    ) : (
      <Icon name="user-with-background" size={80} />
    )}

    <Container flexDirection="column">
      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantInfo?.name || ''}
      </Text>
      {!!merchantInfo?.slug && (
        <Text size="small" numberOfLines={1}>
          {merchantInfo?.slug}
        </Text>
      )}
      {showSafePrimarySelection &&
        (isPrimarySafe ? (
          <Text size="small" weight="bold" style={styles.primaryText}>
            {strings.isPrimarySafeProfileLinkText}
          </Text>
        ) : (
          <Pressable onPress={changeToPrimarySafe}>
            <Text
              textDecorationLine="underline"
              size="small"
              weight="bold"
              style={styles.primaryText}
            >
              {strings.setToPrimaryProfileLinkText}
            </Text>
          </Pressable>
        ))}
    </Container>
  </Container>
);

const styles = StyleSheet.create({
  primaryText: {
    width: 140,
  },
});
