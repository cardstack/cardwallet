import { BaseStrategy } from './base-strategy';
import { HubAuthData, TransactionConfirmationType } from '@cardstack/types';

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
