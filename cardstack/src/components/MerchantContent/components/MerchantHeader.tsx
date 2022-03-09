import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, Icon, Text } from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { ContactAvatar } from '@rainbow-me/components/contacts';

interface MerchantHeaderProps {
  merchantInfo?: MerchantInformation;
  isPrimarySafe: boolean;
  changeToPrimarySafe?: () => void;
}

export const MerchantHeader = ({
  merchantInfo,
  isPrimarySafe,
  changeToPrimarySafe,
}: MerchantHeaderProps) => {
  return (
    <Container
      width="100%"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      padding={10}
    >
      {merchantInfo ? (
        <Container marginRight={2}>
          <ContactAvatar
            color={merchantInfo?.color}
            size="large"
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
        {isPrimarySafe ? (
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
        )}
      </Container>
    </Container>
  );
};

const strings = {
  isPrimarySafeProfileLinkText: 'Primary Profile',
  setToPrimaryProfileLinkText: 'Set as Primary Profile',
};

const styles = StyleSheet.create({
  primaryText: {
    width: 140,
  },
});
