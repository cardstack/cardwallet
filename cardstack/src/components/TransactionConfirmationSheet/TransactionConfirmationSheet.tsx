import React, { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import URL from 'url-parse';

import { ContainerProps } from '../Container';
import {
  DisplayInformation,
  transactionTypeMap,
} from './displays/DisplayInformation';
import { TransactionConfirmationData } from '@cardstack/types';
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
  dappUrl?: string;
  message?: any; // seems it's only used on issuePrepaidCard, check need
  methodName?: string;
  messageRequest?: any;
  data: TransactionConfirmationData;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmLoading?: boolean;
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
      {!!props?.messageRequest && (
        <InformationIcon
          isOpen={showFullMessage}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
            );

            setShowFullMessage(!showFullMessage);
          }}
        />
      )}
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
  methodName = '',
  showHeaderShadow,
  data,
  loading,
}: TransactionConfirmationDisplayProps & { showHeaderShadow: boolean }) => {
  if (loading) {
    return null;
  }

  const { hostname } = new URL(dappUrl || '');

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
  onConfirmLoading = false,
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
          loading={onConfirmLoading}
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
