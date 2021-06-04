export interface CollectibleType {
  animation_url: string | null;
  description: string;
  external_link: string;
  image_original_url: string | null;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_url: string;
  name: string;
  permalink: string;
  traits: any[];
  asset_contract: {
    address: string;
    description: string;
    external_link: string;
    image_url: string;
    name: string;
    nft_version: string;
    schema_name: string;
    symbol: string;
    total_supply: string;
  };
  background: string;
  familyImage: string;
  id: string;
  isSendable: boolean;
  lastPrice: number;
  type: string;
  uniqueId: string;
  networkName: string;
  nativeCurrency: string;
}
