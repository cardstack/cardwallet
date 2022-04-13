import * as rnKeychain from 'react-native-keychain';

// @ts-ignore
declare let __DEV__: boolean;
declare let IS_DEV: boolean;
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
