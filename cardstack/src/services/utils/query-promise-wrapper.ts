import { captureException } from '@sentry/minimal';
import HDProvider from '@cardstack/models/hd-provider';
import logger from 'logger';

type QueryError = {
  error: {
    status: number;
    data: any;
  };
  data?: undefined;
};

type QuerySuccess<TResult> = {
  data: TResult;
  error?: undefined;
};

interface Options {
  errorStatus?: number;
  errorLogMessage?: string;
  resetHdProvider?: boolean;
}

export const queryPromiseWrapper = async <TResult, TArgs>(
  promise: (args: TArgs) => Promise<TResult>,
  args: TArgs,
  options?: Options
): Promise<QuerySuccess<TResult> | QueryError> => {
  try {
    const result = await promise(args);

    return { data: result };
  } catch (error) {
    const message = options?.errorLogMessage || 'Error on queryPromiseWrapper';

    logger.sentry(message, error);
    captureException(error);

    return {
      error: {
        status: options?.errorStatus || 418,
        data: error,
      },
    };
  } finally {
    options?.resetHdProvider && (await HDProvider.reset());
  }
};
