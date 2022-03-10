import React, { memo } from 'react';

import { strings } from '../strings';
import {
  CenteredContainer,
  Container,
  Text,
  Icon,
  IconName,
  ContainerProps,
} from '@cardstack/components';

const IconWrapper = ({
  iconName,
  text,
  ...props
}: {
  iconName: IconName;
  text: string;
} & ContainerProps) => (
  <CenteredContainer flex={1} {...props}>
    <Icon name={iconName} size={20} />
    <Text fontSize={14} color="white" weight="bold" marginTop={3}>
      {text}
    </Text>
  </CenteredContainer>
);

const BottomIconsSection = (props: ContainerProps) => (
  <Container flexDirection="row" {...props}>
    <IconWrapper
      iconName="pay-icon"
      text={strings.icons.pay}
      borderRightWidth={1}
      borderRightColor="whiteTinyLightOpacity"
    />
    <IconWrapper iconName="connect-icon" text={strings.icons.connect} />
  </Container>
);

export default memo(BottomIconsSection);
