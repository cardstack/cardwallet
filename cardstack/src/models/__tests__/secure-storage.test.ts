import * as SecureStore from 'expo-secure-store';

import logger from 'logger';

import { deletePin, getPin, savePin } from '../secure-storage';

const mockKey = `mock-key`;
const mockPin = '123456';
const pinKey = `${mockKey}_AUTH_PIN`;

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
    jest.resetAllMocks();
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

    it('delete stored pin', async () => {
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
});
