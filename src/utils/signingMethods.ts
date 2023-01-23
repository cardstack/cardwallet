export const SEND_TRANSACTION = 'eth_sendTransaction';
export const SIGN = 'eth_sign';

const PERSONAL_SIGN = 'personal_sign';
const SIGN_TRANSACTION = 'eth_signTransaction';
const SIGN_TYPED_DATA = [
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
];

const displayTypes = {
  message: [PERSONAL_SIGN, SIGN, ...SIGN_TYPED_DATA],
  transaction: [SEND_TRANSACTION, SIGN_TRANSACTION],
};

const isMethodIn = (options: string[], method: string) =>
  options.includes(method);

export const isSigningMethod = (method: string) => {
  const allTypes = [...displayTypes.message, ...displayTypes.transaction];

  return isMethodIn(allTypes, method);
};

export const isMessageDisplayType = (method: string) =>
  isMethodIn(displayTypes.message, method);

export const isTransactionDisplayType = (method: string) =>
  isMethodIn(displayTypes.transaction, method);

export const isSignSecondParamType = (method: string) => {
  const secondParamSigning = [SIGN];

  return isMethodIn(secondParamSigning, method);
};

export const isSignFirstParamType = (method: string) => {
  const firstParamSigning = [PERSONAL_SIGN];

  return isMethodIn(firstParamSigning, method);
};

export const isSignTypedData = (method: string) =>
  isMethodIn(SIGN_TYPED_DATA, method);
