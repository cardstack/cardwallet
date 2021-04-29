import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { deviceUtils } from '../../utils';
import { Centered, Column } from '../layout';
import { Container, Text } from '@cardstack/components';

const verticalOffset = (deviceUtils.dimensions.height - 420) / 3;

const Content = styled(Column)`
  align-self: center;
  margin-top: ${verticalOffset};
  width: 200;
`;

const ActivityListEmptyState = ({ children, label }) => {
  return (
    <Container backgroundColor="backgroundBlue" flex={1}>
      {children}
      <Content>
        <Centered>
          <Text color="grayText" textAlign="center">
            {label}
          </Text>
        </Centered>
      </Content>
    </Container>
  );
};

ActivityListEmptyState.propTypes = {
  label: PropTypes.string,
};

ActivityListEmptyState.defaultProps = {
  label: 'No transactions yet',
};

export default ActivityListEmptyState;
