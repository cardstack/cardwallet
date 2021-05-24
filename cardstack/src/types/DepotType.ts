import { TokenType } from './TokenType';
export interface DepotType {
  address: string;
  onPress: () => void;
  tokens: Array<TokenType>;
}
