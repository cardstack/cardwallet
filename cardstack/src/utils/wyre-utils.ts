import { subtract, formatCurrencyAmount } from '@cardstack/cardpay-sdk';
import { PaymentRequest } from '@rainbow-me/react-native-payments';
import { captureException } from '@sentry/react-native';
import axios from 'axios';
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

import { isMainnet } from '@cardstack/utils/cardpay-utils';

import { Network } from '@rainbow-me/helpers/networkTypes';
import { WYRE_SUPPORTED_COUNTRIES_ISO } from '@rainbow-me/references/wyre';
import logger from 'logger';

const PAYMENT_PROCESSOR_COUNTRY_CODE = 'US';

const getSecretKey = (network: Network) =>
  isMainnet(network) ? WYRE_SECRET_KEY : WYRE_SECRET_KEY_TEST;

const getApiKey = (network: Network) =>
  isMainnet(network) ? WYRE_API_KEY : WYRE_API_KEY_TEST;

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

const getBaseUrl = (network: Network) =>
  isMainnet(network) ? WYRE_ENDPOINT : WYRE_ENDPOINT_TEST;

const wyreApi = axios.create({
  headers: {
    Accept: 'application/json',
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
    referenceInfo: { referenceId: string },
    errorId: string,
    errorCode: string,
    message: string
  ) {
    const referenceInfoIds = values(referenceInfo);
    const referenceId = join(referenceInfoIds, ':');
    super(`${referenceId}:${errorId}:${errorCode}:${message}`);
    this.name = name;
  }
}

export const showApplePayRequest = async (
  referenceInfo: { referenceId: string },
  sourceAmountWithFees: number,
  purchaseFee: string,
  sourceAmount: string,
  network: Network,
  sourceCurrency: string
) => {
  const feeAmount = subtract(sourceAmountWithFees, sourceAmount);

  const networkFee = formatCurrencyAmount(subtract(feeAmount, purchaseFee));
  const fixedSourceAmount = formatCurrencyAmount(sourceAmount);

  const merchantIdentifier = isMainnet(network)
    ? MERCHANT_ID
    : MERCHANT_ID_TEST;

  const methodData = [
    // TODO: keep track of supported countries
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
    fixedSourceAmount,
    networkFee,
    purchaseFee,
    sourceAmountWithFees,
    sourceCurrency
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
    return await paymentRequest.show();
  } catch (error) {
    logger.sentry(
      `Apple Pay - Show payment request catch - ${referenceInfo.referenceId}`
    );

    captureException(error);

    return null;
  }
};

export const getWalletOrderQuotation = async (
  amount: string,
  destCurrency: string,
  accountAddress: string,
  network: Network,
  sourceCurrency: string
) => {
  const partnerId = isMainnet(network) ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;

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
  amount: string,
  destCurrency: string,
  depositAddress: string,
  network: Network,
  paymentMethod = null,
  sourceCurrency: string
) => {
  const partnerId = isMainnet(network) ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;

  const dest = `ethereum:${depositAddress}`;

  const data = {
    amount,
    dest,
    destCurrency,
    referrerAccountId: partnerId,
    sourceCurrency,
    paymentMethod,
  };

  if (paymentMethod) {
    data.paymentMethod = paymentMethod;
  }

  const baseUrl = getBaseUrl(network);

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

export const getOrderId = async (
  referenceInfo: { referenceId: string },
  paymentResponse: any,
  amount: string,
  depositAddress: string,
  destCurrency: string,
  network: Network,
  reservationId: string,
  sourceCurrency: string
) => {
  const ip = await publicIP();

  const data = createPayload(
    referenceInfo,
    paymentResponse,
    amount,
    depositAddress,
    destCurrency,
    network,
    reservationId,
    ip,
    sourceCurrency
  );

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
  sourceAmount: string,
  networkFee: string,
  purchaseFee: string,
  totalAmount: number,
  sourceCurrency: string
) => {
  const items = [
    {
      amount: { currency: sourceCurrency, value: sourceAmount },
      label: 'Prepaid Card',
    },
    {
      amount: { currency: sourceCurrency, value: purchaseFee },
      label: 'Wyre Fee',
    },
  ];

  const itemsWithNetwork = [
    ...items,
    {
      amount: { currency: sourceCurrency, value: networkFee },
      label: 'Network Fee',
    },
  ];

  return {
    displayItems: parseFloat(networkFee) > 0 ? itemsWithNetwork : items,
    id: 'cardwallet-wyre',
    total: {
      amount: { currency: sourceCurrency, value: totalAmount },
      label: 'Cardstack',
    },
  };
};

interface Payment extends RainbowPayments.PaymentResponse {
  details: RainbowPayments.PaymentResponse['details'] &
    RainbowPayments.PaymentDetailsIOS;
}

const createPayload = (
  referenceInfo: any,
  paymentResponse: Payment,
  amount: string,
  accountAddress: string,
  destCurrency: string,
  network: Network,
  reservationId: string,
  ip: string,
  sourceCurrency: string
) => {
  const dest = `ethereum:${accountAddress}`;

  const {
    details: {
      billingContact,
      paymentData,
      paymentMethod,
      shippingContact: shippingInfo,
      transactionIdentifier,
    },
  } = paymentResponse;

  const updatedBillingContact = getAddressDetails(billingContact);

  const shippingContact = {
    ...updatedBillingContact,
    emailAddress: shippingInfo?.emailAddress,
    phoneNumber: shippingInfo?.phoneNumber,
  };

  const partnerId = isMainnet(network) ? WYRE_ACCOUNT_ID : WYRE_ACCOUNT_ID_TEST;

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
        billingContact: updatedBillingContact,
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

const getAddressDetails = (billing?: RainbowPayments.BillingContactIOS) => {
  if (!billing) return;

  const { name, postalAddress: address } = billing;
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

interface CreateOrderParams {
  amount: string;
  depositAddress: string;
  sourceCurrency: string;
  destCurrency: string;
  network: Network;
}

export const createWyreOrderWithApplePay = async (
  params: CreateOrderParams
) => {
  try {
    const {
      amount,
      depositAddress,
      sourceCurrency,
      destCurrency,
      network,
    } = params;

    const reserveOrder = reserveWyreOrder(
      amount,
      destCurrency,
      depositAddress,
      network,
      null,
      sourceCurrency
    );

    const getQuotation = getWalletOrderQuotation(
      amount,
      destCurrency,
      depositAddress,
      network,
      sourceCurrency
    );

    const [{ reservation: reservationId }, quotation] = await Promise.all([
      reserveOrder,
      getQuotation,
    ]);

    if (!reservationId || !quotation) {
      logger.sentry('No quotation or reservationId', {
        reservationId,
        quotation,
      });

      return;
    }

    const { sourceAmountWithFees, purchaseFee } = quotation;

    const referenceInfo = { referenceId: toLower(depositAddress) };

    const applePayResponse = await showApplePayRequest(
      referenceInfo,
      sourceAmountWithFees,
      purchaseFee,
      amount,
      network,
      sourceCurrency
    );

    if (!applePayResponse) {
      logger.sentry('No applePay response');

      return;
    }

    const { orderId } = await getOrderId(
      referenceInfo,
      applePayResponse,
      sourceAmountWithFees,
      depositAddress,
      destCurrency,
      network,
      reservationId,
      sourceCurrency
    );

    logger.sentry('orderId', orderId);

    applePayResponse.complete(orderId ? 'success' : 'fail');

    return orderId;
  } catch (error) {
    logger.sentry('CreateWyreOrderWithApplePay failed', {
      error,
      params,
    });
  }
};
