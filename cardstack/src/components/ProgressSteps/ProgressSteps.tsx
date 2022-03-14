import React, { useState, useMemo, useCallback } from 'react';
import { CustomScrollView } from '.';
import { Container, Icon, Touchable } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

export interface ProgressStepsProps {
  activeStep?: number;
  children: React.ReactElement[];
}

export interface ProgressStepProps {
  goToNextStep?: () => void;
  keyboardEnabled?: boolean;
}

enum StepStatus {
  DEFAULT,
  COMPLETED,
  ACTIVE,
}

const ProgressStepSizes = {
  width: 136,
  circleSize: 16,
  circleBorderWidth: 5,
  circleDistance: 40,
};

const StepIconStyles = {
  [StepStatus.DEFAULT]: {
    backgroundColor: 'underlineGray' as ColorTypes,
  },
  [StepStatus.COMPLETED]: {
    backgroundColor: 'teal' as ColorTypes,
  },
  [StepStatus.ACTIVE]: {
    backgroundColor: 'transparent' as ColorTypes,
    borderColor: 'teal' as ColorTypes,
    borderWidth: ProgressStepSizes.circleBorderWidth,
  },
};

export const ProgressSteps = ({
  activeStep = 0,
  children,
}: ProgressStepsProps) => {
  const [currentStep, setCurrentStep] = useState<number>(activeStep);
  const stepCount = useMemo(() => React.Children.count(children), [children]);

  const setActiveStep = useCallback(
    (step: number) => {
      if (step >= stepCount - 1) {
        setCurrentStep(stepCount - 1);
      } else if (step > -1 && step < stepCount - 1) {
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

        const isCompletedStep = stepStatus === StepStatus.COMPLETED;

        const currentStepRightSideDashLeftPosition =
          (ProgressStepSizes.circleSize +
            ProgressStepSizes.circleDistance +
            4) *
            index +
          ProgressStepSizes.circleSize +
          2;

        return (
          <>
            <Touchable
              width={ProgressStepSizes.circleSize}
              height={ProgressStepSizes.circleSize}
              borderRadius={ProgressStepSizes.circleSize / 2}
              justifyContent="center"
              alignItems="center"
              {...StepIconStyles[stepStatus]}
              disabled={!isCompletedStep}
              onPress={onPressStepIcon(index)}
            >
              {isCompletedStep ? (
                <Icon
                  color="black"
                  iconSize="small"
                  name="check"
                  strokeWidth={2}
                  height={14}
                />
              ) : null}
            </Touchable>
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
          <CustomScrollView
            keyboardEnabled={!!ActiveStepComponent?.props?.keyboardEnabled}
          >
            {React.cloneElement(ActiveStepComponent, {
              goToNextStep,
            })}
          </CustomScrollView>
        ) : null}
      </Container>
    </Container>
  );
};
