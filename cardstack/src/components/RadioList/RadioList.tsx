import React, { useState } from 'react';
import { SectionList } from 'react-native';
import { IconProps, Text, Container } from '../.';
import { RadioListItem } from './RadioListItem';

export const RadioList = ({ items, onChange }: RadioListProps) => {
  const [selected, setSelected] = useState<number>(() => {
    const value = items.filter((item: any) => {
      return item.data.find((i: any) => i.selected === true);
    });

    return value[0].data.find(i => i.selected)?.key || 0;
  });

  const handleChange = ({ value, index }: { value: string; index: number }) => {
    if (index !== selected) {
      setSelected(index);
    }

    if (onChange) {
      onChange(value);
    }
  };

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
          <Text color="blueText">{`Layer ${title}`.toUpperCase()}</Text>
        </Container>
      )}
      sections={items}
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

interface RadioItemData {
  iconProps?: IconProps;
  label: string;
  key: number;
  value: string;
  disabled: boolean;
  default: boolean;
  selected: boolean;
}
