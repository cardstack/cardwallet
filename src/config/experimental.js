/**
 * This file contains flags for enabling features which are still in development.
 * While adding new functionality, please verify it against these features
 * keeping in mind that they should never be broken
 */

export const DISCOVER_SHEET = 'discoverSheet';
export const REVIEW_ANDROID = 'reviewAndroid';

export const defaultConfig = {
  [DISCOVER_SHEET]: false,
  [REVIEW_ANDROID]: false,
};
