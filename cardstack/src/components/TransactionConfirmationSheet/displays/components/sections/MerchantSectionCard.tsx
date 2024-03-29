import React, { memo, ReactNode } from 'react';
import { ActivityIndicator } from 'react-native';

import { Container, ContainerProps, Icon, Text } from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';

import { ContactAvatar } from '@rainbow-me/components/contacts';

export const USER_ICON_SIZE = 80;

const MerchantSectionCard = ({
  merchantInfoDID,
  children,
  isLoading = false,
  customIcon = <Icon name="user-with-background" size={USER_ICON_SIZE} />,
  ...props
}: {
  merchantInfoDID?: MerchantInformation;
  isLoading?: boolean;
  customIcon?: ReactNode;
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
          customIcon
        )}
        {!!merchantInfoDID && (
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
