import React, { memo, ReactNode } from 'react';

import { MerchantInformation } from '@cardstack/types';
import { Container, Text } from '@cardstack/components';
import { ContactAvatar } from '@rainbow-me/components/contacts';

const MerchantSectionCard = ({
  merchantInfoDID,
  children,
}: {
  merchantInfoDID?: MerchantInformation;
  children: ReactNode;
}) => (
  <Container
    backgroundColor="grayCardBackground"
    alignItems="center"
    borderRadius={10}
    padding={8}
  >
    <ContactAvatar
      color={merchantInfoDID?.color}
      size="xlarge"
      value={merchantInfoDID?.name}
      textColor={merchantInfoDID?.textColor}
    />
    <Container paddingTop={3}>
      <Text
        weight="extraBold"
        size="medium"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {merchantInfoDID?.name || ''}
      </Text>
    </Container>
    {children}
  </Container>
);

export default memo(MerchantSectionCard);
