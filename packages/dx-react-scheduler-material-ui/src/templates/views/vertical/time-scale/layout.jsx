import * as React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { TicksLayout } from './ticks-layout';

const getLabelsForSingleGroup = (cellsData, groupIndex, groupHeight) => {
  const currentGroupIndex = groupIndex * groupHeight;
  const nextGroupIndex = currentGroupIndex + groupHeight;
  const firstCell = cellsData[currentGroupIndex][0];

  const labels = [
    {
      key: firstCell.startDate,
      groupingInfo: firstCell.groupingInfo,
    },
    ...cellsData.slice(currentGroupIndex, nextGroupIndex - 1).reduce((acc, days) => (([
      ...acc,
      {
        time: days[0].endDate,
        key: days[0].endDate,
        groupingInfo: days[0].groupingInfo,
      },
    ])), []),
    {
      key: cellsData[nextGroupIndex - 1][0].endDate,
      endOfGroup: true,
      groupingInfo: firstCell.groupingInfo,
    },
  ];
  return labels;
};

const getLabelsForAllGroups = (cellsData, groupsNumber, groupHeight) => {
  let labels = [];
  for (let i = 0; i < groupsNumber; i += 1) {
    labels = [
      ...labels,
      ...getLabelsForSingleGroup(cellsData, i, groupHeight),
    ];
  }
  return labels;
};

const styles = ({ spacing }) => ({
  timeScaleContainer: {
    width: `calc(100% - ${spacing(1)}px)`,
  },
  // timeScale: {}
  ticks: {
    width: spacing(1),
  },
});

const LayoutBase = ({
  labelComponent: Label,
  rowComponent,
  tickCellComponent,
  cellsData,
  formatDate,
  groups,
  classes,
  ...restProps
}) => {
  const groupsNumber = groups[groups.length - 1].length;
  console.log(cellsData)
  const groupHeight = cellsData.length / groupsNumber;
  return (
    <Grid container direction="row" {...restProps}>
      <div className={classes.timeScaleContainer}>
        {groups[groups.length - 1].map((group, groupIndex) => {
          return (
            <>
              <div className={classes.timeScale}>
                <Label key={cellsData[0][0].startDate} />
                {cellsData.map((days, index) => (
                  index !== cellsData.length - 1 && (
                    <Label
                      time={days[0].endDate}
                      formatDate={formatDate}
                      key={days[0].endDate}
                      groupingInfo={days[0].groupingInfo}
                    />
                  )
                ))}
                <Label
                  key={cellsData[cellsData.length - 1][0].endDate}
                  endOfGroup
                />
              </div>
            </>
          );
        })}
      </div>
      <TicksLayout
        rowComponent={rowComponent}
        cellComponent={tickCellComponent}
        cellsData={[...cellsData, ...cellsData, ...cellsData, ...cellsData]}
        className={classes.ticks}
      />
    </Grid>
  );
};

/* {getLabelsForAllGroups(cellsData, groupsNumber, groupHeight).map(({
          key, time, groupingInfo, endOfGroup,
        }) => (
          <Label
            // key={key}
            time={time}
            groupingInfo={groupingInfo}
            formatDate={formatDate}
            endOfGroup={endOfGroup}
          />
        ))} */

LayoutBase.propTypes = {
  cellsData: PropTypes.arrayOf(Array).isRequired,
  labelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  rowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  tickCellComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  formatDate: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)),
  classes: PropTypes.object.isRequired,
};

LayoutBase.defaultProps = {
  groups: [[{}]],
};

export const Layout = withStyles(styles, { name: 'Layout' })(LayoutBase);
