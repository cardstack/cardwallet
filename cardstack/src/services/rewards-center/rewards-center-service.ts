import { Safe } from '@cardstack/cardpay-sdk';
import { updateSafeWithTokenPrices } from '../gnosis-service';
import {
  RewardsSafeQueryParams,
  RewardsSafeType,
} from './rewards-center-types';
import { getSafesInstance } from '@cardstack/models';

// Queries

export const fetchRewardsSafe = async ({
  accountAddress,
  nativeCurrency,
}: RewardsSafeQueryParams) => {
  const safesInstance = await getSafesInstance();

  const rewardSafes: Safe[] =
    (
      await safesInstance?.view(accountAddress, {
        type: 'reward',
      })
    )?.safes || [];

  const extendedRewardSafes = await Promise.all(
    rewardSafes?.map(
      async safe =>
        (updateSafeWithTokenPrices(
          safe,
          nativeCurrency
        ) as unknown) as RewardsSafeType
    )
  );

  return {
    rewardSafes: extendedRewardSafes,
  };
};
