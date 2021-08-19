enum CloudFuncNames {
  MINIMUM_VERSION = 'minimumVersion',
  MAINTENANCE_STATUS = 'maintenanceStatus',
  REVIEW_FEATURE = 'reviewFeature',
}

export const baseCloudFunctionsUrl =
  'https://us-central1-card-pay-3e9be.cloudfunctions.net';

const createCloudFuncGetRequest = async (name: CloudFuncNames) => {
  try {
    const response = await fetch(`${baseCloudFunctionsUrl}/${name}`);

    return await response.json();
  } catch (e) {
    console.error(`get${name}`, e);

    return false;
  }
};

export const getMaintenanceStatus = () =>
  createCloudFuncGetRequest(CloudFuncNames.MAINTENANCE_STATUS);

export const getMinimumVersion = () =>
  createCloudFuncGetRequest(CloudFuncNames.MINIMUM_VERSION);

export const getReviewFeature = () =>
  createCloudFuncGetRequest(CloudFuncNames.REVIEW_FEATURE);
