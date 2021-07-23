import React, { useState } from 'react';
import { LayoutAnimation, ActivityIndicator } from 'react-native';
import URL from 'url-parse';

import { CenteredContainer, ContainerProps } from '../Container';
import { Skeleton } from '../Skeleton';
import { ClaimRevenueDisplay } from './ClaimRevenueDisplay';
import { GenericDisplay } from './GenericDisplay';
import { IssuePrepaidCardDisplay } from './IssuePrepaidCardDisplay';
import { PayMerchantDisplay } from './PayMerchantDisplay';
import { RegisterMerchantDisplay } from './RegisterMerchantDisplay';
import { SplitPrepaidCardDisplay } from './SplitPrepaidCardDisplay';
import { TransferPrepaidCardDisplay } from './TransferPrepaidCardDisplay';
import { WithdrawalDisplay } from './WithdrawalDisplay';
import { HubAuthenticationDisplay } from './HubAuthenticationDisplay';
import {
  TransactionConfirmationData,
  TransactionConfirmationType,
} from '@cardstack/types';
import {
  Button,
  Container,
  HorizontalDivider,
  Icon,
  IconProps,
  ScrollView,
  Text,
  Touchable,
} from '@cardstack/components';

export interface TransactionConfirmationDisplayProps {
  dappUrl: string;
  message: any;
  onCancel: () => void;
  onConfirm: () => void;
  methodName: string | null;
  messageRequest: any;
  data: TransactionConfirmationData;
  loading: boolean;
}

export const TransactionConfirmationSheet = (
  props: TransactionConfirmationDisplayProps
) => {
  const [showHeaderShadow, setShowHeaderShadow] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  return (
    <Container
      flex={1}
      alignItems="center"
      backgroundColor="white"
      paddingTop={3}
      borderRadius={20}
    >
      <InformationIcon
        isOpen={showFullMessage}
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
          );

          setShowFullMessage(!showFullMessage);
        }}
      />
      <Header {...props} showHeaderShadow={showHeaderShadow} />
      <ScrollView
        onScroll={event => {
          if (event.nativeEvent.contentOffset.y > 16) {
            setShowHeaderShadow(true);
          } else {
            setShowHeaderShadow(false);
          }
        }}
        scrollEventThrottle={16}
        width="100%"
        paddingHorizontal={5}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {showFullMessage ? (
          <Container paddingHorizontal={3} marginTop={5}>
            <Text variant="subText">{props.messageRequest}</Text>
          </Container>
        ) : (
          <DisplayInformation {...props} />
        )}
      </ScrollView>
      {!showFullMessage && <SheetFooter {...props} />}
    </Container>
  );
};

const Header = ({
  dappUrl,
  methodName,
  showHeaderShadow,
  data,
  loading,
}: TransactionConfirmationDisplayProps & { showHeaderShadow: boolean }) => {
  const { hostname } = new URL(dappUrl);

  const typeToHeaderText: {
    [key in TransactionConfirmationType]: string;
  } = {
    [TransactionConfirmationType.GENERIC]: methodName || '',
    [TransactionConfirmationType.HUB_AUTH]: 'Authenticate Account',
    [TransactionConfirmationType.ISSUE_PREPAID_CARD]: 'Issue Prepaid Card',
    [TransactionConfirmationType.WITHDRAWAL]: 'Withdraw Funds',
    [TransactionConfirmationType.REGISTER_MERCHANT]: 'Create Merchant',
    [TransactionConfirmationType.PAY_MERCHANT]: 'Pay with Prepaid Card',
    [TransactionConfirmationType.CLAIM_REVENUE]: 'Claim Funds',
    [TransactionConfirmationType.SPLIT_PREPAID_CARD]: 'Split Prepaid Card',
    [TransactionConfirmationType.TRANSFER_PREPAID_CARD_1]:
      'Transfer Prepaid Card - Step 1/2',
    [TransactionConfirmationType.TRANSFER_PREPAID_CARD_2]:
      'Transfer Prepaid Card - Step 2/2',
  };

  const shadowProps: ContainerProps = showHeaderShadow
    ? {
        shadowColor: 'black',
        shadowOffset: {
          height: 5,
          width: 0,
        },
        shadowRadius: 2,
        shadowOpacity: 0.1,
      }
    : {};

  if (loading) {
    return null;
  }

  return (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      paddingBottom={2}
      borderRadius={20}
      {...shadowProps}
    >
      <Text marginTop={4} weight="extraBold">
        {typeToHeaderText[data.type]}
      </Text>
      <Text variant="subText" weight="bold">
        {hostname}
      </Text>
    </Container>
  );
};

