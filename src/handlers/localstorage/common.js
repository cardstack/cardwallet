/*global storage*/
import { toLower } from 'lodash';

import logger from 'logger';

const defaultVersion = '0.1.0';

export const getKey = (prefix, accountAddress, network) =>
  `${prefix}-${toLower(accountAddress)}-${toLower(network)}`;

/**
 * @desc save to storage
 * @param  {String}  [key='']
 * @param  {Object}  [data={}]
 * @param  {String} [version=defaultVersion]
 */
export const saveLocal = async (
  key = '',
  data = {},
  expires = 0, // 0 means never expires
  version = defaultVersion,
  id = ''
) => {
  try {
    data.storageVersion = version;
    const params = {
      key,
      data,
      ...(id ? { id } : {}),
      ...(expires ? { expires } : {}),
    };
    await storage.save(params);
  } catch (error) {
    logger.log('Storage: error saving to local for key', key);
  }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const getLocal = async (key = '', version = defaultVersion, id = '') => {
  try {
    const params = {
      key,
      autoSync: false,
      syncInBackground: false,
      ...(id ? { id } : {}),
    };
    const result = await storage.load(params);
    if (result && result.storageVersion === version) {
      return result;
    }
    if (result) {
      removeLocal(key);
      return null;
    }
    return null;
  } catch (error) {
    logger.log('Storage: error getting from local for key', key);
    return null;
  }
};

/**
 * @desc get from storage
 * @param  {String}  [key='']
 * @return {Object}
 */
export const removeLocal = (key = '', id = '') => {
  try {
    storage.remove({ key, ...(id ? { id } : {}) });
  } catch (error) {
    logger.log('Storage: error removing local with key', key, error);
  }
};

export const getGlobal = async (
  key,
  emptyState = [],
  version = defaultVersion
) => {
  const result = await getLocal(key, version);
  return result ? result.data : emptyState;
};

export const saveGlobal = (key, data, version = defaultVersion) =>
  saveLocal(key, { data }, null, version);

export const getAccountLocal = async (
  prefix,
  accountAddress,
  network,
  emptyState = [],
  version = defaultVersion
) => {
  const key = getKey(prefix, accountAddress, network);
  const result = await getLocal(key, version);

  return result ? result.data : emptyState;
};

export const saveAccountLocal = (
  prefix,
  data,
  accountAddress,
  network,
  version = defaultVersion
) =>
  saveLocal(getKey(prefix, accountAddress, network), { data }, null, version);

export const removeAccountLocal = (prefix, accountAddress, network) => {
  const key = getKey(prefix, accountAddress, network);
  removeLocal(key);
};
