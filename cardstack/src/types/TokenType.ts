export interface TokenType {
  native: {
    balance: {
      amount: string;
      display: string;
    };
  };
  balance: {
    amount: string;
    display: string;
  };
  token: {
    decimals: number;
    logoUri: string;
    name: string;
    symbol: string;
    value: string;
  };
  tokenAddress: string;
}
