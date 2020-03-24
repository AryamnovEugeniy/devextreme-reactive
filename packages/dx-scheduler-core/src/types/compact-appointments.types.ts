import { AppointmentUnwrappedGroup } from './utils.types';
import { CellByDate } from './vertical-rect.types';

/** @internal */
export type CompactAppointmentsPayload = {
  appointments: AppointmentUnwrappedGroup[];
  cellData: CellByDate;
};
