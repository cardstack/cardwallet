import { useEffect, useState } from 'react';
import { fromWei } from '@cardstack/cardpay-sdk';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { PrepaidCardCustomization } from '@cardstack/types';
import { axiosInstance } from '@cardstack/models/axios-instance';

export interface Inventory {
  id: string;
  type: string;
  isSelected: boolean;
  amount: number;
  attributes: InventoryAttrs;
}

interface InventoryAttrs {
  issuer: string;
  sku: string;
  'issuing-token-symbol': string;
  'issuing-token-address': string;
  'face-value': number;
  'ask-price': string;
  'customization-DID': PrepaidCardCustomization;
  quantity: number;
  reloadable: boolean;
  transferrable: boolean;
}

export const usePrepaidCardInventory = (hubURL: string, authToken: string) => {
  const [inventoryData, setInventoryData] = useState<Inventory[]>();

  const { callback: getInventories, error, isLoading } = useWorker(async () => {
    const results = await axiosInstance(authToken).get('/api/inventories');

    if (results?.data?.data) {
      const inventory = results?.data?.data;

      const dataWithIsSelected = inventory
        .sort((a: Inventory, b: Inventory) => {
          return a.attributes['face-value'] - b.attributes['face-value'];
        })
        .map((item: Inventory) => {
          return {
            ...item,
            isSelected: false,
            amount: fromWei(item?.attributes['ask-price']),
          };
        });

      setInventoryData(dataWithIsSelected || []);
    }
  }, [authToken]);

  useEffect(() => {
    getInventories();
  }, [getInventories]);

  useEffect(() => {
    if (error) {
      logger.log('Error getting inventory data', error);
    }
  }, [error]);

  return { inventoryData, setInventoryData, isLoading };
};
