import {
  getSDK,
  PrepaidCardSafe,
  NativeCurrency,
} from '@cardstack/cardpay-sdk';

import {
  EthersSignerParams,
  getWeb3ProviderWithEthSigner,
} from '@cardstack/models/ethers-wallet';
import { getSafesInstance } from '@cardstack/models/safes-providers';
import { getSafeData } from '@cardstack/services';
import { PrepaidCardType } from '@cardstack/types';
import { fetchCardCustomizationFromDID } from '@cardstack/utils';

import logger from 'logger';

import { updateSafeWithTokenPrices } from '../gnosis-service';

import {
  PrepaidCardPayMerchantQueryParams,
  PrepaidCardSafeQueryParams,
  PrepaidCardTransferQueryParams,
} from './prepaid-card-types';

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

export const extendPrepaidCard = async (
  prepaidCard: PrepaidCardSafe,
  nativeCurrency: NativeCurrency
) => ({
  // The order matters, first add new property then modify tokens
  // otherwise tokens with prices will be overwritten by old tokens
  ...(await addPrepaidCardCustomization(prepaidCard)),
  ...((await updateSafeWithTokenPrices(
    prepaidCard,
    nativeCurrency
  )) as PrepaidCardType),
});

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

const getPrepaidCardInstance = async (signedParams?: EthersSignerParams) => {
  const [web3, signer] = await getWeb3ProviderWithEthSigner(signedParams);

  const prepaidCardInstance = await getSDK('PrepaidCard', web3, signer);

  return prepaidCardInstance;
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
    prepaidCardSafes?.map(async prepaidCard =>
      extendPrepaidCard(prepaidCard, nativeCurrency)
    )
  );

  return {
    prepaidCards: extendedPrepaidCards,
  };
};

// Mutations

export const transferPrepaidCard = async ({
  prepaidCardAddress,
  newOwner,
  accountAddress,
}: PrepaidCardTransferQueryParams) => {
  const prepaidCardInstance = await getPrepaidCardInstance({ accountAddress });

  const transfer = await prepaidCardInstance.transfer(
    prepaidCardAddress,
    newOwner,
    undefined,
    { from: accountAddress }
  );

  return transfer;
};

export const payMerchant = async ({
  prepaidCardAddress,
  merchantAddress,
  accountAddress,
  spendAmount,
}: PrepaidCardPayMerchantQueryParams) => {
  const prepaidCardInstance = await getPrepaidCardInstance({ accountAddress });

  const receipt = await prepaidCardInstance.payMerchant(
    merchantAddress,
    prepaidCardAddress,
    spendAmount,
    undefined,
    { from: accountAddress }
  );

  return receipt;
};
