import React, { memo, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { MerchantInformation } from '@cardstack/types';
import { Container, ContainerProps, Text } from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';
import { Icon } from '@rainbow-me/components/icons';
import { colors } from '@cardstack/theme';

const MerchantSectionCard = ({
  merchantInfoDID,
  children,
  isLoading = false,
  isPaymentReceived = false,
  ...props
}: {
  merchantInfoDID?: MerchantInformation;
  isLoading?: boolean;
  isPaymentReceived?: boolean;
  children: ReactNode;
} & ContainerProps) => (
  <Container
    backgroundColor="grayCardBackground"
    borderRadius={10}
    padding={8}
    {...props}
  >
    {isLoading ? (
      <Container flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator />
      </Container>
    ) : (
      <Container alignItems="center">
        {isPaymentReceived ? (
          <Container
            borderRadius={70}
            borderColor="blueLightBorder"
            borderWidth={5}
          >
            <Icon
              name="checkmarkCircled"
              width={70}
              height={70}
              color={colors.blueOcean}
            />
          </Container>
        ) : merchantInfoDID ? (
          <ContactAvatar
            color={merchantInfoDID?.color}
            size="xlarge"
            value={merchantInfoDID?.name}
            textColor={merchantInfoDID?.textColor}
          />
        ) : (
          <Icon name="user" size={80} />
        )}
        {!isPaymentReceived && (
          <Container paddingTop={3} marginBottom={4}>
            <Text
              weight="extraBold"
              size="medium"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {merchantInfoDID?.name || ''}
            </Text>
          </Container>
        )}
      </Container>
    )}
    {children}
  </Container>
);

export default memo(MerchantSectionCard);
