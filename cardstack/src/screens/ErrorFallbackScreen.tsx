import React, { memo, useEffect } from 'react';
import { useRoute } from '@react-navigation/core';
import { captureException } from '@sentry/react-native';
import ErrorFallback from '@cardstack/components/ErrorBoundary/ErrorFallback';
import logger from 'logger';

interface RouteType {
  params: {
    message?: string;
  };
  key: string;
  name: string;
}

const ErrorFallbackScreen = () => {
  const {
    params: { message = 'something went wrong' },
  } = useRoute<RouteType>();

  useEffect(() => {
    logger.sentry('Error:', message);
    captureException(new Error('ErrorFallback:' + message));
  }, [message]);

  return <ErrorFallback message={message} />;
};

export default memo(ErrorFallbackScreen);
