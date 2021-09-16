import React, { memo, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';
import { MerchantInformation } from '@cardstack/types';
import { Container, ContainerProps, Icon, Text } from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';

const MerchantSectionCard = ({
  merchantInfoDID,
  children,
  isLoading = false,
  ...props
}: {
  merchantInfoDID?: MerchantInformation;
  isLoading?: boolean;
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
        {merchantInfoDID ? (
          <ContactAvatar
            color={merchantInfoDID?.color}
            size="xlarge"
            value={merchantInfoDID?.name}
            textColor={merchantInfoDID?.textColor}
          />
        ) : (
          <Icon name="user" size={80} />
        )}
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
      </Container>
    )}
    {children}
  </Container>
);

export default memo(MerchantSectionCard);
