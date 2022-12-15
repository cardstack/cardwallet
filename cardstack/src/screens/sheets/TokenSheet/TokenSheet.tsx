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
      <Container
        {...centerRowProps}
        justifyContent="space-between"
        marginVertical={2}
        paddingHorizontal={5}
      >
        <BalanceTitle title={strings.balance} />
        <Container {...centerRowProps}>
          <CoinIcon {...asset} size={20} />
          <Text fontSize={20} marginLeft={1} weight="extraBold">
            {asset.balance?.display}
          </Text>
        </Container>
        {hasNativeBalance && (
          <>
            <BalanceTitle title={strings.value} />
            <Text fontSize={20} weight="extraBold">
              {asset?.native?.balance.display}
            </Text>
          </>
        )}
      </Container>
      <Container
        {...centerRowProps}
        justifyContent="space-around"
        paddingTop={2}
        width="100%"
      >
        <SendActionButton asset={asset} safeAddress={safeAddress} />
      </Container>
    </Sheet>
  );
};

export default memo(TokenSheet);

const BalanceTitle = ({ title }: { title: string }) => (
  <Text color="grayText" fontSize={13} marginBottom={1}>
    {title}
  </Text>
);
