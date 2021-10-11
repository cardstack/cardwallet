import { subtract } from '@cardstack/cardpay-sdk';
import { PaymentRequest } from '@rainbow-me/react-native-payments';
import { captureException } from '@sentry/react-native';
import axios from 'axios';
import BigNumber from 'bignumber.js';
import cryptoJS from 'crypto-js';
import { get, join, split, toLower, values } from 'lodash';
import {
  MERCHANT_ID,
  MERCHANT_ID_TEST,
  WYRE_ACCOUNT_ID,
  WYRE_ACCOUNT_ID_TEST,
  WYRE_API_KEY,
  WYRE_API_KEY_TEST,
  WYRE_ENDPOINT,
  WYRE_ENDPOINT_TEST,
  WYRE_SECRET_KEY,
  WYRE_SECRET_KEY_TEST,
} from 'react-native-dotenv';
import publicIP from 'react-native-public-ip';
import NetworkTypes, { Network } from '../helpers/networkTypes';
import { WYRE_SUPPORTED_COUNTRIES_ISO } from '../references/wyre';
import logger from 'logger';

const SOURCE_CURRENCY_USD = 'USD';
const PAYMENT_PROCESSOR_COUNTRY_CODE = 'US';

const getSecretKey = (network: Network) =>
  network === NetworkTypes.mainnet ? WYRE_SECRET_KEY : WYRE_SECRET_KEY_TEST;

const getApiKey = (network: Network) =>
  network === NetworkTypes.mainnet ? WYRE_API_KEY : WYRE_API_KEY_TEST;

const getAuthHeaders = (network: Network, url: string, data: string) => {
  const secret = getSecretKey(network);
  const dataToBeSigned = url + data;
  const signature = cryptoJS.enc.Hex.stringify(
    cryptoJS.HmacSHA256(dataToBeSigned, secret)
  );

  return {
    'X-Api-Key': getApiKey(network),
    'X-Api-Signature': signature,
  };
};

export const PaymentRequestStatusTypes = {
  FAIL: 'fail',
  SUCCESS: 'success',
};

const getBaseUrl = (network: Network) =>
  network === NetworkTypes.mainnet ? WYRE_ENDPOINT : WYRE_ENDPOINT_TEST;

const wyreApi = axios.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secs
});

const WyreExceptionTypes = {
  CREATE_ORDER: 'WyreCreateOrderException',
};

class WyreException extends Error {
  constructor(
    name: string,
    referenceInfo: any,
    errorId: any,
    errorCode: any,
    message: any
  ) {
    const referenceInfoIds = values(referenceInfo);
    const referenceId = join(referenceInfoIds, ':');
    super(`${referenceId}:${errorId}:${errorCode}:${message}`);
    this.name = name;
  }
}

export const getReferenceId = (accountAddress: string | undefined) => {
  const lowered = toLower(accountAddress);
  return lowered.substr(-12);
};

export const showApplePayRequest = async (
  referenceInfo: { referenceId: any },
  accountAddress: any,
  destCurrency: any,
  sourceAmountWithFees: BigNumber.Value,
  purchaseFee: BigNumber.Value,
  sourceAmount: BigNumber.Value,
  network: Network,
  sourceCurrency = SOURCE_CURRENCY_USD
) => {
  const feeAmount = subtract(sourceAmountWithFees, sourceAmount);
  const networkFee = subtract(feeAmount, purchaseFee);

  const merchantIdentifier =
    network === NetworkTypes.mainnet ? MERCHANT_ID : MERCHANT_ID_TEST;

  const methodData = [
    {
      data: {
        countryCode: PAYMENT_PROCESSOR_COUNTRY_CODE,
        currencyCode: sourceCurrency,
        merchantIdentifier,
        supportedCountries: WYRE_SUPPORTED_COUNTRIES_ISO,
        supportedNetworks: ['visa', 'mastercard', 'discover'],
      },
      supportedMethods: ['apple-pay'],
    },
  ];

  const paymentDetails = getWyrePaymentDetails(
    sourceAmount,
    destCurrency,
    networkFee,
    purchaseFee,
    sourceAmountWithFees
  );

  const paymentOptions = {
    requestBilling: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
  };

  const paymentRequest = new PaymentRequest(
    methodData,
    paymentDetails,
    paymentOptions
  );

  logger.sentry(
    `Apple Pay - Show payment request - ${referenceInfo.referenceId}`
  );

  try {
    const paymentResponse = await paymentRequest.show();
    return paymentResponse;
  } catch (error) {
    logger.sentry(
      `Apple Pay - Show payment request catch - ${referenceInfo.referenceId}`
    );
    captureException(error);
    return null;
  }
};

