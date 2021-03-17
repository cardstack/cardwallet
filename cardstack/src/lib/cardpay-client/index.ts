import { AddExistingWalletRequest, AddExistingWalletResponse } from './types';

/**
 * A generic interface to communicate with the CardPay backend services.
 */
export default class CardPay {
  private TAG = 'CardPay';

  /**
   * Adds an existing wallet.
   */
  addExistingWallet = (
    req: AddExistingWalletRequest
  ): AddExistingWalletResponse => {
    console.log(this.TAG, 'addExistingWallet, req: ' + JSON.stringify(req));

    return {} as AddExistingWalletResponse;
  };
}
