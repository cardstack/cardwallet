import { AddExistingAccountRequest, AddExistingAccountResponse } from './types';

/**
 * A generic interface to communicate with the CardPay backend services.
 */
export default class CardPay {
  private TAG = 'CardPay';

  /**
   * Adds an existing account.
   */
  addExistingAccount = (
    req: AddExistingAccountRequest
  ): AddExistingAccountResponse => {
    console.log(this.TAG, 'addExistingAccount, req: ' + JSON.stringify(req));

    return {} as AddExistingAccountResponse;
  };
}
