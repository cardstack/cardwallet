import { OptionalUnion } from 'globals';
import { DepotType } from './DepotType';
import { MerchantSafeType } from '.';

export type MerchantOrDepotSafe = OptionalUnion<MerchantSafeType, DepotType>;
