import { useTheme } from '@shopify/restyle';
import React from 'react';
import { SvgXml } from 'react-native-svg';
import Feather from 'react-native-vector-icons/Feather';
import { FeatherIconNames } from './feather-icon-names';
import { customIcons, CustomIconNames } from './custom-icons';
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
  color?: ColorTypes;
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
  const colorWithDefault = color ? theme.colors[color] : theme.colors.white;
  const sizeWithDefault = size || iconSizeToValue[iconSize];

  if (isCustomIcon) {
    return (
      // <Container {...props} height={sizeWithDefault} width={sizeWithDefault}>
        <SvgXml
          color={colorWithDefault}
          width={sizeWithDefault}
          height={sizeWithDefault}
          xml={customIcons[name as CustomIconNames]}
        />
      // </Container>
    );
  }

  return (
    <Container {...props}>
      <Feather color={colorWithDefault} name={name} size={sizeWithDefault} />
    </Container>
  );
};
