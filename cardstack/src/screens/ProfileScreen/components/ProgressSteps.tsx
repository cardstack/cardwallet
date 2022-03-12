import React, { useState, useMemo, useCallback } from 'react';
import { Container, Icon, Touchable } from '@cardstack/components';
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

        return (
          <>
            <Touchable
              width={ProgressStepSizes.circleWidth}
              height={ProgressStepSizes.circleWidth}
              borderRadius={ProgressStepSizes.circleWidth / 2}
              justifyContent="center"
              alignItems="center"
              {...StepIconStyles[stepStatus]}
              disabled={stepStatus !== StepStatus.COMPLETED}
              onPress={onPressStepIcon(index)}
            >
              {stepStatus === StepStatus.COMPLETED ? (
                <Icon
                  color="black"
                  iconSize="small"
                  name="check"
                  strokeWidth={2}
                  height={14}
                />
              ) : null}
            </Touchable>
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

  return (
    <Container style={{ flex: 1 }} paddingTop={7}>
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
      <Container flexGrow={1} paddingTop={8} paddingBottom={6}>
        {children[currentStep]
          ? React.cloneElement(children[currentStep], {
              setActiveStep,
              currentStep,
            })
          : null}
      </Container>
    </Container>
  );
};
