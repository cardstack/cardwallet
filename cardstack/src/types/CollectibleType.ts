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
    nft_version: string | null;
    schema_name: string | null;
    symbol: string;
    total_supply: string | null;
  };
  background: string | null;
  familyImage: string | null;
  id: string;
  isSendable: boolean;
  isInterfaceValidated?: boolean;
  lastPrice: number | null;
  type: string;
  networkName: string;
  nativeCurrency: string;
}
