export interface BalanceType {
  amount: string;
  display: string;
}

export interface AssetType {
  address: string;
  balance: BalanceType;
  coingecko_id: string;
  decimals: number;
  icon_url: string;
  name: string;
  price: {
    changed_at: number;
    relative_change_24h: number;
    value: number;
  };
  symbol: string;
  type: string;
  uniqueId: string;
}

export interface AssetWithNativeType extends AssetType {
  native: {
    balance: BalanceType;
    change: string;
    price: {
      amount: number;
      display: string;
    };
  };
}
