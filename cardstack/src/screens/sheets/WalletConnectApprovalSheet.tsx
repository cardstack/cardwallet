import { useRoute } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager } from 'react-native';
import { RouteType } from '@cardstack/navigation/types';
import { Alert } from '@rainbow-me/components/alerts';
import { RequestVendorLogoIcon } from '@rainbow-me/components/coin-icon';
import {
  Button,
  CenteredContainer,
  Container,
  Sheet,
  Text,
} from '@cardstack/components';
import {
  getDappHostname,
  isDappAuthenticated,
} from '@rainbow-me/helpers/dappNameHandler';
import { useNavigation } from '@rainbow-me/navigation';
import { ethereumUtils } from '@rainbow-me/utils';

interface Params {
  meta?: {
    dappName?: string;
    dappUrl?: string;
    imageUrl?: string;
  };
  callback: (success: boolean) => void;
}

const WalletConnectApprovalSheet = () => {
  const { goBack } = useNavigation();
  const { params } = useRoute<RouteType<Params>>();
  const [scam, setScam] = useState(false);
  const handled = useRef(false);
  const meta = params?.meta || {};
  const { dappName, dappUrl, imageUrl } = meta;
  const callback = params?.callback;

  const checkIfScam = useCallback(
    async dappUrlParam => {
      const isScam = await ethereumUtils.checkIfUrlIsAScam(dappUrlParam);

      if (isScam) {
        Alert({
          buttons: [
            {
              text: 'Proceed Anyway',
            },
            {
              onPress: () => setScam(true),
              style: 'cancel',
              text: 'Ignore this request',
            },
          ],
          message:
            'We found this website in a list of malicious crypto scams.\n\n We recommend you to ignore this request and stop using this website immediately',
          title: ' 🚨 Heads up! 🚨',
        });
      }
    },
    [setScam]
  );

  const isAuthenticated = useMemo(() => {
    return isDappAuthenticated(dappUrl);
  }, [dappUrl]);

  const formattedDappUrl = useMemo(() => {
    return getDappHostname(dappUrl);
  }, [dappUrl]);

  const handleSuccess = useCallback(
    (success = false) => {
      if (callback) {
        setTimeout(() => callback(success), 300);
      }
    },
    [callback]
  );

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      checkIfScam(dappUrl);
    });

    // Reject if the modal is dismissed
    return () => {
      if (!handled.current) {
        handleSuccess(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = useCallback(() => {
    handled.current = true;
    goBack();
    handleSuccess(true);
  }, [handleSuccess, goBack]);

  const handleCancel = useCallback(() => {
    handled.current = true;
    goBack();
    handleSuccess(false);
  }, [handleSuccess, goBack]);

  useEffect(() => {
    if (scam) {
      handleCancel();
    }
  }, [handleCancel, scam]);

  return (
    <Sheet hideHandle>
      <CenteredContainer
        paddingBottom={20}
        paddingHorizontal={19}
        paddingTop={5}
      >
        <RequestVendorLogoIcon
          dappName={dappName || ''}
          imageUrl={imageUrl}
          backgroundColor="transparent"
          shouldPrioritizeImageLoading
          showLargeShadow={false}
          borderRadius={18}
          size={60}
        />
        <Container justifyContent="center" marginBottom={5} marginTop={6}>
          <Text size="medium" textAlign="center" weight="bold">
            {dappName}
          </Text>
          <Text color="grayText" textAlign="center">
            wants to connect to your account
          </Text>
        </Container>
        <Container
          flexDirection="row"
          borderBottomColor="borderGray"
          borderBottomWidth={1}
        >
          <Text color="settingsTeal" lineHeight={29} weight="bold">
            {isAuthenticated ? `􀇻 ${formattedDappUrl}` : formattedDappUrl}
          </Text>
        </Container>
      </CenteredContainer>
      <Container flexDirection="row" justifyContent="space-evenly">
        <Button onPress={handleCancel} variant="smallSecondary">
          Cancel
        </Button>
        <Button onPress={handleConnect} variant="small">
          Connect
        </Button>
      </Container>
    </Sheet>
  );
};

export default React.memo(WalletConnectApprovalSheet);
