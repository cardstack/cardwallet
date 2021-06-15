import { useQuery } from '@apollo/client';
import { getTransactionHistoryData, sokolClient } from '@cardstack/graphql';
import { isLayer1 } from '@cardstack/utils';
import { useAccountTransactions } from '@rainbow-me/hooks';
import { useRainbowSelector } from '@rainbow-me/redux/hooks';
import logger from 'logger';

const useSokolTransactions = () => {
  const [accountAddress, network] = useRainbowSelector(state => [
    state.settings.accountAddress,
    state.settings.network,
  ]);

  const { data, loading, error } = useQuery(getTransactionHistoryData, {
    client: sokolClient,
    skip: !accountAddress || isLayer1(network),
    variables: {
      address: accountAddress,
    },
  });

  if (error) {
    logger.log('Error getting Sokol transactions', error);
  }

  console.log({ data, loading, error });

  console.log({
    createdPrepaidCards: JSON.stringify(data?.account, null, 2),
  });

  return {
    isLoadingTransactions: loading,
    sections: [],
  };
};

export const useTransactions = () => {
  const network = useRainbowSelector(state => state.settings.network);
  const layer1Data = useAccountTransactions();
  const layer2Data = useSokolTransactions();

  if (isLayer1(network)) {
    return layer1Data;
  }

  return layer2Data;
};
