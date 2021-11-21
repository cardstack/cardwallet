import axios from 'axios';
import NetworkTypes from '@rainbow-me/networkTypes';
import { parseCollectiblesFromOpenSeaResponse } from '@rainbow-me/parsers';
import logger from 'logger';

export const OPENSEA_LIMIT_PER_PAGE = 50;
export const OPENSEA_LIMIT_TOTAL = 2000;

const api = axios.create({
  headers: {
    Accept: 'application/json',
  },
  timeout: 20000, // 20 secs
});

export const apiFetchCollectiblesForOwner = async (
  network,
  ownerAddress,
  page
) => {
  try {
    const networkPrefix = network === NetworkTypes.mainnet ? '' : `${network}-`;
    const offset = page * OPENSEA_LIMIT_PER_PAGE;
    const url = `https://${networkPrefix}api.opensea.io/api/v1/assets?exclude_currencies=true&owner=${ownerAddress}&limit=${OPENSEA_LIMIT_PER_PAGE}&offset=${offset}`;
    const data = await api.get(url);
    return parseCollectiblesFromOpenSeaResponse(data);
  } catch (error) {
    logger.log('Error getting collectibles from OpenSea', error);
    throw error;
  }
};
