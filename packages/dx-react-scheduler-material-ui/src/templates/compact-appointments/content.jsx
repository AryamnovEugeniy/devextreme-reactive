import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'clsx';

const styles = ({ palette }) => ({
  content: {
    width: '100%',
    height: '100%',
    lineHeight: '100%',
    background: palette.primary[500],
    // color: palette.primary.contrastText,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    color: palette.common.white,
  },
});

const ContentBase = ({
  classes,
  className,
  appointments,
  onClick,
  ...restProps
}) => {
  const handleClick = React.useCallback(({ target }) => {
    onClick(target, appointments);
  }, [appointments]);
  return (
    <div
      className={classNames(classes.content, className)}
      onClick={handleClick}
    >
      <div className={classes.text}>
        {appointments.length}
      </div>
    </div>
  );
};

ContentBase.propTypes = {
  // oneOfType is a workaround because withStyles returns react object
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  formatDate: PropTypes.func.isRequired,
  durationType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ContentBase.defaultProps = {
  className: undefined,
};

export const Content = withStyles(styles, { name: 'Content' })(ContentBase);
