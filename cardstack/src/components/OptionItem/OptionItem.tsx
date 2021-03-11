import React from 'react';

import { CenteredContainer, ContainerProps } from '../Container';
import { Icon, IconProps } from '../Icon';
import { Text, TextProps } from '../Text';
import { Touchable } from '../Touchable';

interface OptionItemProps extends ContainerProps {
  onPress: () => void;
  iconProps: IconProps;
  title: string;
  textProps: TextProps;
}

export const OptionItem = ({
  onPress,
  iconProps,
  title,
  textProps,
  ...props
}: OptionItemProps) => (
  <Touchable
    alignItems="center"
    flexDirection="row"
    left={20}
    onPress={onPress}
    testID="option-item"
    {...props}
  >
    <CenteredContainer
      borderColor="borderGray"
      borderRadius={100}
      borderWidth={1}
      height={40}
      marginRight={2}
      width={40}
    >
      <Icon color="settingsGray" {...iconProps} />
    </CenteredContainer>
    <Text fontWeight="600" {...textProps}>
      {title}
    </Text>
  </Touchable>
);
