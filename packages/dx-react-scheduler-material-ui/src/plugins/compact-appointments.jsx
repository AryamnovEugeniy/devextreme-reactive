import { withComponents } from '@devexpress/dx-react-core';
import { CompactAppointments as CompactAppointmentsBase } from '@devexpress/dx-react-scheduler';
import { Content } from '../templates/compact-appointments/content';
import { AppointmentListOverlay } from '../templates/compact-appointments/appointment-list-overlay';
import { AppointmentListLayout } from '../templates/compact-appointments/appointment-list-layout';
import { StyledContainer as Container } from '../templates/common/styled-container';

export const CompactAppointments = withComponents({
  Container, Content, AppointmentListOverlay, AppointmentListLayout,
})(CompactAppointmentsBase);
