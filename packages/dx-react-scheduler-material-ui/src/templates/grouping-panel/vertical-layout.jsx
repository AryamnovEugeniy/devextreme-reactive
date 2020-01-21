import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'clsx';
import { GROUPING_PANEL_VERTICAL_CELL_WIDTH } from '../constants';

const useStyles = makeStyles({
  layout: {
    tableLayout: 'fixed',
    width: ({ cellsInRow }) => `${cellsInRow * GROUPING_PANEL_VERTICAL_CELL_WIDTH}px`,
  },
});

export const VerticalLayout = ({
  rowComponent: Row,
  cellComponent: Cell,
  groups,
  rowSpan,
  timeTableCellHeight,
  className,
  ...restProps
}) => {
  const classes = useStyles({ cellsInRow: groups.length });
  return (
    <Table className={classNames(classes.layout, className)} {...restProps}>
      <TableBody>
        {groups[groups.length - 1].map((group, groupIndex) => {
          const cells = [];
          for (let i = 0; i < groups.length; i += 1) {
            const groupSpan = groups[groups.length - 1].length / groups[i].length;
            if (groupIndex % groupSpan === 0) {
              cells.push({
                group: groups[i][groupIndex / groupSpan],
                rowSpan: groupSpan,
                height: (rowSpan * groupSpan) / groups[groups.length - 1].length,
                hasBrightBorder: true,
              });
            }
          }
          return (
            <Row>
              {cells.map(({
                group: cellGroup, rowSpan: cellRowSpan, height, hasBrightBorder,
              }) => {
                return (
                  <Cell
                    group={cellGroup}
                    rowSpan={cellRowSpan}
                    height={height}
                    left={0}
                    hasBrightBorder={hasBrightBorder}
                    colSpan={1}
                    timeTableCellHeight={timeTableCellHeight}
                  />
                );
              })}
            </Row>
          )
        })}
      </TableBody>
    </Table>
  );
};

VerticalLayout.propTypes = {
  rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  cellComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  groups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  rowSpan: PropTypes.number.isRequired,
  timeTableCellHeight: PropTypes.number,
  className: PropTypes.string,
};

VerticalLayout.defaultProps = {
  timeTableCellHeight: 48,
  className: undefined,
};
