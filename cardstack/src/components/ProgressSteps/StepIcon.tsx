import React from 'react';
import { Icon, Touchable } from '@cardstack/components';
import { ColorTypes } from '@cardstack/theme';

export enum StepStatus {
  DEFAULT,
  COMPLETED,
  ACTIVE,
}

export const ProgressStepSizes = {
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

interface StepIconType {
  stepStatus: StepStatus;
  onPress: () => void;
}

export const StepIcon = ({ stepStatus, onPress }: StepIconType) => {
  const isCompletedStep = stepStatus === StepStatus.COMPLETED;

  return (
    <Touchable
      width={ProgressStepSizes.circleSize}
      height={ProgressStepSizes.circleSize}
      borderRadius={ProgressStepSizes.circleSize / 2}
      justifyContent="center"
      alignItems="center"
      {...StepIconStyles[stepStatus]}
      disabled={!isCompletedStep}
      onPress={onPress}
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
  );
};
