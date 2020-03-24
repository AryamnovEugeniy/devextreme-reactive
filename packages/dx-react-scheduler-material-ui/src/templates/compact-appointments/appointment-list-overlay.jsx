import * as React from 'react';
import * as PropTypes from 'prop-types';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';

const verticalTopHorizontalCenterOptions = { vertical: 'top', horizontal: 'center' };

const styles = {
  popover: {
    borderRadius: '8px',
    width: '200px',
    height: '200px',
  },
};

const AppointmentListOverlayBase = ({
  target,
  visible,
  onHide,
  classes,
  children,
  ...restProps
}) => (
  <Popover
    open={visible}
    anchorEl={target}
    onClose={onHide}
    anchorOrigin={verticalTopHorizontalCenterOptions}
    transformOrigin={verticalTopHorizontalCenterOptions}
    PaperProps={{
      className: classes.popover,
    }}
    {...restProps}
  >
    {console.log('hi')}
    {children}
  </Popover>
);

AppointmentListOverlayBase.propTypes = {
  target: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
};

AppointmentListOverlayBase.defaultProps = {
  target: null,
};

export const AppointmentListOverlay = withStyles(styles, { name: 'AppointmentListOverlay' })(AppointmentListOverlayBase);
