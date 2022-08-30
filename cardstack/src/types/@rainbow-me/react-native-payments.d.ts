declare module '@rainbow-me/react-native-payments' {
  declare class PaymentRequest {
    constructor(
      methodData: RainbowPayments.PaymentMethodData[] = [],
      details?: RainbowPayments.PaymentDetailsInit = [],
      options?: RainbowPayments.PaymentOptions = {}
    );

    show(): Promise<RainbowPayments.PaymentResponse>;
  }
}

declare namespace RainbowPayments {
  export interface PaymentMethodData {
    supportedMethods: string[];
    data: {
      countryCode: string;
      currencyCode: string;
      merchantIdentifier: string;
      supportedCountries: string[];
      supportedNetworks: string[];
    };
  }

  // https://www.w3.org/TR/payment-request/#dom-paymentcurrencyamount
  export interface PaymentCurrencyAmount {
    currency: string;
    value: number | string;
  }

  // https://www.w3.org/TR/payment-request/#paymentdetailsbase-dictionary
  export interface PaymentDetailsBase {
    displayItems: PaymentItem[];
    shippingOptions?: PaymentShippingOption[];
    modifiers?: PaymentDetailsModifier[];
  }

  // https://www.w3.org/TR/payment-request/#paymentdetailsinit-dictionary
  export interface PaymentDetailsInit extends PaymentDetailsBase {
    displayItems: {
      amount: { currency: string; value: any };
      label: string;
    }[];
    id?: string;
    total: PaymentItem;
  }

  // https://www.w3.org/TR/payment-request/#paymentdetailsupdate-dictionary
  export interface PaymentDetailsUpdate extends PaymentDetailsBase {
    error: string;
    total: PaymentItem;
  }

  // https://www.w3.org/TR/payment-request/#paymentdetailsmodifier-dictionary
  export interface PaymentDetailsModifier {
    supportedMethods: string[];
    total: PaymentItem;
    additionalDisplayItems: PaymentItem[];
    data: Record<string, 'unknown'>;
  }

  // https://www.w3.org/TR/payment-request/#paymentshippinginterface-enum
  export type PaymentShippinginterface = 'shipping' | 'delivery' | 'pickup';

  // https://www.w3.org/TR/payment-request/#paymentoptions-dictionary
  export interface PaymentOptions {
    requestPayerName?: boolean;
    requestPayerEmail?: boolean;
    requestPayerPhone?: boolean;
    requestShipping?: boolean;
    requestBilling?: boolean;
    shippinginterface?: PaymentShippinginterface;
  }

  // https://www.w3.org/TR/payment-request/#paymentitem-dictionary
  export interface PaymentItem {
    label: string;
    amount: PaymentCurrencyAmount;
    pending?: boolean;
  }

  // https://www.w3.org/TR/payment-request/#paymentaddress-interface
  export interface PaymentAddress {
    recipient: null | string;
    organization: null | string;
    addressLine: null | string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
    phone: null | string;
    languageCode: null | string;
    sortingCode: null | string;
    dependentLocality: null | string;
  }

  // https://www.w3.org/TR/payment-request/#paymentshippingoption-dictionary
  export interface PaymentShippingOption {
    id: string;
    label: string;
    amount: PaymentCurrencyAmount;
    selected: boolean;
  }

  // https://www.w3.org/TR/payment-request/#paymentcomplete-enum
  export type PaymentComplete = 'fail' | 'success' | 'unknown';

  export interface BillingContactIOS {
    name: {
      familyName: string;
      givenName: string;
    };
    postalAddress: {
      state: string;
      country: string;
      ISOCountryCode: string;
      city: string;
      postalCode: string;
      subAdministrativeArea: string;
      subLocality: string;
      street: string;
    };
  }

  export interface PaymentDetailsIOS {
    paymentData: Record<string, 'unknown'>;
    billingContact?: BillingContactIOS;
    shippingContact?: Record<string, 'unknown'>;
    paymentToken?: string;
    transactionIdentifier: string;
    paymentMethod: Record<string, 'unknown'>;
  }

  export interface PaymentResponse {
    requestId: string;
    methodName: string;
    details: PaymentDetailsInit;
    shippingAddress: null | PaymentAddress;
    shippingOption: null | string;
    payerName: null | string;
    payerPhone: null | string;
    payerEmail: null | string;
    completeCalled: boolean;
    complete: (status: PaymentComplete) => Promise;
  }
}
