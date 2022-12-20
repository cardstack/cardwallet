export interface RainbowToken {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  color?: string;
  favorite?: boolean;
  isRainbowCurated?: boolean;
  isVerified?: boolean;
  shadowColor?: string;
  id: string;
}
