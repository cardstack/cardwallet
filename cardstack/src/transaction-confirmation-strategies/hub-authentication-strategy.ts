import { HubAuthData, TransactionConfirmationType } from '@cardstack/types';

import { BaseStrategy } from './base-strategy';

export class HubAuthenticationStrategy extends BaseStrategy {
  isApplicable(): boolean {
    return this.primaryType === 'HubAuthentication';
  }

  public decodeRequest(): HubAuthData {
    return {
      type: TransactionConfirmationType.HUB_AUTH,
    };
  }
}
