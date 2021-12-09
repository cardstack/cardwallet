import { dataAddNewTransaction } from '../redux/data';
import { walletConnectSendStatus } from '../redux/walletconnect';
import { removeRequest } from '@cardstack/redux/requests';

export default function useTransactionConfirmation() {
  return {
    dataAddNewTransaction,
    removeRequest,
    walletConnectSendStatus,
  };
}
