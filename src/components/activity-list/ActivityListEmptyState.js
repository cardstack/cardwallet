import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components';

import { deviceUtils } from '../../utils';
import { Centered, Column } from '../layout';
import { Text } from '@cardstack/components';

const verticalOffset = (deviceUtils.dimensions.height - 420) / 3;

const Container = styled(Column)`
  align-self: center;
  margin-top: ${verticalOffset};
  width: 200;
`;

const ActivityListEmptyState = ({ children, label }) => {
  return (
    <View>
      {children}
      <Container>
        <Centered>
          <Text color="grayText">{label}</Text>
        </Centered>
      </Container>
    </View>
  );
};

ActivityListEmptyState.propTypes = {
  label: PropTypes.string,
};

ActivityListEmptyState.defaultProps = {
  label: 'No transactions yet',
};

export default ActivityListEmptyState;
