import {
  getMaintenanceStatus,
  getMinimumVersion,
  getReviewFeature,
} from '@cardstack/services/firebase-cloud-functions';

import logger from 'logger';

describe('Firebase cloud functions services', () => {
  let originalFetch: any;
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve([]) } as any)
    );

    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it(`should fetch reviewFeature firebase's cloud function`, async () => {
    await getReviewFeature();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/reviewFeature'
    );
  });

  it(`should fetch maintenanceStatus firebase's cloud function`, async () => {
    await getMaintenanceStatus();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/maintenanceStatus'
    );
  });

  it(`should fetch minimumVersion firebase's cloud function`, async () => {
    await getMinimumVersion();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/minimumVersion'
    );
  });

  it(`should log error to sentry on failure`, async () => {
    global.fetch = jest.fn().mockRejectedValueOnce('error');

    const spyLogger = jest
      .spyOn(logger, 'sentry')
      .mockImplementation(jest.fn());

    await getMinimumVersion();

    expect(spyLogger).toHaveBeenCalledWith('getminimumVersion', 'error');
  });
});
