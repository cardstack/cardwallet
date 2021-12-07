import React, { memo, useCallback } from 'react';
import { LayoutAnimation } from 'react-native';
import ButtonPressAnimation from '../../../../src/components/animations/ButtonPressAnimation';
import { Button, Icon } from '@cardstack/components';
import {
  PinnedHiddenSectionOption,
  usePinnedAndHiddenItemOptions,
} from '@rainbow-me/hooks';
import { showActionSheetWithOptions } from '@rainbow-me/utils';

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
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, 'easeInEaseOut', 'opacity')
    );

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
    <ButtonPressAnimation onPress={showActionSheet}>
      <Icon name="more-circle" />
    </ButtonPressAnimation>
  );
};

export default memo(PinnedHiddenSectionMenu);
