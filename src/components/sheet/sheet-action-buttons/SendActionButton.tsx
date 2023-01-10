import { useNavigation } from '@react-navigation/native';
import { OptionalUnion } from 'globals';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Button, IconProps } from '@cardstack/components';
import { Routes } from '@cardstack/navigation';
import {
  AssetTypes,
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

  const disabled = useMemo(() => {
    const noBalance = !parseFloat(asset.balance?.amount || '');

    return noBalance && asset.type === AssetTypes.token;
  }, [asset]);

  return (
    <Button
      alignSelf="center"
      disabled={disabled}
      iconProps={iconProps}
      onPress={handlePress}
    >
      Send
    </Button>
  );
}
