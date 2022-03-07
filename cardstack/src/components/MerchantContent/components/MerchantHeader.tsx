import React from 'react';
import { Container, Icon, Text } from '@cardstack/components';
import { MerchantInformation } from '@cardstack/types';
import { ContactAvatar } from '@rainbow-me/components/contacts';

export const MerchantHeader = ({
  merchantInfo,
}: {
  merchantInfo?: MerchantInformation;
}) => {
  return (
    <Container
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingVertical={5}
    >
      {merchantInfo ? (
        <Container marginBottom={3}>
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

      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantInfo?.name || ''}
      </Text>
    </Container>
  );
};
