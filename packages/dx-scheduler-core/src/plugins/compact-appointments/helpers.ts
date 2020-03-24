import { PureComputed } from '@devexpress/dx-core';
import { CellElementsMeta, Rect } from '../../types';
import { VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE } from '../../constants';

export const getVerticalRect: PureComputed<
  [CellElementsMeta, number], Rect
> = (elementsMeta, cellIndex) => {
  const {
    right, top, height,
  } = elementsMeta.getCellRects[cellIndex]();
  const parentRect = elementsMeta.parentRect();
  const parentWidth = parentRect.width;
  const topOffset = (height - VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE) / 2;

  return {
    left: `${(right - VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE - parentRect.left) / parentWidth * 100}%`,
    top: top + topOffset - parentRect.top,
    width: VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE,
    height: VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE,
  };
};
