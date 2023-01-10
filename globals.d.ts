import * as rnKeychain from 'react-native-keychain';

import { Routes } from '@cardstack/navigation';

// @ts-expect-error ts doesn't know about
declare let __DEV__: boolean;
declare let akd: boolean;

/* Rainbow uses a rn-keychain patch with these two custom methods
 * which are not part of rn-keychain lib types, so we need to add custom
 * declarations
 */
declare module 'react-native-keychain' {
  export function getAllInternetCredentials(): Promise<null | {
    results: rnKeychain.UserCredentials[];
  }>;
}

type OptionalUnion<T1, T2> = {
  [P in keyof Omit<T1 & T2, keyof (T1 | T2)>]?: (T1 & T2)[P];
} &
  (T1 | T2);

type KebabToCamelCase<
  DashType
> = DashType extends `${infer First}-${infer Rest}`
  ? `${First}${KebabToCamelCase<Capitalize<Rest>>}`
  : DashType;

type KebabToCamelCaseKeys<T> = {
  [K in keyof T as K extends string ? KebabToCamelCase<K> : K]: T[K];
};

// TODO: add correct navigation types
type RoutesType = typeof Routes;
type RouteKeys = keyof RoutesType;

export type RouteNames = RoutesType[RouteKeys];

export type StackParamsList = Record<RouteNames, any>;

declare global {
  namespace ReactNavigation {
    type RootParamList = StackParamsList;
  }
}
