import React from 'react';
import { useSendSheetDepotScreen } from './useSendSheetDepotScreen';
import SendSheet from '@rainbow-me/components/send/SendSheet';

const SendSheetDepot = () => {
  const hookProps = useSendSheetDepotScreen();

  return <SendSheet {...hookProps} />;
};

export default SendSheetDepot;
