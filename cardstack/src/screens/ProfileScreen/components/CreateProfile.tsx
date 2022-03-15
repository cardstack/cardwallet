import React from 'react';
import { StepOne, StepTwo, StepThree, ProfileFormContainer } from './';
import { ProgressSteps } from '@cardstack/components';

export const CreateProfile = () => (
  <ProfileFormContainer>
    <ProgressSteps>
      <StepOne />
      <StepTwo keyboardEnabled />
      <StepThree />
    </ProgressSteps>
  </ProfileFormContainer>
);
