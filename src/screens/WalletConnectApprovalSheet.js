import { useRoute } from '@react-navigation/native';
import analytics from '@segment/analytics-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionManager } from 'react-native';
import styled from 'styled-components';
import Divider from '../components/Divider';
import { Alert } from '../components/alerts';
import { RequestVendorLogoIcon } from '../components/coin-icon';
import { Centered, Row } from '../components/layout';
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

const DappLogo = styled(RequestVendorLogoIcon).attrs(
  ({ theme: { colors } }) => ({
    backgroundColor: colors.transparent,
    borderRadius: 18,
    showLargeShadow: false,
    size: 60,
  })
)`
  margin-bottom: 24;
`;

export default function WalletConnectApprovalSheet() {
  const { colors } = useTheme();
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const [scam, setScam] = useState(false);
  const handled = useRef(false);
  const meta = params?.meta || {};
  const { dappName, dappUrl, imageUrl } = meta;
  const callback = params?.callback;

  const checkIfScam = useCallback(
    async dappUrl => {
      const isScam = await ethereumUtils.checkIfUrlIsAScam(dappUrl);
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
      analytics.track('Shown Walletconnect session request');
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
        <DappLogo dappName={dappName || ''} imageUrl={imageUrl} />
        <Container justifyContent="center" marginBottom={5}>
          <Text size="medium" textAlign="center" weight="bold">
            {dappName}
          </Text>
          <Text color="grayText" textAlign="center">
            wants to connect to your wallet
          </Text>
        </Container>
        <Container flexDirection="row">
          <Text color="settingsGray" lineHeight={29} weight="bold">
            {isAuthenticated ? `􀇻 ${formattedDappUrl}` : formattedDappUrl}
          </Text>
        </Container>
        <Divider color={colors.rowDividerLight} inset={[0, 84]} />
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
}
