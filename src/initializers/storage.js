import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import Storage from 'react-native-storage';

const storage = new Storage({
  defaultExpires: null,
  enableCache: Platform.OS === 'ios',
  size: 10000,
  storageBackend: AsyncStorage,
});

global.storage = storage;

const isDev = typeof __DEV__ === 'boolean' && __DEV__;
process.env.NODE_ENV = isDev ? 'development' : 'production';
if (typeof localStorage !== 'undefined') {
  localStorage.debug = isDev ? '*' : '';
}
