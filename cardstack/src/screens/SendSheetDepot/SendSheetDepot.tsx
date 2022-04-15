import React from 'react';

import { SendSheetType } from '@rainbow-me/components/send';
import SendSheet from '@rainbow-me/components/send/SendSheet';

import { useSendSheetDepotScreen } from './useSendSheetDepotScreen';

const SendSheetDepot = () => {
  const hookProps = useSendSheetDepotScreen();

  return <SendSheet {...hookProps} type={SendSheetType.SEND_FROM_DEPOT} />;
};

export default SendSheetDepot;
