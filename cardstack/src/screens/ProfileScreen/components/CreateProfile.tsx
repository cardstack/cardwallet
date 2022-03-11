import React from 'react';
import {
  StepOne,
  StepTwo,
  StepThree,
  ProfileFormContainer,
  ProgressSteps,
} from './';

export const CreateProfile = () => (
  <ProfileFormContainer>
    <ProgressSteps>
      <StepOne />
      <StepTwo />
      <StepThree />
    </ProgressSteps>
  </ProfileFormContainer>
);
