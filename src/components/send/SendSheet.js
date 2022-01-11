import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { checkIsValidAddressOrDomain } from '../../helpers/validators';
import {
  SendAssetForm,
  SendAssetList,
  SendButton,
  SendContactList,
  SendHeader,
  SendTransactionSpeed,
} from '.';
import { Sheet } from '@cardstack/components';
import {
  useAccountSettings,
  useContacts,
  useDimensions,
} from '@rainbow-me/hooks';

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
    <Sheet isFullScreen>
      {ios && <StatusBar barStyle="light-content" />}
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
    </Sheet>
  );
}
