export interface AssetType {
  address: string;
  balance: {
    amount: string;
    display: string;
  };
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
    balance: {
      amount: string;
      display: string;
    };
    change: string;
    price: {
      amount: number;
      display: string;
    };
  };
}
