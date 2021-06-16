export interface BridgedToken {
  balance: {
    amount: string;
    display: string;
  };
  to: string;
  token: string;
  timestamp: number;
  type: string;
}
