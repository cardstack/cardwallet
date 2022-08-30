import type { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

export type RTKErrorType = SerializedError | FetchBaseQueryError | undefined;

export interface ConnectionError {
  error: RTKErrorType;
  errorMessage: string;
  type: ErrorType;
}

export enum ErrorType {
  connectionError = 'connectionError',
  parsingError = 'parsingError',
  unknownError = 'unknownError',
}

const defaultErrorMessage = 'Connection error. Please try again soon.';

export const parseRTKConnectionError = (
  error: RTKErrorType
): ConnectionError | undefined => {
  if (!error) return undefined;

  // FetchBaseQueryError properties
  if ('status' in error) {
    const errorMessage =
      'error' in error ? error.error : JSON.stringify(error.data);

    return { error, errorMessage, type: ErrorType.connectionError };
  }

  // SerializedError properties
  if (error.message) {
    return {
      error,
      errorMessage: error.message,
      type: ErrorType.parsingError,
    };
  }

  // No defined error message present.
  return {
    error,
    errorMessage: defaultErrorMessage,
    type: ErrorType.unknownError,
  };
};
