import { useTheme } from '@shopify/restyle';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { ColorTypes, Theme } from '@cardstack/theme';

import { Touchable, TouchableProps } from '../Touchable';

import { CustomIconNames, customIcons } from './custom-icons';
import { FeatherIconNames } from './feather-icon-names';
import { MaterialCommunityIconNames } from './material-community-icon-names';

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
export interface IconProps extends Omit<TouchableProps, 'children'> {
  /** specify the size using T-Shirt sizes */
  iconSize?: IconSize;
  iconFamily?: IconFamily;
  /** if none of the default sizes work for what you need, you can use this to override */
  size?: number;
  name: IconName;
  color?: ColorTypes | null;
  stroke?: ColorTypes | null;
  strokeWidth?: number;
  visible?: boolean;
}

export const Icon = ({
  iconSize = 'large',
  iconFamily = 'Feather',
  size,
  name,
  color,
  stroke,
  onPress,
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
      <Touchable
        testID="custom-icon"
        height={sizeWithDefault}
        width={sizeWithDefault}
        disabled={!onPress}
        onPress={onPress}
        {...props}
      >
        <CustomIcon
          color={colorWithDefault}
          fill={colorWithDefault}
          stroke={strokeWithDefault}
          width={sizeWithDefault}
          height={sizeWithDefault}
        />
      </Touchable>
    );
  }

  const IconComponent = IconFamilies[iconFamily];

  return (
    <Touchable {...props} disabled={!onPress} onPress={onPress}>
      <IconComponent
        color={colorWithDefault || 'transparent'}
        name={name}
        size={sizeWithDefault}
      />
    </Touchable>
  );
};
