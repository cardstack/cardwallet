import { captureException } from '@sentry/react-native';
import React from 'react';
import ErrorFallback from './ErrorFallback';
import logger from 'logger';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.sentry(`Unhandled JS exception: ${JSON.stringify(errorInfo)}`);
    logger.sentry('Error:', error);
    captureException(new Error('ErrorBoundary'));
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
