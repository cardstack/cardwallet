import React from 'react';
import {
  StepOne,
  StepTwo,
  StepThree,
  ProgressSteps,
  strings,
} from './components';
import { Container, MainHeader, MerchantContent } from '@cardstack/components';
import usePrimarySafe from '@cardstack/redux/hooks/usePrimarySafe';

const ProfileScreen = () => {
  const { primarySafe, isFetching, safesCount } = usePrimarySafe();

  const CreateProfile = () => (
    <Container flex={1} paddingTop={7}>
      <ProgressSteps>
        <StepOne />
        <StepTwo />
        <StepThree />
      </ProgressSteps>
    </Container>
  );

  return (
    <Container
      backgroundColor={primarySafe ? 'white' : 'backgroundDarkPurple'}
      flex={1}
    >
      <MainHeader title={strings.title} />
      <Container justifyContent="center" flexGrow={1}>
        {primarySafe ? (
          <MerchantContent
            showSafePrimarySelection={safesCount > 1}
            isPrimarySafe={true}
            merchantSafe={primarySafe}
            isRefreshingBalances={isFetching}
          />
        ) : (
          <CreateProfile />
        )}
      </Container>
    </Container>
  );
};

export default ProfileScreen;
