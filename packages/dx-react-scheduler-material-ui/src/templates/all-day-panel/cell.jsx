import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { getBorder, getBrightBorder } from '../utils';

const styles = theme => ({
  cell: {
    background: theme.palette.background.paper,
    padding: 0,
    height: theme.spacing(5.75),
    boxSizing: 'border-box',
    borderRight: getBorder(theme),
    '&:focus': {
      outline: 0,
    },
    '&:last-child': {
      borderRight: 'none',
    },
    'tr:last-child &': {
      borderBottom: 'none',
    },
    position: 'sticky',
    top: '56px',
    zIndex: 1,
  },
  brightRightBorder: {
    borderRight: getBrightBorder(theme),
  },
  container: {
    width: '100%',
    height: '100%',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      outline: 0,
    },
  },
});

const CellBase = ({
  classes,
  className,
  children,
  startDate,
  endDate,
  endOfGroup,
  groupingInfo,
  groupId,
  // @deprecated
  hasRightBorder,
  ...restProps
}) => (
  <TableCell
    // tabIndex={0}
    className={classNames({
      [classes.cell]: true,
      [classes.brightRightBorder]: endOfGroup || hasRightBorder,
      [classes.blueCell]: groupId === 1,
    }, className)}
    {...restProps}
  >
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
    <div tabIndex={0} className={classes.container}>
      {children}
    </div>
  </TableCell>
);

CellBase.propTypes = {
  classes: PropTypes.object.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  children: PropTypes.node,
  className: PropTypes.string,
  hasRightBorder: PropTypes.bool,
  endOfGroup: PropTypes.bool,
  groupingInfo: PropTypes.arrayOf(PropTypes.object),
};

CellBase.defaultProps = {
  children: null,
  startDate: undefined,
  endDate: undefined,
  className: undefined,
  hasRightBorder: false,
  endOfGroup: false,
  groupingInfo: undefined,
};

export const Cell = withStyles(styles, { name: 'Cell' })(CellBase);
