import React, { useCallback, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import URL from 'url-parse';

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
import { TransactionConfirmationData } from '@cardstack/types';
import { layoutEasingAnimation } from '@cardstack/utils';

import {
  DisplayInformation,
  transactionTypeMap,
} from './displays/DisplayInformation';
import { strings } from './strings';

export interface TransactionConfirmationDisplayProps {
  dappUrl?: string;
  message?: any; // seems it's only used on issuePrepaidCard, check need
  methodName?: string;
  messageRequest?: any;
  data: TransactionConfirmationData;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmLoading?: boolean;
  disabledConfirmButton?: boolean;
  txNetwork: string;
}

export const TransactionConfirmationSheet = (
  props: TransactionConfirmationDisplayProps
) => {
  const [showHeaderDivider, setShowHeaderDivider] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const onScroll = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setShowHeaderDivider(contentOffset.y > 16);
    },
    []
  );

  const onInfoPress = useCallback(() => {
    layoutEasingAnimation();

    setShowFullMessage(!showFullMessage);
  }, [showFullMessage]);

  return (
    <Container
      flex={1}
      alignItems="center"
      backgroundColor="white"
      paddingTop={3}
      borderRadius={20}
    >
      {!!props?.messageRequest && (
        <InformationIcon isOpen={showFullMessage} onPress={onInfoPress} />
      )}
      <Header {...props} showDivider={showHeaderDivider} />
      <ScrollView
        onScroll={onScroll}
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
  methodName = '',
  showDivider,
  data,
  loading,
}: TransactionConfirmationDisplayProps & { showDivider: boolean }) => {
  if (loading) {
    return null;
  }

  const { hostname } = new URL(dappUrl || '');

  return (
    <Container
      alignItems="center"
      backgroundColor="white"
      width="100%"
      paddingBottom={2}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      borderBottomWidth={2}
      borderBottomColor={showDivider ? 'borderGray' : 'white'}
    >
      <Text marginTop={4} weight="extraBold">
        {transactionTypeMap[data.type]?.title || methodName}
      </Text>
      <Text variant="subText" weight="bold">
        {hostname}
      </Text>
    </Container>
  );
};

const SheetFooter = ({
  onConfirm,
  onCancel,
  loading,
  onConfirmLoading = false,
  disabledConfirmButton,
}: TransactionConfirmationDisplayProps) => (
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
        {strings.buttons.cancel}
      </Button>
      <Button
        loading={onConfirmLoading}
        variant="small"
        onPress={onConfirm}
        disabled={disabledConfirmButton || loading}
      >
        {strings.buttons.submit}
      </Button>
    </Container>
  </Container>
);

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
