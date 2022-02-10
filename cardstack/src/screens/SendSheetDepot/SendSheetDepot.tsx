import React from 'react';
import { useSendSheetDepotScreen } from './useSendSheetDepotScreen';
import SendSheet, {
  SendSheetType,
} from '@rainbow-me/components/send/SendSheet';

const SendSheetDepot = () => {
  const hookProps = useSendSheetDepotScreen();

  return <SendSheet {...hookProps} type={SendSheetType.SEND_FROM_DEPOT} />;
};

export default SendSheetDepot;
