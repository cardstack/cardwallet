import React, { useState } from 'react';

import { Container, CenteredContainer, ContainerProps } from '../Container';
import { Icon, IconProps } from '../Icon';
import { Text, TextProps } from '../Text';
import { Touchable } from '../Touchable';

interface OptionItemProps extends ContainerProps {
  onPress: () => void;
  iconProps: IconProps;
  title: string;
  subText?: string;
  textProps: TextProps;
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
}: OptionItemProps) => {
  const [iconVisible] = useState(iconProps.visible ?? true);

  return (
    <Touchable
      alignItems="center"
      disabled={disabled}
      flexDirection="row"
      onPress={onPress}
      testID="option-item"
      {...props}
    >
      {iconVisible && (
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
        <Text fontWeight="600" {...textProps}>
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
};
