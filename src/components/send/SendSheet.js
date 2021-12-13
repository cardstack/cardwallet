import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { KeyboardArea } from 'react-native-keyboard-area';
import styled from 'styled-components';
import isNativeStackAvailable from '../../helpers/isNativeStackAvailable';
import { checkIsValidAddressOrDomain } from '../../helpers/validators';
import { Column } from '../layout';
import {
  SendAssetForm,
  SendAssetList,
  SendButton,
  SendContactList,
  SendHeader,
  SendTransactionSpeed,
} from '.';
import {
  useAccountSettings,
  useContacts,
  useDimensions,
} from '@rainbow-me/hooks';
import { borders } from '@rainbow-me/styles';
import { deviceUtils } from '@rainbow-me/utils';

const sheetHeight = deviceUtils.dimensions.height - (android ? 30 : 10);
const statusBarHeight = getStatusBarHeight(true);

const Container = styled.View`
  background-color: ${({ theme: { colors } }) => colors.transparent};
  flex: 1;
  padding-top: ${isNativeStackAvailable ? 0 : statusBarHeight};
  width: 100%;
`;

const SheetContainer = styled(Column).attrs({
  align: 'center',
  flex: 1,
})`
  ${borders.buildRadius('top', isNativeStackAvailable ? 0 : 16)};
  background-color: ${({ theme: { colors } }) => colors.white};
  height: ${isNativeStackAvailable || android ? sheetHeight : '100%'};
  width: 100%;
`;

const KeyboardSizeView = styled(KeyboardArea)`
  width: 100%;
  background-color: ${({ showAssetForm, theme: { colors } }) =>
    showAssetForm ? colors.lighterGrey : colors.white};
`;

export const useShowAssetFlags = (isValidAddress, selected) => ({
  showAssetList: isValidAddress && isEmpty(selected),
  showAssetForm: isValidAddress && !isEmpty(selected),
});

export const useSendAddressValidation = recipient => {
  const [isValidAddress, setIsValidAddress] = useState(false);

  const checkAddress = useCallback(async () => {
    const validAddress = await checkIsValidAddressOrDomain(recipient);
    setIsValidAddress(validAddress);
  }, [recipient]);

  useEffect(() => {
    checkAddress();
  }, [checkAddress]);

  return isValidAddress;
};

export default function SendSheet({
  isValidAddress,
  handleFocus,
  setRecipient,
  triggerFocus,
  recipient,
  recipientFieldRef,
  allAssets,
  nativeCurrency,
  network,
  onSelectAsset,
  hiddenCoins = [],
  pinnedCoins = [],
  savings = [],
  sendableCollectibles = [],
  amountDetails,
  isAuthorizing,
  isSufficientGas,
  onSendPress,
  onChangeAssetAmount,
  onChangeNativeAmount,
  onResetAssetSelection,
  selected,
  onMaxBalancePress,
  selectedGasPrice,
  fetchData = undefined,
  onPressTransactionSpeed = undefined,
  showNativeCurrencyField = true,
}) {
  const [currentInput, setCurrentInput] = useState('');

  const { isTinyPhone } = useDimensions();
  const { nativeCurrencySymbol } = useAccountSettings();
  const { contacts, onRemoveContact, filteredContacts } = useContacts();
  const { showAssetList, showAssetForm } = useShowAssetFlags(
    isValidAddress,
    selected
  );

  const showEmptyState = !isValidAddress;

  const onChangeInput = useCallback(
    event => {
      setCurrentInput(event);
      setRecipient(event);
    },
    [setRecipient]
  );

  return (
    <Container>
      {ios && <StatusBar barStyle="light-content" />}
      <SheetContainer>
        <SendHeader
          contacts={contacts}
          isValidAddress={isValidAddress}
          onChangeAddressInput={onChangeInput}
          onFocus={handleFocus}
          onPressPaste={setRecipient}
          onRefocusInput={triggerFocus}
          recipient={recipient}
          recipientFieldRef={recipientFieldRef}
          removeContact={onRemoveContact}
          showAssetList={showAssetList}
        />
        {showEmptyState && (
          <SendContactList
            contacts={filteredContacts}
            currentInput={currentInput}
            onPressContact={setRecipient}
            removeContact={onRemoveContact}
          />
        )}
        {showAssetList && (
          <SendAssetList
            allAssets={allAssets}
            collectibles={sendableCollectibles}
            fetchData={fetchData}
            hiddenCoins={hiddenCoins}
            nativeCurrency={nativeCurrency}
            network={network}
            onSelectAsset={onSelectAsset}
            pinnedCoins={pinnedCoins}
            savings={savings}
          />
        )}
        {showAssetForm && (
          <SendAssetForm
            allAssets={allAssets}
            assetAmount={amountDetails.assetAmount}
            buttonRenderer={
              <SendButton
                assetAmount={amountDetails.assetAmount}
                isAuthorizing={isAuthorizing}
                isSufficientBalance={amountDetails.isSufficientBalance}
                isSufficientGas={isSufficientGas}
                onPress={onSendPress}
                smallButton={isTinyPhone}
                testID="send-sheet-confirm"
              />
            }
            nativeAmount={amountDetails.nativeAmount}
            nativeCurrency={nativeCurrency}
            onChangeAssetAmount={onChangeAssetAmount}
            onChangeNativeAmount={onChangeNativeAmount}
            onFocus={handleFocus}
            onResetAssetSelection={onResetAssetSelection}
            selected={selected}
            sendMaxBalance={onMaxBalancePress}
            showNativeCurrencyField={showNativeCurrencyField}
            txSpeedRenderer={
              <SendTransactionSpeed
                gasPrice={selectedGasPrice}
                nativeCurrencySymbol={nativeCurrencySymbol}
                onPressTransactionSpeed={onPressTransactionSpeed}
              />
            }
          />
        )}
        {android && showAssetForm ? (
          <KeyboardSizeView showAssetForm={showAssetForm} />
        ) : null}
      </SheetContainer>
    </Container>
  );
}
