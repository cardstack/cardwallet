import { TokenType, PrepaidCardCustomization } from '.';

export interface PrepaidCardType {
  address: string;
  issuer: string;
  issuingToken: string;
  spendFaceValue: number;
  tokens: TokenType[];
  type: string;
  reloadable: boolean;
  transferrable: boolean;
  cardCustomization?: PrepaidCardCustomization;
}

export interface PrepaidLinearGradientInfo {
  hasGradient: boolean;
  angle?: number;
  angleCoords?: {
    x1: string;
    y1: string;
    x2: string;
    y2: string;
  };
  stop1?: {
    stopColor: string;
    offset: string;
  };
  stop2?: {
    stopColor: string;
    offset: string;
  };
}
