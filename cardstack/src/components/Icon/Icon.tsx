import { useTheme } from '@shopify/restyle';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

import { CustomIconNames, customIcons } from './custom-icons';
import { FeatherIconNames } from './feather-icon-names';
import { ColorTypes, Theme } from '@cardstack/theme';
import { Container, ContainerProps } from '@cardstack/components';

const iconSizeToValue = {
  small: 15,
  medium: 22,
  large: 30,
  xl: 36,
};

type IconSize = keyof typeof iconSizeToValue;
export type IconName = CustomIconNames | FeatherIconNames;
export interface IconProps extends ContainerProps {
  /** specify the size using T-Shirt sizes */
  iconSize?: IconSize;
  /** if none of the default sizes work for what you need, you can use this to override */
  size?: number;
  name: IconName;
  color?: ColorTypes | null;
  strokeWidth?: number;
  onPress?: Function;
}

export const Icon = ({
  iconSize = 'large',
  size,
  name,
  color,
  ...props
}: IconProps) => {
  const theme = useTheme<Theme>();
  const isCustomIcon = Object.keys(customIcons).includes(name);
  const colorWithDefault = color ? theme.colors[color] : null;
  const sizeWithDefault = size || iconSizeToValue[iconSize];

  if (isCustomIcon) {
    const CustomIcon = customIcons[name as CustomIconNames];

    return (
      <Container
        testID="custom-icon"
        {...props}
        height={sizeWithDefault}
        width={sizeWithDefault}
      >
        <CustomIcon
          color={colorWithDefault}
          fill={colorWithDefault}
          stroke={colorWithDefault}
          width={sizeWithDefault}
          height={sizeWithDefault}
        />
      </Container>
    );
  }

  return (
    <Container {...props}>
      <Feather color={colorWithDefault} name={name} size={sizeWithDefault} />
    </Container>
  );
};
