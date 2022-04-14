import React from 'react';
import { StepOne, StepTwo, StepThree, ProfileFormContainer } from './';
import { ProgressSteps } from '@cardstack/components';

export const CreateProfile = ({ isLoading }: { isLoading: boolean }) => (
  <ProfileFormContainer>
    <ProgressSteps isLoading={isLoading}>
      <StepOne />
      <StepTwo keyboardEnabled />
      <StepThree />
    </ProgressSteps>
  </ProfileFormContainer>
);
