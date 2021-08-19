import {
  getMaintenanceStatus,
  getMinimumVersion,
  getReviewFeature,
} from '../../src/services/firebase-cloud-functions';

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
});
