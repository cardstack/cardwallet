import React, { memo } from 'react';

import { ContainerProps, Container, Text, Image } from '@cardstack/components';

import cardstackLogo from '../../assets/cardstackLogo.png';

interface NotificationBannerProps extends ContainerProps {
  title?: string;
  body?: string;
}

const NotificationBanner = ({
  title,
  body,
  ...containerProps
}: NotificationBannerProps) => (
  <Container
    shadowRadius={30}
    shadowOpacity={0.5}
    shadowOffset={{
      width: 0,
      height: 15,
    }}
    {...containerProps}
  >
    <Container
      flexDirection="row"
      paddingHorizontal={4}
      paddingVertical={5}
      backgroundColor="grayBannerBackgroud"
      borderRadius={10}
      alignItems="center"
    >
      <Image source={cardstackLogo} width={36} height={36} />
      <Container paddingHorizontal={4}>
        <Text variant="bold">{title}</Text>
        <Text>{body}</Text>
      </Container>
    </Container>
  </Container>
);

export default memo(NotificationBanner);
