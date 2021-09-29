import { useEffect, useState } from 'react';
import { fromWei } from '@cardstack/cardpay-sdk';
import { useAuthToken } from '@cardstack/hooks/prepaid-card/useAuthToken';
import { useWorker } from '@cardstack/utils';
import logger from 'logger';
import { PrepaidCardCustomization } from '@cardstack/types';

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

export const usePrepaidCardInventory = (hubURL?: string) => {
  const [inventoryData, setInventoryData] = useState<Inventory[]>();
  const { authToken } = useAuthToken(hubURL);

  const { callback: getInventories, error, isLoading } = useWorker(async () => {
    const headerParams = {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer: ${authToken}`,
      },
    };

    const results = await fetch(`${hubURL}/api/inventories`, headerParams);

    if (results.ok) {
      const result = await results.json();

      const dataWithIsSelected = result.data.map((item: Inventory) => {
        return {
          ...item,
          isSelected: false,
          amount: fromWei(item?.attributes['ask-price']),
        };
      });

      setInventoryData(dataWithIsSelected);
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
