import { PureComputed } from '@devexpress/dx-core';
import { sortAppointments, findOverlappedAppointments, adjustAppointments, unwrapGroups } from '../../utils';
import { COMPACT_APPOINTMENTS_CONTAINER_WIDTH, COMPACT_APPOINTMENT_CONTAINER_HEIGHT } from '../../constants';
import { AppointmentMoment, AppointmentGroup, AppointmentUnwrappedGroup } from '../../types';

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
          ? COMPACT_APPOINTMENTS_CONTAINER_WIDTH
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
  [AppointmentGroup[][], number, boolean], AppointmentUnwrappedGroup[][]
> = (appointmentGroups, maxAppointmentsPerCell, isHorizontalView) => {
  const filteredAppointments = appointmentGroups
    .map(appointmentGroup => removeVisibleAppointments(
      appointmentGroup, maxAppointmentsPerCell, isHorizontalView,
    ));
  const unwrappedAppointments = filteredAppointments
    .map(unwrapGroups) as AppointmentUnwrappedGroup[][];
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
