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
import { Text } from '../.';
import { RadioListItem, RadioListItemProps } from './RadioListItem';

const RadioList = ({ items, onPress }: RadioListProps) => {
  // const [selected, setSelected] = useState(value);

  const renderItem = ({ item }) => {
    return <RadioListItem {...item} onPress={onPress} />;
  };

  return (
    <SectionList
      extraData={items}
      keyExtractor={(network, index) => network + index}
      renderItem={renderItem}
      renderSectionHeader={({ section: { title } }) => (
        <Text>Layer {title}</Text>
      )}
      sections={items}
    />
  );
};

export interface RadioListProps {
  /** textValue */
  items: Array<RadioItemProps>;
  onPress: () => void;
}

export interface RadioItemProps {
  title: string;
  data: RadioListItemProps;
}

export default RadioList;
