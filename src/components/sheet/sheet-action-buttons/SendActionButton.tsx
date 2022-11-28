import { useNavigation } from '@react-navigation/native';
//Rb side doesn't know how to handle globals
// eslint-disable-next-line import/no-extraneous-dependencies
import { OptionalUnion } from 'globals';
import React, { useCallback } from 'react';

import { useDispatch } from 'react-redux';
import { Button, IconProps } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import {
  AssetWithNativeType,
  CollectibleType,
  TokenType,
} from '@cardstack/types';
import { contactsLoadState } from '@rainbow-me/redux/contacts';

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
}

export default function SendActionButton({
  asset,
  safeAddress,
}: SendActionButtonProps) {
  const dispatch = useDispatch();

  const { navigate } = useNavigation();

  const handlePress = useCallback(() => {
    dispatch(contactsLoadState());

    const isSafe = !!asset?.tokenAddress;
    const route = isSafe ? Routes.SEND_FLOW_DEPOT : Routes.SEND_FLOW_EOA;

    navigate(route, { asset, safeAddress });
  }, [dispatch, asset, navigate, safeAddress]);

  return (
    <Button iconProps={iconProps} onPress={handlePress}>
      Send
    </Button>
  );
}
