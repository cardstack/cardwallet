import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Button, Container, Icon, Text } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import { MerchantInformation, PrimarySafeUpdateProps } from '@cardstack/types';

import { Alert } from '@rainbow-me/components/alerts';
import { ContactAvatar } from '@rainbow-me/components/contacts';

import { strings } from '../strings';

interface MerchantHeaderProps extends PrimarySafeUpdateProps {
  merchantInfo?: MerchantInformation;
}

export const MerchantHeader = ({
  merchantInfo,
  isPrimarySafe,
  changeToPrimarySafe,
  showSafePrimarySelection = false,
}: MerchantHeaderProps) => {
  const { navigate } = useNavigation();

  const onEditPress = useCallback(() => {
    if (!__DEV__) {
      Alert({ title: 'Coming soon' });

      return;
    }

    navigate(Routes.PROFILE_NAME, { ...merchantInfo });
  }, [merchantInfo, navigate]);

  return (
    <Container
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      testID="merchant-header"
      paddingVertical={12}
    >
      <Container flex={1.4}>
        {merchantInfo ? (
          <ContactAvatar
            color={merchantInfo?.color}
            size="xlarge"
            value={merchantInfo?.name}
            textColor={merchantInfo?.textColor}
          />
        ) : (
          <Icon name="user-with-background" size={80} />
        )}
      </Container>
      <Container flexDirection="column" flex={3}>
        <Text
          testID="merchant-name"
          weight="extraBold"
          size="medium"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {merchantInfo?.name || ''}
        </Text>
        {!!merchantInfo?.slug && (
          <Text testID="merchant-slug" size="small" numberOfLines={1}>
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
      <Container flex={1}>
        <Button
          variant="smallPrimaryWhite"
          width="100%"
          height={38}
          borderColor="black"
          onPress={onEditPress}
        >
          {strings.edit}
        </Button>
      </Container>
    </Container>
  );
};

const styles = StyleSheet.create({
  primaryText: {
    width: 140,
  },
});
