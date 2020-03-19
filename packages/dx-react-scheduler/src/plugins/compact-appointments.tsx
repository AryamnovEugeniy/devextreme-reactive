import * as React from 'react';
import {
  Plugin, TemplatePlaceholder, PluginComponents, Getter, Getters,
} from '@devexpress/dx-react-core';
import {
  filterAppointmentsByCountPerCell,
  overlappingAppointments,
  VIEW_TYPES,
} from '@devexpress/dx-scheduler-core';

import { CompactAppointmentsProps } from '../types';

const pluginDependencies = [
  { name: 'DayView', optional: true },
  { name: 'WeekView', optional: true },
  { name: 'MonthView', optional: true },
  { name: 'AllDayPanel', optional: true },
  { name: 'IntegratedGrouping', optional: true },
];

class CompactAppointmentsBase extends React.PureComponent<CompactAppointmentsProps> {
  static components: PluginComponents = {
    containerComponent: 'Container',
    contentComponent: 'Content',
    appointmentListOverlayComponent: 'AppointmentListOverlay',
    appointmentListLayoutComponent: 'AppointmentListLayout',
    appointmentListItemComponent: 'AppointmentListItem',
    appointmentListHeaderComponent: 'AppointmentListHeader',
  };
  static defaultProps = {
    maxAppointmentsPerCell: () => ({
      timetable: undefined,
      allDayPanel: undefined,
    }),
    minAppointmentsSize: () => ({
      timetable: 50,
      allDayPanel: 10,
    }),
  };

  getTimeTableAppointmentsComputed({
    timeTableOverlappingAppointments, currentView,
  }: Getters) {
    const filteredAppointments = filterAppointmentsByCountPerCell(
      timeTableOverlappingAppointments, 2, currentView.type === VIEW_TYPES.MONTH,
    );
    return filteredAppointments;
  }

  getOverlappingAppointmentsComputed({
    timeTableAppointments, currentView,
  }: Getters) {
    return overlappingAppointments(timeTableAppointments, currentView.type === VIEW_TYPES.MONTH);
  }

  getTimeTableHiddenAppointments({
    timeTableOverlappingAppointments,
  }: Getters) {

  }

  render() {
    const {
      maxAppointmentsPerCell,
      minAppointmentSize,
      containerComponent: Container,
      contentComponent: Content,
      appointmentListOverlayComponent: AppointmentListOverlay,
      appointmentListLayoutComponent: AppointmentListLayout,
      appointmentListItemComponent,
      appointmentListHeaderComponent,
    } = this.props;

    return (
      <Plugin
        name="Appointments"
        dependencies={pluginDependencies}
      >
        <Getter
          name="timeTableOverlappingAppointments"
          computed={this.getOverlappingAppointmentsComputed}
        />
        <Getter name="timeTableAppointments" computed={this.getTimeTableAppointmentsComputed} />
        <Getter name="timeTableHiddenAppointments" computed={this.getTimeTableHiddenAppointments} />
      </Plugin>
    );
  }
}

/** A plugin that renders container for hidden appointments. */
export const CompactAppointments: React.ComponentType<
  CompactAppointmentsProps
> = CompactAppointmentsBase;
