import React from 'react';

import { CenteredContainer, Container } from '@cardstack/components';
import { AssetTypes } from '@cardstack/types';

import { SendCoinRow } from '../coin-row';
import CollectiblesSendRow from '../coin-row/CollectiblesSendRow';
import { Icon } from '../icons';

import SendAssetFormCollectible from './SendAssetFormCollectible';
import SendAssetFormToken from './SendAssetFormToken';

export default function SendAssetForm({
  assetAmount,
  buttonRenderer,
  nativeAmount,
  nativeCurrency,
  onChangeAssetAmount,
  onChangeNativeAmount,
  onFocus,
  onResetAssetSelection,
  selected,
  sendMaxBalance,
  txSpeedRenderer,
  ...props
}) {
  const isNft = selected.type === AssetTypes.nft;

  const AssetRowElement = isNft ? CollectiblesSendRow : SendCoinRow;

  return (
    <Container
      borderStyle="solid"
      borderTopColor="borderGray"
      borderTopWidth={1}
      flex={1}
      height="100%"
      overflow="hidden"
      width="100%"
    >
      <AssetRowElement
        item={selected}
        onPress={onResetAssetSelection}
        selected
        testID="send-asset-form"
      >
        <CenteredContainer>
          <Icon name="doubleCaret" />
        </CenteredContainer>
      </AssetRowElement>
      <Container
        borderStyle="solid"
        borderTopColor="borderGray"
        borderTopWidth={1}
        flex={1}
        padding={4}
        width="100%"
      >
        {isNft ? (
          <SendAssetFormCollectible
            asset={selected}
            buttonRenderer={buttonRenderer}
            txSpeedRenderer={txSpeedRenderer}
          />
        ) : (
          <SendAssetFormToken
            {...props}
            assetAmount={assetAmount}
            buttonRenderer={buttonRenderer}
            nativeAmount={nativeAmount}
            nativeCurrency={nativeCurrency}
            onChangeAssetAmount={onChangeAssetAmount}
            onChangeNativeAmount={onChangeNativeAmount}
            onFocus={onFocus}
            selected={selected}
            sendMaxBalance={sendMaxBalance}
            txSpeedRenderer={txSpeedRenderer}
          />
        )}
      </Container>
    </Container>
  );
}
