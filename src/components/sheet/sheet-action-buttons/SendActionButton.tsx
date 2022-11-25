import { useNavigation } from '@react-navigation/native';
//Rb side doesn't know how to handle globals
// eslint-disable-next-line import/no-extraneous-dependencies
import { OptionalUnion } from 'globals';
import React, { useCallback } from 'react';

import { Button, IconProps } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import {
  AssetWithNativeType,
  CollectibleType,
  TokenType,
} from '@cardstack/types';

const iconProps: IconProps = {
  iconSize: 'medium',
  marginRight: 2,
  name: 'send',
  top: 2,
};

type TokenOrAsset = OptionalUnion<AssetWithNativeType, TokenType>;

interface SendActionButtonProps {
  asset: OptionalUnion<TokenOrAsset, CollectibleType>;
  safeAddress?: string;
  small?: boolean;
}

export default function SendActionButton({
  asset,
  safeAddress,
  small,
}: SendActionButtonProps) {
  const { navigate } = useNavigation();

  const handlePress = useCallback(() => {
    const isSafe = !!asset?.tokenAddress;
    const route = isSafe ? Routes.SEND_FLOW_DEPOT : Routes.SEND_FLOW_EOA;

    navigate(route, { asset, safeAddress });
  }, [asset, safeAddress, navigate]);

  return (
    <Button
      iconProps={iconProps}
      onPress={handlePress}
      variant={small ? 'small' : undefined}
    >
      Send
    </Button>
  );
}
