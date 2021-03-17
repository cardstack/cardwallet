import React, { Fragment } from 'react';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import AssetTypes from '../../helpers/assetTypes';
import { useAsset } from '../../hooks';
import { SendCoinRow } from '../coin-row';
import CollectiblesSendRow from '../coin-row/CollectiblesSendRow';
import SendSavingsCoinRow from '../coin-row/SendSavingsCoinRow';
import { Icon } from '../icons';
import SendAssetFormCollectible from './SendAssetFormCollectible';
import SendAssetFormToken from './SendAssetFormToken';
import { Container } from '@cardstack/components';

const KeyboardSizeView = styled(KeyboardArea)`
  background-color: ${({ theme: { colors } }) => colors.white};
`;

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
  const selectedAsset = useAsset(selected);

  const isNft = selectedAsset.type === AssetTypes.nft;
  const isSavings = selectedAsset.type === AssetTypes.compound;

  const AssetRowElement = isNft
    ? CollectiblesSendRow
    : isSavings
    ? SendSavingsCoinRow
    : SendCoinRow;

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
        item={selectedAsset}
        onPress={onResetAssetSelection}
        selected
        testID="send-asset-form"
      >
        <Icon name="doubleCaret" />
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
            asset={selectedAsset}
            buttonRenderer={buttonRenderer}
            txSpeedRenderer={txSpeedRenderer}
          />
        ) : (
          <Fragment>
            <SendAssetFormToken
              {...props}
              assetAmount={assetAmount}
              buttonRenderer={buttonRenderer}
              nativeAmount={nativeAmount}
              nativeCurrency={nativeCurrency}
              onChangeAssetAmount={onChangeAssetAmount}
              onChangeNativeAmount={onChangeNativeAmount}
              onFocus={onFocus}
              selected={selectedAsset}
              sendMaxBalance={sendMaxBalance}
              txSpeedRenderer={txSpeedRenderer}
            />
            {ios ? <KeyboardSizeView isOpen /> : null}
          </Fragment>
        )}
      </Container>
    </Container>
  );
}
