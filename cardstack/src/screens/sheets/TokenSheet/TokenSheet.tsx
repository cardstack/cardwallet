import { useRoute } from '@react-navigation/native';
import React, { memo } from 'react';

import {
  CoinIcon,
  Container,
  ContainerProps,
  Sheet,
  Text,
} from '@cardstack/components';
import { RouteType } from '@cardstack/navigation/types';
import { AssetWithNativeType } from '@cardstack/types';

import { SendActionButton } from '@rainbow-me/components/sheet';

import { strings } from './strings';

type RouteParams = {
  asset: AssetWithNativeType;
  safeAddress?: string;
};

const centerRowProps: ContainerProps = {
  alignItems: 'center',
  flexDirection: 'row',
};

const TokenSheet = () => {
  const { params } = useRoute<RouteType<RouteParams>>();

  const { asset, safeAddress } = params;

  const hasNativeBalance = !!parseFloat(asset.native?.balance.amount);

  return (
    <Sheet scrollEnabled={false}>
      <Container paddingHorizontal={5} justifyContent="space-between" flex={1}>
        <Container flex={0.5}>
          <CoinIcon {...asset} size={50} />
          <Text size="medium" weight="extraBold" paddingTop={3}>
            {asset.name}
          </Text>
        </Container>
        <Container {...centerRowProps} justifyContent="space-between">
          <BalanceInfo label={strings.balance} value={asset.balance?.display} />
          {hasNativeBalance && (
            <BalanceInfo
              label={strings.value}
              value={asset?.native?.balance.display}
              alignItems="flex-end"
            />
          )}
        </Container>
        <SendActionButton asset={asset} safeAddress={safeAddress} />
      </Container>
    </Sheet>
  );
};

export default memo(TokenSheet);

const BalanceInfo = ({
  label,
  value,
  alignItems,
}: {
  label: string;
  value?: string;
  alignItems?: ContainerProps['alignItems'];
}) => (
  <Container alignItems={alignItems}>
    <Text color="grayText" fontSize={13}>
      {label}
    </Text>
    <Text fontSize={20} weight="extraBold">
      {value}
    </Text>
  </Container>
);
