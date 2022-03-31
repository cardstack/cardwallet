import React from 'react';

import {
  Container,
  ContainerProps,
  Text,
  Icon,
  IconName,
} from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

interface Props extends ContainerProps {
  title: string;
  message: string | React.ReactElement;
  iconName?: IconName;
  iconColor?: ColorTypes;
}

export const InfoBanner = ({
  title,
  message,
  iconName = 'info',
  iconColor = 'appleBlue',
  ...rest
}: Props) => (
  <Container width="100%" {...rest}>
    <Container
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
  </Container>
);
