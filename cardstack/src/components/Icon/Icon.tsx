import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '@shopify/restyle';
import { ImageSourcePropType } from 'react-native';
import { Container, ContainerProps, Image } from '@cardstack/components';
import { Theme, ColorTypes } from '@cardstack/theme';

const iconSizeToValue = {
  small: 15,
  medium: 22,
  large: 30,
  xl: 36,
};

type IconSize = keyof typeof iconSizeToValue;
export interface IconProps extends ContainerProps {
  /** specify the size using T-Shirt sizes */
  iconSize?: IconSize;
  /** if none of the default sizes work for what you need, you can use this to override */
  size?: number;
  name: string;
  color?: ColorTypes;
}

const customIcons: {
  [key: string]: ImageSourcePropType;
} = {
  'info-blue': require('../../assets/icons/info-blue.png'),
  'info-white': require('../../assets/icons/info-white.png'),
  'qr-code': require('../../assets/icons/qr-code.png'),
  error: require('../../assets/icons/error.png'),
  failed: require('../../assets/icons/failed.png'),
  more: require('../../assets/icons/more.png'),
  pay: require('../../assets/icons/pay.png'),
  sent: require('../../assets/icons/sent.png'),
  swap: require('../../assets/icons/swap.png'),
  'sent-blue': require('../../assets/icons/sent-blue.png'),
  warning: require('../../assets/icons/warning.png'),
  reload: require('../../assets/icons/reload.png'),
  gift: require('../../assets/icons/gift.png'),
  circle: require('../../assets/icons/circle.png'),
  'check-circle': require('../../assets/icons/check-circle.png'),
  pinned: require('../../assets/icons/pinned.png'),
  pin: require('../../assets/icons/pin.png'),
  'pin-blue': require('../../assets/icons/pin-blue.png'),
  hidden: require('../../assets/icons/hidden.png'),
};

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
      <Container {...props} height={sizeWithDefault} width={sizeWithDefault}>
        <Image
          source={customIcons[name]}
          style={{ height: '100%', width: '100%' }}
          resizeMode="contain"
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
