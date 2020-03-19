import { withComponents } from '@devexpress/dx-react-core';
import { CompactAppointments as CompactAppointmentsBase } from '@devexpress/dx-react-scheduler';
import { StyledContainer as Container } from '../templates/common/styled-container';

export const CompactAppointments = withComponents({
  Container,
})(CompactAppointmentsBase);
