import PropTypes from 'prop-types';
import React from 'react';

import { RowWithMargins } from '../layout';
import { Icon, Text } from '@cardstack/components';

const ListItemArrowGroup = ({ children }) => (
  <RowWithMargins align="center" flex={1} justify="end" margin={7}>
    {typeof children === 'string' ? (
      <Text color="settingsGrayDark">{children}</Text>
    ) : (
      children
    )}
    <Icon color="settingsGrayChevron" iconSize="medium" name="chevron-right" />
  </RowWithMargins>
);

ListItemArrowGroup.propTypes = {
  children: PropTypes.node,
};

export default React.memo(ListItemArrowGroup);
