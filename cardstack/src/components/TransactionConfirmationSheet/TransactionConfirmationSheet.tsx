import React, { useState } from 'react';
import { LayoutAnimation } from 'react-native';
import URL from 'url-parse';
import { ContainerProps } from '../Container';
import { IssuePrepaidCardDisplay } from './IssuePrepaidCardDisplay';
import { GenericDisplay } from './GenericDisplay';
import { TransactionConfirmationType } from '@cardstack/types';
import {
  Button,
  Container,
  HorizontalDivider,
  SheetHandle,
  Text,
  ScrollView,
  Icon,
  Touchable,
  IconProps,
} from '@cardstack/components';
import { IssuePrepaidCardDecodedData } from '@cardstack/services';

export interface TransactionConfirmationSheetProps {
  dappUrl: string;
  message: any;
  onCancel: () => void;
  onConfirm: () => void;
  methodName: string | null;
  messageRequest: any;
  decodedData: IssuePrepaidCardDecodedData | null;
  type: TransactionConfirmationType;
}

const transactionConfirmationTypeToComponent: {
  [key in TransactionConfirmationType]: React.FC<TransactionConfirmationSheetProps>;
} = {
  [TransactionConfirmationType.ISSUE_PREPAID_CARD]: IssuePrepaidCardDisplay,
  [TransactionConfirmationType.DEFAULT]: GenericDisplay,
};

export const TransactionConfirmationSheet = (
  props: TransactionConfirmationSheetProps
) => {
  const DisplayInformation = transactionConfirmationTypeToComponent[props.type];
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
      <SheetHandle />
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
}: TransactionConfirmationSheetProps & { showHeaderShadow: boolean }) => {
  const { hostname } = new URL(dappUrl);

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
      {...shadowProps}
    >
      <Text marginTop={4} weight="extraBold">
        {methodName || 'Placeholder'}
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
}: TransactionConfirmationSheetProps) => {
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
