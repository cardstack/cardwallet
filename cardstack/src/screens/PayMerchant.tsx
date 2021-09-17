import React, { memo, useState, useEffect, useCallback } from 'react';
import { BlockNumber, TransactionReceipt } from 'web3-core';
import Web3 from 'web3';
import usePayment from '@cardstack/redux/hooks/usePayment';
import { usePaymentMerchantUniversalLink } from '@cardstack/hooks/merchant/usePaymentMerchantUniversalLink';
import MerchantSectionCard from '@cardstack/components/TransactionConfirmationSheet/displays/components/sections/MerchantSectionCard';
import {
  SafeAreaView,
  Container,
  InputAmount,
  SheetHandle,
  Text,
  Button,
  TransactionConfirmationSheet,
  Icon,
} from '@cardstack/components';
import { useMerchantInfoFromDID } from '@cardstack/hooks/merchant/useMerchantInfoFromDID';
import {
  MerchantInformation,
  PayMerchantDecodedData,
  PrepaidCardCustomization,
} from '@cardstack/types';
import {
  convertSpendForBalanceDisplay,
  localCurrencyToAbsNum,
  nativeCurrencyToSpend,
} from '@cardstack/utils';
import {
  useNativeCurrencyAndConversionRates,
  usePaymentCurrencyAndConversionRates,
} from '@rainbow-me/redux/hooks';
import { useNavigation } from '@rainbow-me/navigation';
import RainbowRoutes from '@rainbow-me/navigation/routesNames';
import { PrepaidCardTransactionHeader } from '@cardstack/components/Transactions/PrepaidCard/PrepaidCardTransactionHeader';
import { getWeb3ProviderSdk } from '@rainbow-me/handlers/web3';
import logger from 'logger';

const PayMerchant = () => {
  const {
    noPrepaidCard,
    goBack,
    onConfirm,
    isLoadingTx: onConfirmLoading,
    isLoading,
    data,
  } = usePaymentMerchantUniversalLink();

  return (
    <SafeAreaView flex={1} width="100%" backgroundColor="black">
      <PayMerchantBody
        noPrepaidCard={noPrepaidCard}
        onCancel={goBack}
        onConfirm={onConfirm}
        onConfirmLoading={onConfirmLoading}
        loading={isLoading}
        data={data}
      />
    </SafeAreaView>
  );
};

type PayMerchantBodyProps = {
  noPrepaidCard: boolean;
  onCancel: () => void;
  onConfirm: (
    spendAmount: number,
    onSuccess: (receipt: TransactionReceipt) => void
  ) => void;
  onConfirmLoading: boolean;
  loading: boolean;
  data: PayMerchantDecodedData;
};

const PayMerchantBody = memo(
  ({
    data,
    noPrepaidCard,
    onConfirm,
    onConfirmLoading,
    loading,
  }: PayMerchantBodyProps) => {
    const {
      infoDID = '',
      spendAmount: initialSpendAmount,
      currency,
      prepaidCardCustomization,
    } = data;

    const [accountCurrency] = useNativeCurrencyAndConversionRates();

    const { navigate } = useNavigation();

    const { merchantInfoDID } = useMerchantInfoFromDID(infoDID);
    const { paymentChangeCurrency } = usePayment();

    const [
      nativeCurrency,
      currencyConversionRates,
    ] = usePaymentCurrencyAndConversionRates();

    useEffect(() => {
      if (currency) {
        paymentChangeCurrency(currency);
      }
    }, [currency, paymentChangeCurrency]);

    const [isConfirmScreen, setConfirmScreen] = useState(false);

    const [inputValue, setInputValue] = useState<string | undefined>(
      `${initialSpendAmount ? initialSpendAmount.toLocaleString() : 0}`
    );

    const spendAmount =
      nativeCurrency === 'SPD'
        ? localCurrencyToAbsNum(`${inputValue || 0}`)
        : nativeCurrencyToSpend(
            inputValue,
            currencyConversionRates[nativeCurrency],
            true
          ).spendAmount;

    const onPayMerchantSuccess = useCallback(
      async (receipt: TransactionReceipt) => {
        const { nativeBalanceDisplay } = convertSpendForBalanceDisplay(
          inputValue ? localCurrencyToAbsNum(inputValue) : 0,
          accountCurrency,
          currencyConversionRates,
          true
        );

        const timestamp = await getBlockTimestamp(receipt.blockNumber);

        setConfirmScreen(false);

        navigate(
          RainbowRoutes.EXPANDED_ASSET_SHEET,
          mapNavigationParams({
            merchantInfo: merchantInfoDID,
            spendAmount,
            nativeBalanceDisplay,
            timestamp,
            transactionHash: receipt.transactionHash,
            prepaidCardAddress: receipt.from,
            prepaidCardCustomization,
          })
        );
      },
      [
        accountCurrency,
        currencyConversionRates,
        inputValue,
        merchantInfoDID,
        navigate,
        prepaidCardCustomization,
        spendAmount,
      ]
    );

    const onCustomConfirm = useCallback(() => {
      onConfirm(spendAmount, onPayMerchantSuccess);
    }, [onConfirm, onPayMerchantSuccess, spendAmount]);

    return isConfirmScreen && !noPrepaidCard ? (
      <TransactionConfirmationSheet
        loading={loading}
        onConfirmLoading={onConfirmLoading}
        data={{
          ...data,
          spendAmount,
          currency: nativeCurrency === 'SPD' ? currency : nativeCurrency,
        }}
        onCancel={() => setConfirmScreen(false)}
        onConfirm={onCustomConfirm}
      />
    ) : (
      <Container
        flex={1}
        alignItems="center"
        marginTop={4}
        borderTopRightRadius={20}
        borderTopLeftRadius={20}
        backgroundColor="white"
        paddingTop={3}
      >
        <SheetHandle />
        <CustomAmountBody
          merchantInfoDID={merchantInfoDID}
          onNextPress={() => setConfirmScreen(true)}
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={loading}
          nativeCurrency={nativeCurrency || 'SPD'}
        />
      </Container>
    );
  }
);

