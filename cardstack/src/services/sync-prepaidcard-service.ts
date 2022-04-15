import { PrepaidCardSafe } from '@cardstack/cardpay-sdk';

import { getSafeData } from '@cardstack/services';

import { DATA_UPDATE_PREPAIDCARDS } from '@rainbow-me/redux/data';
import store from '@rainbow-me/redux/store';
import logger from 'logger';

export const syncPrepaidCardFaceValue = async (address: string) => {
  try {
    const updatedPrepaidCardSafe: PrepaidCardSafe = (await getSafeData(
      address
    )) as PrepaidCardSafe;

    if (updatedPrepaidCardSafe) {
      const { prepaidCards } = store.getState().data;

      const oldPrepaidCardSafe = prepaidCards.find(
        (prepaidCard: PrepaidCardSafe) => prepaidCard.address === address
      );

      store.dispatch({
        payload: {
          prepaidCards: prepaidCards.map((prepaidCard: PrepaidCardSafe) =>
            prepaidCard.address === address
              ? {
                  ...(oldPrepaidCardSafe || {}),
                  spendFaceValue: updatedPrepaidCardSafe.spendFaceValue,
                }
              : prepaidCard
          ),
        },
        type: DATA_UPDATE_PREPAIDCARDS,
      });
    }
  } catch (error) {
    logger.sentry('Sync PrepaidCard failed', address, error);
  }
};
