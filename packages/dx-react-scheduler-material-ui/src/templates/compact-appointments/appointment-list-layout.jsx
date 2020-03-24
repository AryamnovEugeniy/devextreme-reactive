import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    margin: '0 auto',
    overflowY: 'auto',
  },
  stickyContainer: {
    display: 'flex',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
};

const AppointmentListLayoutBase = ({
  appointmentList,
  appointmentResoucesList,
  formatDate,
  date,
  classes,
  className,
  headerComponent: Header,
  itemComponent: Item,
  closeButtonComponent,
  ...restProps
}) => (
  <div
    className={classNames(classes.root, className)}
    {...restProps}
  >
    <div className={classes.stickyContainer}>
      <Header formatDate={formatDate} date={date} />
    </div>
    <div>

    </div>
  </div>
);

AppointmentListLayoutBase.propTypes = {
  date: PropTypes.instanceOf(Date),
  formatDate: PropTypes.func.isRequired,
  headerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  itemComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  closeButtonComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

AppointmentListLayoutBase.defaultProps = {
  date: undefined,
  className: undefined,
};

export const AppointmentListLayout = withStyles(styles)(AppointmentListLayoutBase, { name: 'AppointmentListLayout' });
