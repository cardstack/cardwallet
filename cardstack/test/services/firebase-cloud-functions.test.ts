import {
  getMaintenanceStatus,
  getMinimumVersion,
  getReviewFeature,
} from '@cardstack/services';

const fetchMock = jest
  .spyOn(global, 'fetch')
  .mockImplementation(() =>
    Promise.resolve({ json: () => Promise.resolve([]) } as any)
  );

describe('Firebase cloud functions services', () => {
  it(`it should fetch reviewFeature firebase's cloud function`, async () => {
    await getReviewFeature();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/reviewFeature'
    );
  });

  it(`it should fetch maintenanceStatus firebase's cloud function`, async () => {
    await getMaintenanceStatus();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/maintenanceStatus'
    );
  });

  it(`it should fetch minimumVersion firebase's cloud function`, async () => {
    await getMinimumVersion();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://us-central1-card-pay-3e9be.cloudfunctions.net/minimumVersion'
    );
  });
});
