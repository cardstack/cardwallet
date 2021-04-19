import { ENABLE_PAYMENTS } from 'react-native-dotenv';

export const usePaymentsEnabled = () => {
  return ENABLE_PAYMENTS === 'true';
};
