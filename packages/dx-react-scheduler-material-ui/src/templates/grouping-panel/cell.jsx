import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '@devexpress/dx-scheduler-core';
import { getBrightBorder, getBorder } from '../utils';

// const createQuery =

const useStyles = makeStyles(theme => ({
  cell: {
    userSelect: 'none',
    padding: 0,
    paddingTop: theme.spacing(0.5),
    boxSizing: 'border-box',
    borderRight: ({ hasBrightBorder }) => (
      hasBrightBorder ? getBrightBorder(theme) : getBorder(theme)
    ),
    '&:last-child': {
      borderRight: 'none',
    },
    height: ({ height, timeTableCellHeight }) => (
      height ? theme.spacing((timeTableCellHeight * height) / 8) : undefined
    ),
  },
  text: {
    ...theme.typography.caption,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    fontWeight: 'bold',
    fontSize: '1rem',
    position: 'sticky',
    display: 'inline-block',
    left: ({ left }) => theme.spacing(left / 8),
    lineHeight: 1.5,
  },
  horizontalCell: {
    borderBottom: 'none',
    borderTop: getBrightBorder(theme),
    'tr:first-child &': {
      borderTop: 'none',
    },
  },
  verticalCell: ({ rowSpan }) => ({
    borderBottom: getBrightBorder(theme),
    [`tr:nth-last-child(${rowSpan}) &`]: {
      borderBottom: 'none',
    },
  }),
}));

export const Cell = React.memo(({
  className,
  group,
  colSpan,
  rowSpan,
  left,
  hasBrightBorder,
  children,
  height,
  timeTableCellHeight,
  groupOrientation,
  ...restProps
}) => {
  const classes = useStyles({
    left, hasBrightBorder, height, timeTableCellHeight, rowSpan,
  });
  return (
    <TableCell
      className={classNames({
        [classes.cell]: true,
        [classes.horizontalCell]: groupOrientation === HORIZONTAL_GROUP_ORIENTATION,
        [classes.verticalCell]: groupOrientation === VERTICAL_GROUP_ORIENTATION,
      }, className)}
      colSpan={colSpan}
      rowSpan={rowSpan}
      {...restProps}
    >
      <div className={classes.text}>
        {group.text}
        {children}
      </div>
    </TableCell>
  );
});

Cell.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object.isRequired,
  colSpan: PropTypes.number.isRequired,
  rowSpan: PropTypes.number,
  left: PropTypes.number.isRequired,
  height: PropTypes.number,
  timeTableCellHeight: PropTypes.number,
  hasBrightBorder: PropTypes.bool,
  groupOrientation: PropTypes.string,
  children: PropTypes.node,
};

Cell.defaultProps = {
  className: undefined,
  hasBrightBorder: true,
  rowSpan: 1,
  height: undefined,
  timeTableCellHeight: 48,
  groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
  children: null,
};
