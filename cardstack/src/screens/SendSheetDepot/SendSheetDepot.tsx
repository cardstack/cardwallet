import React from 'react';
import { useSendSheetDepotScreen } from './useSendSheetDepotScreen';
import SendSheet from '@rainbow-me/components/send/SendSheet';
import { SendSheetType } from '@rainbow-me/components/send';

const SendSheetDepot = () => {
  const hookProps = useSendSheetDepotScreen();

  return <SendSheet {...hookProps} type={SendSheetType.SEND_FROM_DEPOT} />;
};

export default SendSheetDepot;