export const getWalletOrderQuotation = async (
  amount,
  destCurrency,
  accountAddress,
  network,
  sourceCurrency = SOURCE_CURRENCY_USD
) => {
  const partnerId =
    network === NetworkTypes.mainnet ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;
  const dest = `ethereum:${accountAddress}`;
  const data = {
    accountId: partnerId,
    amount,
    country: PAYMENT_PROCESSOR_COUNTRY_CODE,
    dest,
    destCurrency,
    sourceCurrency,
    walletType: 'APPLE_PAY',
  };

  const baseUrl = getBaseUrl(network);
  try {
    const timestamp = Date.now();
    const url = `${baseUrl}/v3/orders/quote/partner?timestamp=${timestamp}`;
    const config = {
      headers: getAuthHeaders(network, url, JSON.stringify(data)),
    };
    const response = await wyreApi.post(url, data, config);
    const responseData = response?.data;
    const purchaseFee = responseData?.fees[sourceCurrency];
    return {
      purchaseFee,
      sourceAmountWithFees: responseData?.sourceAmount,
    };
  } catch (error) {
    logger.sentry('Apple Pay - error getting wallet order quotation', error);
    return null;
  }
};

export const reserveWyreOrder = async (
  amount,
  destCurrency,
  accountAddress,
  network,
  paymentMethod = null,
  sourceCurrency = SOURCE_CURRENCY_USD
) => {
  const partnerId =
    network === NetworkTypes.mainnet ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;
  const dest = `ethereum:${accountAddress}`;
  const data = {
    amount,
    dest,
    destCurrency,
    referrerAccountId: partnerId,
    sourceCurrency: sourceCurrency,
  };
  if (paymentMethod) {
    data.paymentMethod = paymentMethod;
  }
  const baseUrl = getBaseUrl(network);

  console.log('BASEURL: ', baseUrl);

  try {
    const timestamp = Date.now();
    const url = `${baseUrl}/v3/orders/reserve?timestamp=${timestamp}`;
    const config = {
      headers: getAuthHeaders(network, url, JSON.stringify(data)),
    };
    const response = await wyreApi.post(url, data, config);
    return response?.data;
  } catch (error) {
    logger.sentry(
      'Apple Pay - error reserving order',
      error,
      error.response.data.message
    );
    return null;
  }
};

export const trackWyreOrder = async (referenceInfo, orderId, network) => {
  try {
    const baseUrl = getBaseUrl(network);
    const response = await wyreApi.get(`${baseUrl}/v3/orders/${orderId}`);
    const orderStatus = get(response, 'data.status');
    const transferId = get(response, 'data.transferId');
    return { data: response.data, orderStatus, transferId };
  } catch (error) {
    throw error;
  }
};

export const trackWyreTransfer = async (
  referenceInfo,
  transferId,
  network: Network
) => {
  try {
    const baseUrl = getBaseUrl(network);
    const response = await wyreApi.get(
      `${baseUrl}/v2/transfer/${transferId}/track`
    );
    const transferHash = get(response, 'data.blockchainNetworkTx');
    const destAmount = get(response, 'data.destAmount');
    const destCurrency = get(response, 'data.destCurrency');
    return { destAmount, destCurrency, transferHash };
  } catch (error) {
    throw error;
  }
};

