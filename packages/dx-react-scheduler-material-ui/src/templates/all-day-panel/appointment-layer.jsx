import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ContainerBase } from '../common/container';

const styles = {
  container: {
    // position: 'relative',
    width: '100%',
    top: 0,
    left: 0,
  },
  stickyContainer: {
    position: 'sticky',
    width: '100%',
    zIndex: 2,
  },
};

const Container = withStyles(styles, { name: 'AppointmentsContainer' })(ContainerBase);
const AppointmentLayerBase = React.memo(({
  classes,
  height,
  topOffset,
  containerHeight,
  children,
  ...restProps
}) => {
  return (
    <div>
      <div
        className={classes.stickyContainer}
        style={{ top: topOffset }}
        {...restProps}
      >
        <Container>
          {children}
        </Container>
      </div>
      <div style={{ height: `${height}px`, width: '0px' }} />
    </div>
  );
});

AppointmentLayerBase.propTypes = {
  classes: PropTypes.object.isRequired,
  height: PropTypes.number,
  topOffset: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
};
AppointmentLayerBase.defaultProps = {
  height: 0,
};

export const AppointmentLayer = withStyles(styles, { name: 'AppointmentLayer' })(AppointmentLayerBase);
