import { useEffect, useState } from 'react';
import { useRouteParams } from './use-route-params';

export const useParsedMessage = () => {
  const [parsedMessage, setParsedMessage] = useState('');

  const {
    transactionDetails: { displayDetails },
  } = useRouteParams();

  useEffect(() => {
    let msg = displayDetails.request;

    try {
      msg = JSON.parse(msg);
    } catch (e) {}

    msg = JSON.stringify(msg, null, 4);

    setParsedMessage(msg);
  }, [displayDetails]);

  return parsedMessage;
};
