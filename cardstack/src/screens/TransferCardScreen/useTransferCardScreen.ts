import { useCallback, useState } from 'react';

import { useSendAddressValidation } from '@rainbow-me/components/send/SendSheet';

export const useTransferCardScreen = () => {
  const [address, setAddress] = useState();

  const isValidAddress = useSendAddressValidation(address);

  const onChangeText = useCallback(text => {
    setAddress(text);
  }, []);

  const onTransferPress = useCallback(() => {
    // TODO: handle transfer
  }, []);

  const onScanPress = useCallback(() => {
    // TODO: handle scan qr code
  }, []);

  return {
    isValidAddress,
    onChangeText,
    onTransferPress,
    onScanPress,
  };
};
