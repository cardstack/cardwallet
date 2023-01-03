import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import Divider from '../Divider';
import { colors } from '@cardstack/theme';
import { neverRerender } from '@rainbow-me/utils';

const ListItemDivider = styled(Divider).attrs(({ inset }) => ({
  color: colors.underlineGray,
  inset: [0, inset],
}))``;

ListItemDivider.propTypes = {
  inset: PropTypes.number,
};

ListItemDivider.defaultProps = {
  inset: 16,
};

export default neverRerender(ListItemDivider);
