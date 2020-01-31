import { PureComputed } from '@devexpress/dx-core';
import { HORIZONTAL_GROUP_ORIENTATION } from '../../constants';
import { ViewCell, Group, GroupOrientation, TimeScaleLabelData } from '../../types';

const getLabelsForSingleGroup: PureComputed<
  [ViewCell[][], number, number], TimeScaleLabelData[]
> = (cellsData, groupIndex, groupHeight) => {
  const currentGroupIndex = groupIndex * groupHeight;
  const nextGroupIndex = currentGroupIndex + groupHeight;

  return cellsData.slice(currentGroupIndex, nextGroupIndex - 1).reduce((
    acc: TimeScaleLabelData[], days: ViewCell[],
  ) => (([
    ...acc,
    {
      startDate: days[0].startDate,
      endDate: days[0].endDate,
      key: days[0].endDate,
      groupingInfo: days[0].groupingInfo,
    },
  ])), [] as TimeScaleLabelData[]);
};

export const getLabelsForAllGroups: PureComputed<
  [ViewCell[][], Group[][], GroupOrientation], TimeScaleLabelData[][]
> = (cellsData, groups, groupOrientation) => {
  if (groupOrientation === HORIZONTAL_GROUP_ORIENTATION) {
    return [cellsData.map(cellsRow => ({
      startDate: cellsRow[0].startDate,
      endDate: cellsRow[0].endDate,
      groupingInfo: cellsRow[0].groupingInfo,
      key: cellsRow[0].endDate,
    }))];
  }

  const groupsNumber = groups[groups.length - 1].length;
  const singleGroupHeight = cellsData.length / groupsNumber;

  return groups[groups.length - 1].reduce((
    acc: TimeScaleLabelData[][], group: Group, groupIndex: number,
  ) => [
    ...acc,
    getLabelsForSingleGroup(cellsData, groupIndex, singleGroupHeight) as TimeScaleLabelData[],
  ], [] as TimeScaleLabelData[][]);
};
