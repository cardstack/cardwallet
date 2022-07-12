import * as keychain from '@rainbow-me/model/keychain';
import { publicAccessControlOptions } from '@rainbow-me/model/wallet';

const EMAIL_CARD_DROP_CLAIMED_KEY = 'emailCardDropClaimedKey';

export const setEmailCardDropClaimed = (accountAddress: string) =>
  keychain.saveString(
    EMAIL_CARD_DROP_CLAIMED_KEY,
    accountAddress,
    publicAccessControlOptions
  );

export const getEmailCardDropClaimed = () =>
  keychain.loadString(EMAIL_CARD_DROP_CLAIMED_KEY);
