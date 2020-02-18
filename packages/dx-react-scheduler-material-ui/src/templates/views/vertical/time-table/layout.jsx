import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Layout as LayoutBase } from '../../common/layout';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { getViewCellKey } from '../../../utils';

const prepareCells = (cellsData, groupCount) => {
  const groupHeight = cellsData.length / groupCount;
  const cellsToRender = [];
  for (let i = 0; i < groupCount; i += 1) {
    cellsToRender.push(cellsData.slice(i * groupHeight, (i + 1) * groupHeight));
  }
  return cellsToRender;
};

export const Layout = React.memo(({
  setCellElementsMeta,
  cellComponent: Cell,
  rowComponent: Row,
  allDayPanelComponent: AllDayPanel,
  groupCount,
  cellsData,
  formatDate,
  ...restProps
}) => {
  return (
    <LayoutBase
      setCellElementsMeta={setCellElementsMeta}
      cellsNumber={cellsData[0].length}
      {...restProps}
    >
      {/* <AllDayPanel groupId={0} />
      {cellsData.map((days, index) => (
        <Row key={index.toString()}>
          {days.map(({
            startDate, endDate, groupingInfo, endOfGroup, groupOrientation,
          }) => (
            <Cell
              key={getViewCellKey(startDate, groupingInfo)}
              startDate={startDate}
              endDate={endDate}
              endOfGroup={endOfGroup}
              hasRightBorder={endOfGroup}
              groupingInfo={groupingInfo}
              groupOrientation={groupOrientation}
            />
          ))}
        </Row>
      ))} */}
      {prepareCells(cellsData, groupCount).map((groupedCells, groupIndex) => {
        return (
          <TableBody>
            <AllDayPanel groupId={groupIndex} />
            {groupedCells.map((days, index) => (
              <Row key={index.toString()}>
                {days.map(({
                  startDate, endDate, groupingInfo, endOfGroup, groupOrientation,
                }) => (
                  <Cell
                    key={getViewCellKey(startDate, groupingInfo)}
                    startDate={startDate}
                    endDate={endDate}
                    endOfGroup={endOfGroup}
                    hasRightBorder={endOfGroup}
                    groupingInfo={groupingInfo}
                    groupOrientation={groupOrientation}
                  />
                ))}
              </Row>
            ))}
          </TableBody>
        );
      })}
    </LayoutBase>
  );
});

Layout.propTypes = {
  cellsData: PropTypes.arrayOf(Array).isRequired,
  cellComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  formatDate: PropTypes.func.isRequired,
  setCellElementsMeta: PropTypes.func.isRequired,
  allDayPanelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  groupCount: PropTypes.number,
};

Layout.defaultProps = {
  allDayPanelComponent: undefined,
  groupCount: 1,
};