interface CustomAmountBodyProps {
  merchantInfoDID: MerchantInformation | undefined;
  onNextPress: () => void;
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  isLoading: boolean;
  nativeCurrency: string;
}

const CustomAmountBody = memo(
  ({
    merchantInfoDID,
    onNextPress,
    inputValue,
    setInputValue,
    isLoading,
    nativeCurrency,
  }: CustomAmountBodyProps) => {
    return (
      <Container flex={1} flexDirection="column" width="100%">
        <Container padding={5} paddingTop={3} flex={1}>
          <MerchantSectionCard
            merchantInfoDID={merchantInfoDID}
            flex={1}
            justifyContent="space-between"
            isLoading={isLoading}
          >
            <AmountInputSection
              inputValue={inputValue}
              setInputValue={setInputValue}
              nativeCurrency={nativeCurrency}
            />
          </MerchantSectionCard>
        </Container>
        <Container alignItems="center" flex={1}>
          <Button onPress={onNextPress}>
            <Text>Next</Text>
          </Button>
        </Container>
      </Container>
    );
  }
);

interface AmountInputSectionProps {
  inputValue: string | undefined;
  setInputValue: (_val: string | undefined) => void;
  nativeCurrency: string;
}

const AmountInputSection = memo(
  ({ inputValue, setInputValue, nativeCurrency }: AmountInputSectionProps) => {
    const [
      accountCurrency,
      currencyConversionRates,
    ] = useNativeCurrencyAndConversionRates();

    return (
      <Container alignItems="center" width="100%" justifyContent="center">
        <Text weight="bold" numberOfLines={1} fontSize={11}>
          SPEND (§1 = 0.01 USD)
        </Text>
        <InputAmount
          flexGrow={1}
          borderBottomWidth={1}
          borderBottomColor="borderBlue"
          paddingBottom={1}
          hasCurrencySymbol={false}
          nativeCurrency={nativeCurrency}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
        <Text marginTop={2} numberOfLines={1} fontSize={12} color="blueText">
          {nativeCurrency === 'SPD'
            ? convertSpendForBalanceDisplay(
                inputValue ? localCurrencyToAbsNum(inputValue) : 0,
                accountCurrency,
                currencyConversionRates,
                true
              ).nativeBalanceDisplay
            : nativeCurrencyToSpend(
                inputValue,
                currencyConversionRates[nativeCurrency],
                true
              ).tokenBalanceDisplay}
        </Text>
      </Container>
    );
  }
);

const getBlockTimestamp = async (blockNumber: BlockNumber) => {
  try {
    const web3 = new Web3(await getWeb3ProviderSdk());
    const block = await web3.eth.getBlock(blockNumber);
    return block?.timestamp.toString();
  } catch (error) {
    logger.log(error);
  }

  return Date.now().toString();
};

// Workaround to reuse tx confirmation, will revisit it
interface NavParams {
  merchantInfo?: MerchantInformation;
  spendAmount: number;
  nativeBalanceDisplay: string;
  timestamp: string;
  transactionHash: string;
  prepaidCardAddress: string;
  prepaidCardCustomization?: PrepaidCardCustomization;
}

const mapNavigationParams = ({
  merchantInfo,
  spendAmount,
  nativeBalanceDisplay,
  timestamp,
  transactionHash,
  prepaidCardAddress,
  prepaidCardCustomization,
}: NavParams) => ({
  asset: {
    index: 0,
    section: {
      data: [
        {
          merchantInfo,
          spendAmount,
          nativeBalanceDisplay,
          timestamp,
          transactionHash,
        },
      ],
    },
    Header: (
      <PrepaidCardTransactionHeader
        address={prepaidCardAddress}
        cardCustomization={prepaidCardCustomization}
      />
    ),
    CoinIcon: <Icon name="spend" />,
    statusIconName: 'arrow-up',
    statusText: 'Paid',
    primaryText: `- ${spendAmount}`,
    subText: nativeBalanceDisplay,
    transactionHash,
  },
  type: 'paymentConfirmationTransaction',
});

export default memo(PayMerchant);
