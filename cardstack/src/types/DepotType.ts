import { TokenType } from './TokenType';
export interface DepotType {
  /** unique identifier, displayed in top right corner of card */
  address: string;
  onPress: () => void;
  /** balance in xDai */
  tokens: Array<TokenType>;
}
