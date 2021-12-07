import { getSDK } from '@cardstack/cardpay-sdk';
import { getHubUrl } from '@cardstack/services';
import Web3Instance from '@cardstack/models/web3-instance';
import { Network } from '@rainbow-me/networkTypes';
import { getSelectedWallet } from '@rainbow-me/model/wallet';
import { getNetwork } from '@rainbow-me/handlers/localstorage/globalSettings';

export const getAuthToken = async (
  accountAddress: string
): Promise<string | null> => {
  const network: Network = await getNetwork();
  const hubURL = getHubUrl(network);
  const selectedWallet = await getSelectedWallet();

  if (selectedWallet) {
    const web3 = await Web3Instance.get({
      selectedWallet: selectedWallet.wallet,
      network,
    });

    const authAPI = await getSDK('HubAuth', web3, hubURL);
    return await authAPI.authenticate({ from: accountAddress });
  }

  return null;
};
