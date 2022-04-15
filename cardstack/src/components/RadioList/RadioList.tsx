import React, { useCallback, useEffect, useState } from 'react';
import { SectionList } from 'react-native';

import { Text, Container } from '../.';

import { RadioListItem, RadioListItemProps } from './RadioListItem';

export const RadioList = ({ items: sections, onChange }: RadioListProps) => {
  const setSelectedItem = useCallback(() => {
    const findItemByType = (arr: Array<RadioItemProps>, type: string) => {
      return arr
        .map((section: RadioItemProps) => {
          const radioItem = section.data.filter(
            (item: RadioListItemProps) =>
              item[type as keyof RadioListItemProps] === true
          );

          return radioItem;
        })
        .reduce((acc, val) => acc.concat(val), []);
    };

    const selectedItem = findItemByType(sections, 'selected')[0];

    return {
      index: selectedItem?.key,
      value: selectedItem?.value,
    };
  }, [sections]);

  const [selected, setSelected] = useState<number>(setSelectedItem()?.index);

  const handleChange = useCallback(
    ({ value, index }: { value?: string; index: number }) => {
      if (index !== selected) {
        setSelected(index);
      }

      if (onChange) {
        onChange(value);
      }
    },
    [onChange, selected]
  );

  useEffect(() => {
    const { value, index } = setSelectedItem();
    handleChange({ value, index });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const renderItem = ({ item }: { item: RadioListItemProps }) => {
    return (
      <RadioListItem
        {...item}
        onPress={handleChange}
        selected={item.key === selected}
        index={item.key}
      />
    );
  };

  return (
    <SectionList
      keyExtractor={(item, index) => {
        return item.value + '-' + index + '-' + item.key;
      }}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({ section: { title } }) =>
        title ? (
          <Container
            backgroundColor="backgroundGray"
            paddingVertical={2}
            paddingHorizontal={5}
          >
            <Text color="blueText">{`${title}`.toUpperCase()}</Text>
          </Container>
        ) : null
      }
      sections={sections}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export interface RadioListProps {
  items: Array<RadioItemProps>;
  onChange: (value: any) => void;
  defaultValue?: number;
}

export interface RadioItemProps {
  title?: string | number;
  data: Array<RadioListItemProps>;
}
