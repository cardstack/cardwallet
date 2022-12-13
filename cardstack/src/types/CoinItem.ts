export interface CoinItem {
  /** ex: eth */
  address?: string;
  balance: {
    /** ex: "100" */
    amount: string;
    /** ex: "100.00 ETH" */
    display: string;
  };
  /** ex: "dai" */
  coingecko_id: string;
  decimals: number;
  icon_url: string;
  isCoin: boolean;
  isHidden: boolean;
  isPinned: boolean;
  isRainbowCurated: boolean;
  isSmall: boolean;
  isVerified: boolean;
  name: string;
  native: {
    balance: {
      amount: string;
      display: string;
    };
    /** ex: "-0.517%" */
    change: string;
    price: {
      amount: number;
      display: string;
    };
  };
  price: {
    /** ex: 1614805795 */
    changed_at: number;
    /** ex: -0.5172559866460995 */
    relative_change_24h: number;
    /** 0.997955 */
    value: number;
  };
  /** ex: ETH */
  symbol: string;
  /** ex: token */
  type: string;
  /** ex: eth */
  id: string;
}
