import React, { useMemo } from 'react';
import {
  Container,
  Icon,
  NetworkBadge,
  Text,
  Touchable,
} from '@cardstack/components';
import { getAddressPreview } from '@cardstack/utils';
import { ColorTypes } from '@cardstack/theme';

interface SafeHeaderProps {
  address: string;
  rightText?: string;
  onPress?: () => void;
  small?: boolean;
  backgroundColor?: string;
  textColor?: string;
  accountName?: string;
}

export const SafeHeader = (props: SafeHeaderProps) => {
  const {
    address,
    onPress,
    rightText,
    small,
    backgroundColor,
    textColor,
    accountName,
  } = props;

  const style = useMemo(
    () => ({
      background: {
        backgroundColor: backgroundColor || 'black',
      },
      text: { color: textColor || 'white' },
    }),
    [backgroundColor, textColor]
  );

  return (
    <Container width="100%">
      <Container
        height={small ? 40 : 55}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        style={style.background}
        paddingHorizontal={5}
      >
        <Container flexDirection="row" alignItems="center">
          <NetworkBadge marginRight={2} />
          <Text
            fontFamily="RobotoMono-Regular"
            style={style.text}
            ellipsizeMode="tail"
            size={small ? 'xs' : 'body'}
          >
            {accountName ? accountName : getAddressPreview(address)}
          </Text>
        </Container>
        <Touchable
          flex={0.8}
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          onPress={onPress}
        >
          <Text
            style={style.text}
            weight="extraBold"
            ellipsizeMode="tail"
            size={small ? 'xs' : 'small'}
            marginRight={rightText ? 0 : 1}
            numberOfLines={1}
            textTransform="uppercase"
          >
            {rightText || 'View'}
          </Text>
          {!rightText && (
            <Icon
              name="chevron-right"
              color={style.text.color as ColorTypes}
              iconSize="medium"
            />
          )}
        </Touchable>
      </Container>
    </Container>
  );
};
