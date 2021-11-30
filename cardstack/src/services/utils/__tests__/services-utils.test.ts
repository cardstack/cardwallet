import * as sentry from '@sentry/minimal';
import { queryPromiseWrapper } from '../index';
import logger from 'logger';

describe('service utils', () => {
  describe('queryPromiseWrapper', () => {
    const captureExceptionSpy = jest.spyOn(sentry, 'captureException');

    beforeAll(() => {
      logger.sentry = jest.fn();
    });

    it('it should call a given promise with its params', async () => {
      const anyPromise = jest
        .fn()
        .mockImplementation((params: string) => Promise.resolve(params));

      await queryPromiseWrapper(anyPromise, 'foo');

      expect(anyPromise).toBeCalledWith('foo');
    });

    it('it should return a strutured data object given a successful promise', async () => {
      const successPromiseResult = { foo: 'bar' };

      const anyPromise = () => Promise.resolve(successPromiseResult);

      const queryWrapperResult = await queryPromiseWrapper(
        anyPromise,
        undefined
      );

      expect(queryWrapperResult).toStrictEqual({ data: successPromiseResult });
    });

    it('it should return a strutured error object given a failed promise', async () => {
      const anyPromise = () => Promise.reject('Error');

      const queryWrapperResult = await queryPromiseWrapper(
        anyPromise,
        undefined
      );

      expect(logger.sentry).toBeCalledWith(
        'Error on queryPromiseWrapper',
        'Error'
      );

      expect(captureExceptionSpy).toBeCalledWith('Error');

      expect(queryWrapperResult).toStrictEqual({
        error: {
          status: 418,
          data: 'Error',
        },
      });
    });

    it('it should return a strutured custom error object given a failed promise and status error', async () => {
      const anyPromise = () => Promise.reject('Error');

      const queryWrapperResult = await queryPromiseWrapper(
        anyPromise,
        undefined,
        { errorStatus: 400, errorLogMessage: 'Error on anyPromise' }
      );

      expect(logger.sentry).toBeCalledWith('Error on anyPromise', 'Error');
      expect(captureExceptionSpy).toBeCalledWith('Error');

      expect(queryWrapperResult).toStrictEqual({
        error: {
          status: 400,
          data: 'Error',
        },
      });
    });
  });
});
