import React, { useEffect, useState, useMemo } from 'react';
import { Container, Icon } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

interface StepIndicatorProps {
  activeStep?: number;
  children: React.ReactElement[];
}

export interface StepActionType {
  setActiveStep?: (step: number) => void;
  currentStep?: number;
}

enum StepStatus {
  DEFAULT,
  COMPLETED,
  ACTIVE,
}

const ProgressStepSizes = {
  width: 136,
  circleWidth: 16,
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
}: StepIndicatorProps) => {
  const [currentStep, setCurrentStep] = useState<number>(activeStep);
  const stepCount = useMemo(() => React.Children.count(children), [children]);

  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep]);

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

        return (
          <>
            <Container
              width={ProgressStepSizes.circleWidth}
              height={ProgressStepSizes.circleWidth}
              borderRadius={ProgressStepSizes.circleWidth / 2}
              justifyContent="center"
              alignItems="center"
              {...StepIconStyles[stepStatus]}
            >
              {stepStatus === StepStatus.COMPLETED ? (
                <Icon
                  color="black"
                  iconSize="small"
                  name="check"
                  strokeWidth={2}
                />
              ) : null}
            </Container>
            {!isLastStep ? (
              <Container
                position="absolute"
                top={ProgressStepSizes.circleWidth / 2}
                left={
                  (ProgressStepSizes.circleWidth +
                    ProgressStepSizes.circleDistance +
                    4) *
                    index +
                  ProgressStepSizes.circleWidth +
                  2
                }
                borderTopWidth={1}
                borderTopColor="borderLightColor"
                width={ProgressStepSizes.circleDistance}
              />
            ) : null}
          </>
        );
      });

  const setActiveStep = (step: number) => {
    if (step >= stepCount - 1) {
      setCurrentStep(stepCount - 1);
    }

    if (step > -1 && step < stepCount - 1) {
      setCurrentStep(step);
    }
  };

  return (
    <Container style={{ flex: 1 }}>
      <Container
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="center"
        flexDirection="row"
        width={ProgressStepSizes.width}
      >
        {renderStepIcons()}
      </Container>
      {children[currentStep]
        ? React.cloneElement(children[currentStep], {
            setActiveStep,
            currentStep,
          })
        : null}
    </Container>
  );
};