export const getOrderId = async (
  referenceInfo,
  paymentResponse,
  amount,
  accountAddress,
  destCurrency,
  network,
  reservationId
) => {
  const ip = await publicIP();
  const data = createPayload(
    referenceInfo,
    paymentResponse,
    amount,
    accountAddress,
    destCurrency,
    network,
    reservationId,
    ip
  );

  console.log('PROCESS DATA', JSON.stringify(paymentResponse));

  try {
    const baseUrl = getBaseUrl(network);
    const response = await wyreApi.post(
      `${baseUrl}/v3/apple-pay/process/partner`,
      data,
      {
        validateStatus: function (status) {
          // do not throw error so we can get
          // exception ID and message from response
          return status >= 200;
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const orderId = get(response, 'data.id', null);
      return { orderId };
    }
    logger.sentry('WYRE - getOrderId response - was not 200', response.data);
    const {
      data: { errorCode, exceptionId, message, type },
    } = response;
    console.log('ERROR DATA', errorCode, exceptionId, message, type);
    captureException(
      new WyreException(
        WyreExceptionTypes.CREATE_ORDER,
        referenceInfo,
        exceptionId,
        errorCode,
        message
      )
    );
    return {
      errorCategory: type,
      errorCode,
      errorMessage: message,
    };
  } catch (error) {
    logger.sentry(
      `WYRE - getOrderId response catch - ${referenceInfo.referenceId}`
    );
    captureException(error);
    return {};
  }
};

const getWyrePaymentDetails = (
  sourceAmount: any,
  destCurrency: any,
  networkFee: any,
  purchaseFee: any,
  totalAmount: BigNumber.Value,
  sourceCurrency: string = SOURCE_CURRENCY_USD
) => ({
  displayItems: [
    {
      amount: { currency: sourceCurrency, value: sourceAmount },
      label: destCurrency,
    },
    {
      amount: { currency: sourceCurrency, value: purchaseFee },
      label: 'Purchase Fee',
    },
    {
      amount: { currency: sourceCurrency, value: networkFee },
      label: 'Network Fee',
    },
  ],
  id: 'cardwallet-wyre',
  total: {
    amount: { currency: sourceCurrency, value: totalAmount },
    label: 'Cardstack',
  },
});

const createPayload = (
  referenceInfo,
  paymentResponse,
  amount,
  accountAddress,
  destCurrency,
  network,
  reservationId,
  ip,
  sourceCurrency = SOURCE_CURRENCY_USD
) => {
  const dest = `ethereum:${accountAddress}`;

  const {
    details: {
      billingContact: billingInfo,
      paymentData,
      paymentMethod,
      shippingContact: shippingInfo,
      transactionIdentifier,
    },
  } = paymentResponse;

  console.log('PAYMENT RESPONSE', paymentResponse);

  const billingContact = getAddressDetails(billingInfo);
  const shippingContact = {
    ...billingContact,
    emailAddress: shippingInfo.emailAddress,
    phoneNumber: shippingInfo.phoneNumber,
  };

  const partnerId =
    network === NetworkTypes.mainnet ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;
  return {
    partnerId,
    payload: {
      orderRequest: {
        amount,
        dest,
        destCurrency,
        referenceId: referenceInfo.referenceId,
        referrerAccountId: partnerId,
        reservationId,
        sourceCurrency,
        ipAddress: ip,
      },
      paymentObject: {
        billingContact,
        shippingContact,
        token: {
          paymentData,
          paymentMethod: {
            ...paymentMethod,
            type: 'debit',
          },
          transactionIdentifier,
        },
      },
    },
  };
};

const getAddressDetails = addressInfo => {
  const { name, postalAddress: address } = addressInfo;
  const addressLines = split(address.street, '\n');
  return {
    addressLines,
    administrativeArea: address.state,
    country: address.country,
    countryCode: address.ISOCountryCode,
    familyName: name.familyName,
    givenName: name.givenName,
    locality: address.city,
    postalCode: address.postalCode,
    subAdministrativeArea: address.subAdministrativeArea,
    subLocality: address.subLocality,
  };
};