const DisplayInformation = (props: TransactionConfirmationDisplayProps) => {
  if (props.loading) {
    return (
      <CenteredContainer width="100%" height={475}>
        <ActivityIndicator size="large" />
      </CenteredContainer>
    );
  }

  if (props.data.type === TransactionConfirmationType.HUB_AUTH) {
    return <HubAuthenticationDisplay />;
  } else if (
    props.data.type === TransactionConfirmationType.ISSUE_PREPAID_CARD
  ) {
    return <IssuePrepaidCardDisplay {...props} data={props.data} />;
  } else if (
    props.data.type === TransactionConfirmationType.REGISTER_MERCHANT
  ) {
    return <RegisterMerchantDisplay {...props} data={props.data} />;
  } else if (props.data.type === TransactionConfirmationType.PAY_MERCHANT) {
    return <PayMerchantDisplay {...props} data={props.data} />;
  } else if (props.data.type === TransactionConfirmationType.WITHDRAWAL) {
    return <WithdrawalDisplay {...props} data={props.data} />;
  } else if (props.data.type === TransactionConfirmationType.CLAIM_REVENUE) {
    return <ClaimRevenueDisplay {...props} data={props.data} />;
  } else if (
    props.data.type === TransactionConfirmationType.SPLIT_PREPAID_CARD
  ) {
    return <SplitPrepaidCardDisplay {...props} data={props.data} />;
  } else if (
    props.data.type === TransactionConfirmationType.TRANSFER_PREPAID_CARD_1 ||
    props.data.type === TransactionConfirmationType.TRANSFER_PREPAID_CARD_2
  ) {
    return <TransferPrepaidCardDisplay {...props} data={props.data} />;
  }

  return <GenericDisplay {...props} />;
};

const SheetFooter = ({
  onConfirm,
  onCancel,
}: TransactionConfirmationDisplayProps) => {
  return (
    <Container
      width="100%"
      bottom={0}
      paddingBottom={5}
      borderBottomLeftRadius={20}
      borderBottomRightRadius={20}
      position="absolute"
      backgroundColor="white"
    >
      <HorizontalDivider height={2} marginBottom={4} marginVertical={0} />
      <Container
        paddingHorizontal={5}
        flexDirection="row"
        justifyContent="space-between"
      >
        <Button variant="smallWhite" onPress={onCancel}>
          Cancel
        </Button>
        <Button
          variant="small"
          onPress={onConfirm}
          iconProps={{ name: 'face-id' }}
        >
          Confirm
        </Button>
      </Container>
    </Container>
  );
};

const InformationIcon = ({
  isOpen,
  onPress,
}: {
  isOpen: boolean;
  onPress: () => void;
}) => {
  const iconProps: IconProps = isOpen
    ? {
        name: 'info',
        iconSize: 'medium',
        color: 'tealDark',
      }
    : {
        name: 'info-border',
        iconSize: 'medium',
        stroke: 'tealDark',
      };

  return (
    <Touchable
      position="absolute"
      top={16}
      right={16}
      zIndex={10}
      onPress={onPress}
    >
      <Icon {...iconProps} />
    </Touchable>
  );
};
