export interface BridgedToken {
  balance: {
    amount: string;
    display: string;
  };
  native: {
    amount: string;
    display: string;
  };
  transaction: {
    id: string;
  };
  to: string;
  token: string;
  timestamp: number;
  type: string;
}
