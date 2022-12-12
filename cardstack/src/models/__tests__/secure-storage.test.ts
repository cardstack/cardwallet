import * as SecureStore from 'expo-secure-store';

import { NetworkType } from '@cardstack/types';

import logger from 'logger';

import {
  deletePin,
  getPin,
  savePin,
  saveHubToken,
  getHubToken,
  deleteHubToken,
} from '../secure-storage';

const mockKey = `mock-key`;
const mockPin = '123456';
const pinKey = `${mockKey}_AUTH_PIN`;

const mockHubToken = '$TOKEN';
const mockNetwork = NetworkType.sokol;
const mockAccountAddress = '0xAddress';
const mockTimestamp = 1466424490000;

const hubKey = `${mockKey}_HUB_TOKEN`;
const mockBuiltHubKey = `${hubKey}_${mockAccountAddress}_${mockNetwork}`;

const localSecureStorage: any = {};

describe('secure-storage', () => {
  let mockSetItemAsync: jest.SpyInstance<Promise<void>>;
  let mockGetItemAsync: jest.SpyInstance<Promise<string | null>>;
  let mockDeleteItemAsync: jest.SpyInstance<Promise<void>>;

  beforeAll(() => {
    logger.sentry = jest.fn();
  });

  beforeEach(() => {
    mockSetItemAsync = jest
      .spyOn(SecureStore, 'setItemAsync')
      .mockImplementation(
        (key: string, pin: string): Promise<void> => {
          localSecureStorage[key] = pin;

          return Promise.resolve();
        }
      );

    mockGetItemAsync = jest
      .spyOn(SecureStore, 'getItemAsync')
      .mockImplementation(
        (key: string): Promise<string | null> => {
          const storedValue = localSecureStorage[key];

          if (storedValue) return Promise.resolve(storedValue);

          return Promise.reject(new Error('Invalid key'));
        }
      );

    mockDeleteItemAsync = jest
      .spyOn(SecureStore, 'deleteItemAsync')
      .mockImplementation(
        (key: string): Promise<void> => {
          delete localSecureStorage[key];

          return Promise.resolve();
        }
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Pin storage', () => {
    it('should save pin', async () => {
      await savePin(mockPin);

      expect(mockSetItemAsync).toBeCalledWith(pinKey, mockPin);
    });

    it('should return stored pin', async () => {
      const storedPin = await getPin();

      expect(mockGetItemAsync).toBeCalledWith(pinKey, undefined);
      expect(storedPin).toEqual(mockPin);
    });

    it('should delete stored pin', async () => {
      await deletePin();

      expect(mockDeleteItemAsync).toBeCalledWith(pinKey);
      expect(localSecureStorage[pinKey]).toBeUndefined();
    });

    it('should error if no pin is found', async () => {
      const storedPin = await getPin();

      expect(mockGetItemAsync).toBeCalledWith(pinKey, undefined);
      expect(storedPin).toBeNull();
      expect(logger.sentry).toBeCalledWith(
        'No value for key: AUTH_PIN',
        new Error('Invalid key')
      );
    });
  });

  describe('Hub token storage', () => {
    it('should save hub token', async () => {
      jest.spyOn<any, any>(global, 'Date').mockImplementation(() => ({
        getTime: () => mockTimestamp,
      }));

      await saveHubToken(mockHubToken, mockAccountAddress, mockNetwork);

      expect(mockSetItemAsync).toBeCalledWith(
        mockBuiltHubKey,
        JSON.stringify({ token: mockHubToken, timestamp: mockTimestamp })
      );
    });

    it('should get hub token', async () => {
      const hubToken = await getHubToken(mockAccountAddress, mockNetwork);

      expect(hubToken).toBe(mockHubToken);
    });

    it('shoould delete stored hub token', async () => {
      await deleteHubToken(mockAccountAddress, mockNetwork);

      expect(mockDeleteItemAsync).toBeCalledWith(mockBuiltHubKey);
      expect(localSecureStorage[mockBuiltHubKey]).toBeUndefined();
    });
  });
});
