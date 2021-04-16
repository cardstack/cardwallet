// import { PropTypes } from 'prop-types';
// import React, { createElement, PureComponent } from 'react';
// import { List } from '../list';

// export default class RadioList extends PureComponent {
//   static propTypes = {
//     items: PropTypes.arrayOf(
//       PropTypes.shape({
//         value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
//           .isRequired,
//       })
//     ),
//     onChange: PropTypes.func,
//     renderItem: PropTypes.func,
//     value: PropTypes.string,
//   };

//   static defaultProps = {
//     renderItem: RadioListItem,
//   };

//   state = { selected: this.props.value };

//   handleChange = selected => {
//     this.setState({ selected }, () => {
//       if (this.props.onChange) {
//         this.props.onChange(selected);
//       }
//     });
//   };

//   renderItem = ({ item }) =>
//     createElement(this.props.renderItem, {
//       ...item,
//       onPress: this.handleChange,
//       selected: item.forceSelected || item.value === this.state.selected,
//     });

//   render = () => <List {...this.props} renderItem={this.renderItem} />;
// }

import React, { useState } from 'react';
import { SectionList } from 'react-native';
import { IconProps, Text, Container } from '../.';
import { RadioListItem, RadioListItemProps } from './RadioListItem';

export const RadioList = ({
  items,
  onChange,
  defaultValue,
}: RadioListProps) => {
  const [selected, setSelected] = useState<number>(defaultValue || 0);

  const handleChange = ({ value, index }: { value: string; index: number }) => {
    if (index !== selected) {
      console.log('Value has changed');
      setSelected(index);
    }

    if (onChange) {
      onChange(value);
    }
  };

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
  data: Array<{
    iconProps?: IconProps;
    label: string;
    key: number;
    value: string;
    disabled: boolean;
  }>;
}
