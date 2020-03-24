import { PureComputed } from '@devexpress/dx-core';
import { sortAppointments, findOverlappedAppointments, adjustAppointments, unwrapGroups } from '../../utils';
import { VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE, COMPACT_APPOINTMENT_CONTAINER_HEIGHT } from '../../constants';
import {
  AppointmentMoment, AppointmentGroup, AppointmentUnwrappedGroup,
  ViewCellData, ViewMetaData, CellByDate, CompactAppointmentsPayload,
} from '../../types';
import { getVerticalCellIndexByAppointmentData } from '../vertical-rect/helpers';

export const overlappingAppointments: PureComputed<
  [AppointmentMoment[][], boolean], AppointmentGroup[][]
> = (appointments, isHorizontalView) => {
  const sortedAppointments = appointments.map(sortAppointments);
  const groupedAppointments = sortedAppointments.map(sortedGroup => findOverlappedAppointments(
    sortedGroup as AppointmentMoment[], isHorizontalView,
  ), [] as AppointmentMoment[]);
  const adjustedAppointments = groupedAppointments.map(group => adjustAppointments(
    group as any[], isHorizontalView,
  ));

  return adjustedAppointments;
};

export const filterAppointmentsByCountPerCell: PureComputed<
  [AppointmentGroup[][], number, boolean], AppointmentUnwrappedGroup[][]
> = (appointmentGroups, maxAppointmentsPerCell, isHorizontalView) => {
  const filteredAppointments = appointmentGroups
    .map(appointmentGroup => removeHiddenAppointments(
      appointmentGroup, maxAppointmentsPerCell, isHorizontalView,
    ));
  const unwrappedAppointments = filteredAppointments
    .map(unwrapGroups) as AppointmentUnwrappedGroup[][];
  return unwrappedAppointments;
};

export const removeHiddenAppointments: PureComputed<
  [AppointmentGroup[], number, boolean], AppointmentGroup[]
> = (appointmentGroups, maxAppointmentsPerCell, isHorizontalView) => {
  const filteredAppointments = appointmentGroups
    .map(({ reduceValue, items }) => {
      const isReduceValueIncorrect = reduceValue > maxAppointmentsPerCell;
      return ({
        reduceValue: isReduceValueIncorrect ? maxAppointmentsPerCell : reduceValue,
        reducedWidth: isReduceValueIncorrect && !isHorizontalView
          ? VERTICAL_COMPACT_APPOINTMENTS_CONTAINER_SIZE
          : undefined,
        reducedHeight: isReduceValueIncorrect && isHorizontalView
          ? COMPACT_APPOINTMENT_CONTAINER_HEIGHT
          : undefined,
        items: items.filter(({ offset }) => offset < maxAppointmentsPerCell),
      });
    });
  return filteredAppointments;
};

export const hiddenAppointments: PureComputed<
  [AppointmentGroup[][], number, boolean, ViewCellData[][],
    ViewMetaData], AppointmentUnwrappedGroup[][]
> = (
  appointmentGroups, maxAppointmentsPerCell, isHorizontalView,
  viewCellsData, viewMetaData,
) => {
  const filteredAppointments = appointmentGroups
    .map(appointmentGroup => removeVisibleAppointments(
      appointmentGroup, maxAppointmentsPerCell, isHorizontalView,
    ));
  const unwrappedAppointments = filteredAppointments
      .map(unwrapGroups) as AppointmentUnwrappedGroup[][];
  if (!isHorizontalView) {
    const cellsPayload = unwrappedAppointments
      .map(groupedAppointments => groupedAppointments.map((appointment) => {
        const { index: cellIndex, startDate } = getVerticalCellIndexByAppointmentData(
          appointment,
          viewCellsData,
          viewMetaData,
          appointment.start.toDate(),
          appointment.takePrev,
        );
        return { index: cellIndex, startDate };
      }));
    const result = groupAppointmentsByCellIndex(
      cellsPayload as CellByDate[][], unwrappedAppointments,
    );
    return result;

  }
  return unwrappedAppointments;
};

export const removeVisibleAppointments: PureComputed<
  [AppointmentGroup[], number, boolean], AppointmentGroup[]
> = (appointmentGroups, maxAppointmentsPerCell, isHorizontalView) => {
  const filteredAppointments = appointmentGroups
    .map(({ reduceValue, items }) => {
      const isReduceValueIncorrect = reduceValue > maxAppointmentsPerCell;
      return ({
        reduceValue: isReduceValueIncorrect ? maxAppointmentsPerCell : reduceValue,
        items: items.filter(({ offset }) => offset >= maxAppointmentsPerCell),
      });
    });
  return filteredAppointments;
};

export const groupAppointmentsByCellIndex: PureComputed<
  [CellByDate[][], AppointmentUnwrappedGroup[][]], CompactAppointmentsPayload[]
> = (cellsPayload, appointments) => {
  let currentCellIndex = -1;
  const compactAppointments = appointments
    .reduce((acc, appointmentGroup, appointmentGroupIndex) => [
      ...acc,
      ...appointmentGroup.reduce((compactAppointmentsAcc, appointment, appointmentIndex) => {
        const cellData = cellsPayload[appointmentGroupIndex][appointmentIndex];
        const cellIndex = cellData.index;
        if (currentCellIndex === cellIndex) {
          compactAppointmentsAcc[compactAppointmentsAcc.length - 1].appointments.push(
            appointment,
          );
          return compactAppointmentsAcc;
        }
        currentCellIndex = cellIndex;
        return ([
          ...compactAppointmentsAcc,
          {
            appointments: [appointment],
            cellData,
          },
        ]);
      }, [] as CompactAppointmentsPayload[]),
    ], [] as CompactAppointmentsPayload[]);
  return compactAppointments;
};
