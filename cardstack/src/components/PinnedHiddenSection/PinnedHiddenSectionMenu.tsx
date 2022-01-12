import React, { memo, useCallback } from 'react';
import { Button, Icon, AnimatedPressable } from '@cardstack/components';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';
import { layoutEasingAnimation } from '@cardstack/utils';

const actionSheetOptions = {
  Edit: { idx: 0 },
  Cancel: { idx: 1 },
};

const PinnedHiddenSectionMenu = ({
  type,
}: {
  type?: PinnedHiddenSectionOption;
}) => {
  const { editing: editingSection, toggle } = usePinnedAndHiddenItemOptions();

  const toggleEditingPinnedHidden = useCallback(() => {
    layoutEasingAnimation();

    type && toggle(type);
  }, [toggle, type]);

  const showActionSheet = useCallback(() => {
    const { Edit, Cancel } = actionSheetOptions;

    showActionSheetWithOptions(
      {
        options: Object.keys(actionSheetOptions),
        cancelButtonIndex: Cancel.idx,
      },
      (buttonIndex: number) => {
        if (buttonIndex === Edit.idx) {
          toggleEditingPinnedHidden();
        }
      }
    );
  }, [toggleEditingPinnedHidden]);

  const isEditing = type === editingSection;

  if (isEditing) {
    return (
      <Button variant="tiny" onPress={toggleEditingPinnedHidden}>
        DONE
      </Button>
    );
  }

  return (
    <AnimatedPressable onPress={showActionSheet}>
      <Icon name="more-circle" />
    </AnimatedPressable>
  );
};

export default memo(PinnedHiddenSectionMenu);
