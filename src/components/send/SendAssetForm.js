import React, { Fragment, useMemo } from 'react';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';

import AssetTypes from '../../helpers/assetTypes';
import { useAsset, useDimensions } from '../../hooks';
import { SendCoinRow } from '../coin-row';
import CollectiblesSendRow from '../coin-row/CollectiblesSendRow';
import SendSavingsCoinRow from '../coin-row/SendSavingsCoinRow';
import { Icon } from '../icons';
import { Column } from '../layout';
import SendAssetFormCollectible from './SendAssetFormCollectible';
import SendAssetFormToken from './SendAssetFormToken';
import { Container } from '@cardstack/components';
import { padding } from '@rainbow-me/styles';
import ShadowStack from 'react-native-shadow-stack';

const AssetRowShadow = colors => [
  [0, 1, 0, colors.shadow, 0.01],
  [0, 4, 12, colors.shadow, 0.04],
  [0, 8, 23, colors.shadow, 0.05],
];

const FormContainer = styled(Column).attrs({
  align: 'end',
  justify: 'space-between',
})`
  ${({ isNft, isTinyPhone }) =>
    isNft
      ? padding(22, 0, 0)
      : isTinyPhone
      ? padding(6, 15, 0)
      : padding(19, 15)};
  background-color: ${({ theme: { colors } }) => colors.lighterGrey};
  flex: 1;
  margin-bottom: ${android ? 0 : ({ isTinyPhone }) => (isTinyPhone ? -19 : 0)};
  width: 100%;
`;

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
    <Container flex={1} height="100%" overflow="hidden" width="100%">
      <AssetRowElement
        item={selectedAsset}
        onPress={onResetAssetSelection}
        selected
        testID="send-asset-form"
      >
        <Icon name="doubleCaret" />
      </AssetRowElement>
      <Container flex={1} padding={4} width="100%">
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
