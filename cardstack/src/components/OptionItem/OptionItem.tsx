import React from 'react';
import {
  CenteredContainer,
  Icon,
  Text,
  Touchable,
  TouchableProps,
  IconProps,
  TextProps,
} from '@cardstack/components';

interface OptionItemProps extends TouchableProps {
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
