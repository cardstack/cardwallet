import { PrepaidCardSafe } from '@cardstack/cardpay-sdk';
import { updateSafeWithTokenPrices } from '../gnosis-service';
import { PrepaidCardSafeQueryParams } from './prepaid-card-types';
import { getSafeData } from '@cardstack/services';
import logger from 'logger';
import { fetchCardCustomizationFromDID } from '@cardstack/utils';
import { getSafesInstance } from '@cardstack/models';
import { PrepaidCardType } from '@cardstack/types';

export const addPrepaidCardCustomization = async (card: PrepaidCardSafe) => {
  try {
    const cardCustomization = await fetchCardCustomizationFromDID(
      card.customizationDID
    );

    return {
      ...card,
      cardCustomization,
    };
  } catch (e) {
    logger.sentry('Error getting cardCustomization', e);
  }

  return card;
};

export const getPrepaidCardByAddress = async (
  address: string
): Promise<PrepaidCardSafe | undefined> => {
  try {
    const prepaidCard = (await getSafeData(address)) as
      | PrepaidCardSafe
      | undefined;

    if (prepaidCard) {
      const updatedPrepaidCard = addPrepaidCardCustomization(prepaidCard);

      return updatedPrepaidCard;
    }

    return prepaidCard;
  } catch (e) {
    logger.sentry('Error getPrepaidCardByAddress', e);
  }
};

// Queries

export const fetchPrepaidCards = async ({
  accountAddress,
  nativeCurrency,
}: PrepaidCardSafeQueryParams) => {
  const safesInstance = await getSafesInstance();

  const prepaidCardSafes =
    ((
      await safesInstance?.view(accountAddress, {
        type: 'prepaid-card',
      })
    )?.safes as PrepaidCardSafe[]) || [];

  const extendedPrepaidCards = await Promise.all(
    prepaidCardSafes?.map(async prepaidCard => ({
      // The order matters, first add new property then modify tokens
      // otherwise tokens with prices will be overwritten by old tokens
      ...(await addPrepaidCardCustomization(prepaidCard)),
      ...((await updateSafeWithTokenPrices(
        prepaidCard,
        nativeCurrency
      )) as PrepaidCardType),
    }))
  );

  return {
    prepaidCards: extendedPrepaidCards,
  };
};
