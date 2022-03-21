import React from 'react';

import { Container, Text, Icon, IconName } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

interface Props {
  title: string;
  message?: string;
  iconName?: IconName;
  iconColor?: ColorTypes;
}

export const InfoBanner = ({
  title,
  message,
  iconName = 'info',
  iconColor = 'appleBlue',
}: Props) => (
  <Container
    width="100%"
    padding={5}
    backgroundColor="grayCardBackground"
    borderRadius={10}
  >
    <Container flexDirection="row" paddingBottom={3}>
      <Icon name={iconName} color={iconColor} iconSize="medium" />
      <Text weight="bold" size="body" paddingLeft={2}>
        {title}
      </Text>
    </Container>
    <Text size="xs">{message}</Text>
  </Container>
);
