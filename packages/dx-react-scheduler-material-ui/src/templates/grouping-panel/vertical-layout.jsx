import * as React from 'react';
import * as PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({ spacing }) => ({
  table: {
    tableLayout: 'fixed',
  },
}));

export const VerticalLayout = ({
  rowComponent: Row,
  cellComponent: Cell,
  groups,
  rowSpan,
  ...restProps
}) => {
  return (
    <Table {...restProps}>
      <TableBody>
        {/* {groups.map((groupRow, rowIndex) => {
          groupRow.map((group, groupIndex) => { */}
        {groups[groups.length - 1].map((group, groupIndex) => {
          const cells = [];
          for (let i = 0; i < groups.length; i += 1) {
            const groupSpan = groups[groups.length - 1].length / groups[i].length;
            if (groupIndex % groupSpan === 0) {
              cells.push({
                group: groups[i][groupIndex / groupSpan],
                rowSpan: (rowSpan * groupSpan) / groups[groups.length - 1].length,
                left: 0,
                hasRightBorder: true,
              });
            }
          }
          console.log(cells)
        })

          /* });
        })} */}
      </TableBody>
    </Table>
  );
};

VerticalLayout.propTypes = {
  rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  cellComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  groups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
  rowSpan: PropTypes.number.isRequired,
};
