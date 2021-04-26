import React, { useCallback, useEffect, useState } from 'react';
import { SectionList } from 'react-native';
import { IconProps, Text, Container } from '../.';
import { RadioListItem } from './RadioListItem';

export const RadioList = ({ items: sections, onChange }: RadioListProps) => {
  const selectedNetwork = useCallback(() => {
    const selectedItem = sections
      .find((section: any) => {
        return section.data.some((network: any) => network.selected);
      })
      ?.data.find(network => network.selected);

    const defaultItem = sections
      .find((section: any) => {
        return section.data.some((network: any) => network.default);
      })
      ?.data.find(network => network.default);

    return {
      index: selectedItem?.key || defaultItem?.key || sections[0].data[0].key,
      value:
        selectedItem?.value || defaultItem?.value || sections[0].data[0].value,
    };
  }, [sections]);

  const [selected, setSelected] = useState<number>(selectedNetwork()?.index);

  const handleChange = ({
    value,
    index,
  }: {
    value?: string;
    index: number;
  }) => {
    console.log({ index, selected, value });

    if (index !== selected) {
      setSelected(index);
    }

    if (onChange) {
      onChange(value);
    }
  };

  useEffect(() => {
    const { value, index } = selectedNetwork();
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
