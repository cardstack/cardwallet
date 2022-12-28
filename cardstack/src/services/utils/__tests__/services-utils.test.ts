import * as sentry from '@sentry/react-native';

import { IncidentType } from '@cardstack/types';

import logger from 'logger';

import { queryPromiseWrapper, filterIncident } from '../index';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

describe('service utils', () => {
  describe('queryPromiseWrapper', () => {
    const captureExceptionSpy = jest.spyOn(sentry, 'captureException');

    beforeAll(() => {
      logger.sentry = jest.fn();
    });

    beforeEach(() => {
      jest.clearAllMocks();
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
        'myParam'
      );

      expect(logger.sentry).toBeCalledWith('Error on queryPromiseWrapper', {
        args: 'myParam',
        error: 'Error',
      });

      expect(captureExceptionSpy).toBeCalledWith('Error');

      expect(queryWrapperResult).toStrictEqual({
        error: {
          status: 418,
          data: 'Error',
        },
      });
    });

    it('it should return a timeout error', async () => {
      const timeToResolve = 20;

      const longerPromise = () =>
        new Promise(resolve => setTimeout(resolve, timeToResolve));

      const queryWrapperResult = await queryPromiseWrapper(
        longerPromise,
        undefined,
        { timeout: timeToResolve / 2 }
      );

      expect(logger.sentry).toBeCalledWith('Error on queryPromiseWrapper', {
        args: undefined,
        error: 'Request timeout',
      });

      expect(captureExceptionSpy).toBeCalledWith('Request timeout');

      expect(queryWrapperResult).toStrictEqual({
        error: {
          status: 408,
          data: 'Request timeout',
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

      expect(logger.sentry).toBeCalledWith('Error on anyPromise', {
        args: undefined,
        error: 'Error',
      });

      expect(captureExceptionSpy).toBeCalledWith('Error');

      expect(queryWrapperResult).toStrictEqual({
        error: {
          status: 400,
          data: 'Error',
        },
      });
    });
  });

  describe('filterIncident', () => {
    it('it should return critical incident from a full list', async () => {
      const incidents: IncidentType[] = [
        {
          name: 'All systems down.',
          impact: 'major',
          started_at: '2021-10-10T10:10:00.000Z',
        },
        {
          name: 'One small system down.',
          impact: 'minor',
          started_at: '2021-10-10T10:10:00.003Z',
        },
        {
          name: 'World down.',
          impact: 'critical',
          started_at: '2021-10-10T10:10:00.002Z',
        },
        {
          name: 'Internet down.',
          impact: 'critical',
          started_at: '2021-10-10T10:10:00.001Z',
        },
        {
          name: 'Upgrade RPC node',
          impact: 'maintenance',
          started_at: '2022-01-25T19:33:29.478Z',
        },
      ];

      expect(filterIncident(incidents)).toStrictEqual({
        name: 'World down.',
        impact: 'critical',
        started_at: '2021-10-10T10:10:00.002Z',
      });
    });

    it('it should return null given a empty incidents collection', async () => {
      const incidents: IncidentType[] = [];

      expect(filterIncident(incidents)).toBeNull();
    });

    it('it should return null given no matching impact type', async () => {
      const incidents: IncidentType[] = [
        {
          name: 'Not defined',
          impact: 'not-defined',
          started_at: '2021-10-10T10:10:00.000Z',
        },
      ];

      expect(filterIncident(incidents)).toBeNull();
    });

    it('it should return valid incident given list has one or more invalid impact type', async () => {
      const incidents: IncidentType[] = [
        {
          name: 'Internet down.',
          impact: 'critical',
          started_at: '2021-10-10T10:10:00.001Z',
        },
        {
          name: 'Not defined',
          impact: 'not-defined',
          started_at: '2021-10-10T10:10:00.000Z',
        },
      ];

      expect(filterIncident(incidents)).toStrictEqual({
        name: 'Internet down.',
        impact: 'critical',
        started_at: '2021-10-10T10:10:00.001Z',
      });
    });
  });
});
