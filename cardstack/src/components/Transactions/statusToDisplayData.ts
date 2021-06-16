import { IconProps } from '@cardstack/components';
import { TransactionStatus } from '@cardstack/types';

interface TransactionCoinRowDisplayData {
  iconProps: IconProps;
  transactionSymbol: string;
}

const defaultIconProps: IconProps = {
  color: 'blueText',
  size: 10,
  name: 'circle',
};

const defaultData: TransactionCoinRowDisplayData = {
  iconProps: {
    ...defaultIconProps,
  },
  transactionSymbol: '',
};

const sendData: TransactionCoinRowDisplayData = {
  iconProps: {
    ...defaultIconProps,
    name: 'send',
    size: 17,
    top: 1,
  },
  transactionSymbol: '-',
};

const swapData: TransactionCoinRowDisplayData = {
  iconProps: {
    ...defaultIconProps,
    name: 'swap',
    size: 14,
  },
  transactionSymbol: '-',
};

const failed: TransactionCoinRowDisplayData = {
  iconProps: {
    ...defaultIconProps,
    color: 'red',
    name: 'circle',
    size: 14,
  },
  transactionSymbol: '',
};

const receivedData: TransactionCoinRowDisplayData = {
  iconProps: {
    ...defaultIconProps,
    name: 'arrow-down',
    size: 14,
  },
  transactionSymbol: '+',
};

const statusToDisplayData: {
  [key in TransactionStatus]: TransactionCoinRowDisplayData;
} = {
  [TransactionStatus.approved]: defaultData,
  [TransactionStatus.approving]: defaultData,
  [TransactionStatus.cancelled]: failed,
  [TransactionStatus.cancelling]: failed,
  [TransactionStatus.deposited]: sendData,
  [TransactionStatus.depositing]: sendData,
  [TransactionStatus.failed]: failed,
  [TransactionStatus.purchased]: sendData,
  [TransactionStatus.purchasing]: sendData,
  [TransactionStatus.received]: receivedData,
  [TransactionStatus.receiving]: receivedData,
  [TransactionStatus.self]: defaultData,
  [TransactionStatus.sending]: sendData,
  [TransactionStatus.sent]: sendData,
  [TransactionStatus.speeding_up]: defaultData,
  [TransactionStatus.swapped]: swapData,
  [TransactionStatus.swapping]: swapData,
  [TransactionStatus.unknown]: defaultData,
  [TransactionStatus.withdrawing]: sendData,
  [TransactionStatus.withdrew]: sendData,
};

export const getDisplayDataByStatus = (status: TransactionStatus) => {
  const data = statusToDisplayData[status];

  if (data) {
    return data;
  }

  return defaultData;
};
