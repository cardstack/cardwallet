import { useTheme } from '@shopify/restyle';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { CustomIconNames, customIcons } from './custom-icons';
import { FeatherIconNames } from './feather-icon-names';
import { MaterialCommunityIconNames } from './material-community-icon-names';
import { ColorTypes, Theme } from '@cardstack/theme';
import { Container, ContainerProps } from '@cardstack/components';

const iconSizeToValue = {
  small: 15,
  medium: 22,
  large: 30,
  xl: 36,
};

type IconFamily = 'Feather' | 'MaterialCommunity';

const IconFamilies = {
  Feather,
  MaterialCommunity,
};

type IconSize = keyof typeof iconSizeToValue;
export type IconName =
  | CustomIconNames
  | FeatherIconNames
  | MaterialCommunityIconNames;
export interface IconProps extends ContainerProps {
  /** specify the size using T-Shirt sizes */
  iconSize?: IconSize;
  iconFamily?: IconFamily;
  /** if none of the default sizes work for what you need, you can use this to override */
  size?: number;
  name: IconName;
  color?: ColorTypes | null;
  stroke?: ColorTypes | null;
  strokeWidth?: number;
  onPress?: () => void;
}

export const Icon = ({
  iconSize = 'large',
  iconFamily = 'Feather',
  size,
  name,
  color,
  stroke,
  ...props
}: IconProps) => {
  const theme = useTheme<Theme>();
  const isCustomIcon = Object.keys(customIcons).includes(name);

  const colorWithDefault = (color && theme.colors[color]) || color;

  const strokeWithDefault = stroke ? theme.colors[stroke] : null;

  const sizeWithDefault = size || iconSizeToValue[iconSize];

  if (isCustomIcon) {
    const CustomIcon = customIcons[name as CustomIconNames];

    return (
      <Container
        testID="custom-icon"
        height={sizeWithDefault}
        width={sizeWithDefault}
        {...props}
      >
        <CustomIcon
          color={colorWithDefault}
          fill={colorWithDefault}
          stroke={strokeWithDefault}
          width={sizeWithDefault}
          height={sizeWithDefault}
        />
      </Container>
    );
  }

  const IconComponent = IconFamilies[iconFamily];

  return (
    <Container {...props}>
      <IconComponent
        color={colorWithDefault || 'transparent'}
        name={name}
        size={sizeWithDefault}
      />
    </Container>
  );
};
