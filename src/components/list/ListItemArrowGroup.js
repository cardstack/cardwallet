import PropTypes from 'prop-types';
import React from 'react';

import { RowWithMargins } from '../layout';
import { Icon, Text } from '@cardstack/components';

const ListItemArrowGroup = ({ children }) => {
  const { colors } = useTheme();
  return (
    <RowWithMargins align="center" flex={1} justify="end" margin={7}>
      {typeof children === 'string' ? (
        <Text color="settingsGrayDark">{children}</Text>
      ) : (
        children
      )}
      <Icon color="settingsGrayChevron" name="chevron-right" size={32} />
    </RowWithMargins>
  );
};

ListItemArrowGroup.propTypes = {
  children: PropTypes.node,
};

export default React.memo(ListItemArrowGroup);
