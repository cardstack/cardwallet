import React from 'react';

import { Container, CenteredContainer, ContainerProps } from '../Container';
import { Icon, IconProps } from '../Icon';
import { Text, TextProps } from '../Text';
import { Touchable } from '../Touchable';

export interface OptionItemProps extends ContainerProps {
  onPress?: () => void;
  iconProps: IconProps;
  title: string;
  subText?: string;
  textProps?: TextProps;
  borderIcon?: boolean;
  horizontalSpacing?: number;
  disabled?: boolean;
}

export const OptionItem = ({
  onPress,
  iconProps,
  title,
  subText,
  textProps,
  borderIcon,
  horizontalSpacing = 2,
  disabled,
  ...props
}: OptionItemProps) => (
  <Touchable
    alignItems="center"
    disabled={disabled || !onPress}
    flexDirection="row"
    onPress={onPress}
    testID="option-item"
    {...props}
  >
    {iconProps && (
      <CenteredContainer
        borderColor="borderGray"
        borderRadius={100}
        borderWidth={borderIcon ? 1 : 0}
        height={40}
        marginRight={horizontalSpacing}
        width={40}
        testID="option-item-icon-wrapper"
      >
        <Icon color="settingsTeal" {...iconProps} />
      </CenteredContainer>
    )}
    <Container flexShrink={1}>
      <Text weight="bold" {...textProps}>
        {title}
      </Text>
      {subText && (
        <Text variant="subText" marginTop={1}>
          {subText}
        </Text>
      )}
    </Container>
  </Touchable>
);
