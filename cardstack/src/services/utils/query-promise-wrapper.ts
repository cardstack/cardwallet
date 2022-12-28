import { captureException } from '@sentry/react-native';

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
  timeout?: number;
}

const timeout = {
  id: 0,
  defaultMs: 120000, // 2 min
  error: 'Request timeout',
  status: 408,
};

const timeoutRacer = (ms = timeout.defaultMs) =>
  new Promise(
    (_, reject) => (timeout.id = setTimeout(reject, ms, timeout.error))
  );

export const queryPromiseWrapper = async <TResult, TArgs>(
  promise: (args: TArgs) => Promise<TResult>,
  args: TArgs,
  options?: Options
): Promise<QuerySuccess<TResult> | QueryError> => {
  try {
    //@ts-expect-error ts doesn't know timeoutRacer will reject promise and has no result
    const result: TResult = await Promise.race([
      promise(args),
      timeoutRacer(options?.timeout),
    ]).finally(() => !!timeout.id && clearTimeout(timeout.id));

    return { data: result };
  } catch (error) {
    const message = options?.errorLogMessage || 'Error on queryPromiseWrapper';

    logger.sentry(message, { error, args });

    captureException(error);

    return {
      error: {
        status:
          options?.errorStatus ||
          (timeout.error === error ? timeout.status : 418),
        data: error,
      },
    };
  }
};
