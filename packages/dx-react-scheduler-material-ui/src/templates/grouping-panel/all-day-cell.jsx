import * as React from 'react';
import * as PropTypes from 'prop-types';
import classNames from 'clsx';
import TableCell from '@material-ui/core/TableCell';
import { makeStyles } from '@material-ui/core/styles';
import { getBrightBorder, getBorder } from '../utils';

const useStyles = makeStyles(theme => ({
  cell: {
    userSelect: 'none',
    padding: 0,
    borderBottom: 'none',
    borderTop: getBrightBorder(theme),
    paddingTop: theme.spacing(0.5),
    boxSizing: 'border-box',
    borderRight: ({ hasBrightBorder }) => (
      hasBrightBorder ? getBrightBorder(theme) : getBorder(theme)
    ),
    'tr:first-child &': {
      borderTop: 'none',
    },
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
    paddingTop: 0,
    paddingBottom: 0,
    color: theme.palette.text.secondary,
    display: 'inline-block',
    lineHeight: 1.5,
  },
}));

export const AllDayCell = React.memo(({
  className,
  group,
  rowSpan,
  hasBrightBorder,
  children,
  height,
  timeTableCellHeight,
  ...restProps
}) => {
  const classes = useStyles({
    hasBrightBorder, height, timeTableCellHeight,
  });
  return (
    <TableCell
      className={classNames(classes.cell, className)}
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

AllDayCell.propTypes = {
  className: PropTypes.string,
  group: PropTypes.object.isRequired,
  rowSpan: PropTypes.number,
  height: PropTypes.number,
  timeTableCellHeight: PropTypes.number,
  hasBrightBorder: PropTypes.bool,
  children: PropTypes.node,
};

AllDayCell.defaultProps = {
  className: undefined,
  hasBrightBorder: true,
  rowSpan: 1,
  height: undefined,
  timeTableCellHeight: 48,
  children: null,
};
