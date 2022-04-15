import { useRoute } from '@react-navigation/core';
import { captureException } from '@sentry/react-native';
import React, { memo, useEffect } from 'react';

import ErrorFallback from '@cardstack/components/ErrorBoundary/ErrorFallback';
import { RouteType } from '@cardstack/navigation/types';

import logger from 'logger';

const ErrorFallbackScreen = () => {
  const {
    params: { message = 'something went wrong' },
  } = useRoute<RouteType<{ message?: string }>>();

  useEffect(() => {
    logger.sentry('Error:', message);
    captureException(new Error('ErrorFallback:' + message));
  }, [message]);

  return <ErrorFallback message={message} />;
};

export default memo(ErrorFallbackScreen);
