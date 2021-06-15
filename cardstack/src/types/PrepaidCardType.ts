import { TokenType } from '.';

export interface PrepaidCardType {
  address: string;
  addressPrev: string;
  issuer: string;
  issuingToken: string;
  spendFaceValue: number;
  tokens: TokenType[];
  type: string;
  reloadable: boolean;
}
