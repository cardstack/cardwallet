import { pick } from 'lodash';
import React, { Fragment, useCallback, useRef, useState } from 'react';
import ActionSheet from 'react-native-actionsheet';
import { ButtonPressAnimation } from '../animations';
import { Icon } from '@cardstack/components';

const ActionSheetProps = [
  'cancelButtonIndex',
  'destructiveButtonIndex',
  'message',
  'onPress',
  'options',
  'tintColor',
  'title',
];

export default function ContextMenu({
  activeOpacity = 0.2,
  cancelButtonIndex,
  children,
  dynamicOptions,
  onPressActionSheet,
  iconProps,
  options = [],
  ...props
}) {
  const actionsheetRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  const handlePressActionSheet = useCallback(
    buttonIndex => {
      if (onPressActionSheet) {
        onPressActionSheet(buttonIndex);
      }

      setIsOpen(false);
    },
    [onPressActionSheet]
  );

  const handleShowActionSheet = useCallback(() => {
    setTimeout(() => {
      if (isOpen) return;
      setIsOpen(true);
      actionsheetRef.current?.show();
    }, 40);
  }, [isOpen]);

  return (
    <>
      {onPressActionSheet && (
        <ButtonPressAnimation
          activeOpacity={activeOpacity}
          onPress={handleShowActionSheet}
        >
          {children || <Icon margin={2} name="more-circle" {...iconProps} />}
        </ButtonPressAnimation>
      )}
      <ActionSheet
        {...pick(props, ActionSheetProps)}
        cancelButtonIndex={
          Number.isInteger(cancelButtonIndex)
            ? cancelButtonIndex
            : options.length - 1
        }
        onPress={handlePressActionSheet}
        options={dynamicOptions ? dynamicOptions() : options}
        ref={actionsheetRef}
      />
    </>
  );
}
