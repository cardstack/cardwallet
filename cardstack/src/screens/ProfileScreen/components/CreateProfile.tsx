import React from 'react';

import { ProgressSteps } from '@cardstack/components';

import { StepOne, StepTwo, StepThree, ProfileFormContainer } from './';

export const CreateProfile = ({ isLoading }: { isLoading: boolean }) => (
  <ProfileFormContainer>
    <ProgressSteps isLoading={isLoading}>
      <StepOne />
      <StepTwo keyboardEnabled />
      <StepThree />
    </ProgressSteps>
  </ProfileFormContainer>
);
