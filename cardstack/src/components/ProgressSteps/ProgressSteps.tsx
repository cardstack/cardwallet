import React, { useState, useMemo, useCallback } from 'react';

import { Container } from '@cardstack/components';

import {
  ScrollableStepWrapper,
  StepIcon,
  ProgressStepSizes,
  StepStatus,
} from '.';

export interface ProgressStepsProps {
  activeStep?: number;
  children: React.ReactElement[];
  isLoading?: boolean;
}

export interface ProgressStepProps {
  goToNextStep?: () => void;
  keyboardEnabled?: boolean;
  isLoading?: boolean;
}

export const ProgressSteps = ({
  activeStep = 0,
  isLoading,
  children,
}: ProgressStepsProps) => {
  const [currentStep, setCurrentStep] = useState<number>(activeStep);
  const stepCount = useMemo(() => React.Children.count(children), [children]);

  const setActiveStep = useCallback(
    (step: number) => {
      const lastStep = stepCount - 1;

      if (step >= lastStep) {
        setCurrentStep(lastStep);
      } else if (step >= 0) {
        setCurrentStep(step);
      }
    },
    [stepCount]
  );

  const goToNextStep = useCallback(() => setActiveStep(currentStep + 1), [
    currentStep,
    setActiveStep,
  ]);

  const onPressStepIcon = useCallback(
    (step: number) => () => setActiveStep(step),
    [setActiveStep]
  );

  const renderStepIcons = () =>
    Array(stepCount)
      .fill(null)
      .map((_, index: number) => {
        let stepStatus = StepStatus.DEFAULT;
        const isLastStep = index === stepCount - 1;

        if (index < currentStep) {
          stepStatus = StepStatus.COMPLETED;
        } else if (index === currentStep) {
          stepStatus = StepStatus.ACTIVE;
        }

        const currentStepRightSideDashLeftPosition =
          (ProgressStepSizes.circleSize +
            ProgressStepSizes.circleDistance +
            4) *
            index +
          ProgressStepSizes.circleSize +
          2;

        return (
          <>
            <StepIcon
              stepStatus={stepStatus}
              onPress={onPressStepIcon(index)}
            />
            {/* draw right side dashes except last step */}
            {!isLastStep ? (
              <Container
                position="absolute"
                top={ProgressStepSizes.circleSize / 2}
                left={currentStepRightSideDashLeftPosition}
                borderTopWidth={1}
                borderTopColor="borderLightColor"
                width={ProgressStepSizes.circleDistance}
              />
            ) : null}
          </>
        );
      });

  const ActiveStepComponent = useMemo(() => children[currentStep], [
    children,
    currentStep,
  ]);

  return (
    <Container flex={1} paddingTop={7}>
      <Container
        position="relative"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="center"
        width={ProgressStepSizes.width}
      >
        {renderStepIcons()}
      </Container>
      <Container flexGrow={1} paddingTop={4}>
        {ActiveStepComponent ? (
          <ScrollableStepWrapper
            keyboardEnabled={!!ActiveStepComponent?.props?.keyboardEnabled}
          >
            {React.cloneElement(ActiveStepComponent, {
              goToNextStep,
              isLoading,
            })}
          </ScrollableStepWrapper>
        ) : null}
      </Container>
    </Container>
  );
};
