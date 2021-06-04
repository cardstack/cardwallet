import React, { useCallback, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import { IconProps, Text, Container } from '../.';
import { RadioListItem } from './RadioListItem';

export const RadioList = ({ items: sections, onChange }: RadioListProps) => {
  const selectedItem = useCallback(() => {
    const findItemByType = (arr: Array<RadioItemProps>, type: string) => {
      return arr
        .map((section: RadioItemProps) => {
          const radioItem = section.data.filter(
            (item: RadioItemData) => item[type as keyof RadioItemData] === true
          );

          return radioItem;
        })
        .reduce((acc, val) => acc.concat(val), []);
    };

    const selectedItems = findItemByType(sections, 'selected')[0];

    const defaultItem = findItemByType(sections, 'default')[0];

    return {
      index: selectedItems?.key || defaultItem?.key,
      value: selectedItems?.value || defaultItem?.value,
    };
  }, [sections]);

  const [selected, setSelected] = useState<number>(selectedItem()?.index);

  const handleChange = ({
    value,
    index,
  }: {
    value?: string;
    index: number;
  }) => {
    if (index !== selected) {
      setSelected(index);
    }

    if (onChange) {
      onChange(value);
    }
  };

  useEffect(() => {
    const { value, index } = selectedItem();
    handleChange({ value, index });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const renderItem = ({ item }: { item: RadioItemData }) => {
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
      renderSectionHeader={({ section: { title } }) => (
        <Container
          backgroundColor="backgroundGray"
          paddingVertical={2}
          paddingHorizontal={5}
        >
          <Text color="blueText">{`${title}`.toUpperCase()}</Text>
        </Container>
      )}
      sections={sections}
    />
  );
};

export interface RadioListProps {
  items: Array<RadioItemProps>;
  onChange: (value: any) => void;
  defaultValue?: number;
}

export interface RadioItemProps {
  title: string | number;
  data: Array<RadioItemData>;
}

export interface RadioItemData {
  iconProps?: IconProps;
  label: string;
  key: number;
  value: string;
  disabled: boolean;
  default: boolean;
  selected: boolean;
}
