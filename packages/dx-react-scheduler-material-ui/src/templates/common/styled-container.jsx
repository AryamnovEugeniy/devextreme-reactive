import * as React from 'react';
import * as PropTypes from 'prop-types';

export const StyledContainer = ({ style, children, ...restProps }) => (
  <div
    style={style}
    {...restProps}
  >
    {children}
  </div>
);

StyledContainer.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object.isRequired,
};
