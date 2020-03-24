import { AppointmentModel, FormatterFn, ValidResourceInstance } from '../index';

// tslint:disable-next-line:no-namespace
export namespace CompactAppointments {
  /** Properties passed to a component that renders a container for the appointment. */
  export interface ContainerProps {
    /** An object that configures the appointment’s geometry and position. */
    style: any;
    /** A React node used to render the container's content. */
    children?: React.ReactNode;
  }
  /** Properties passes to a component that renders the appointment content. */
  export interface ContentProps {
    /** Specifies content type: ether 'vertical' or 'horizontal' */
    type: string;
    /** The number of appointments hidden in a particular cell. */
    hiddenAppointmentsNumber: number;
    /** Uses a localization message's key to retrieve the message. */
    getMessage: (messageKey: string) => string;
    /** A function to execute when the component is clicked. */
    onClick: (target: React.RefObject<unknown>, appointments: Array<AppointmentModel>) => void;
  }
  /** Properties passes to a component that renders the appointment list's overlay. */
  export interface AppointmentListOverlayProps {
    /** Specifies whether the overlay is visible. */
    visible: boolean;
    /** An event raised when the overlay hides. */
    onHide: () => void;
    /** A React component instance or a DOM element that is used to position the overlay. */
    target: React.RefObject<unknown>;
    /** A React node used to render the overlay content. */
    children: React.ReactNode;
  }
  /** Properties passes to a component that renders the appointment list's layout. */
  export interface AppointmentListLayoutProps {
    /** Appointments contained in the list. */
    appointmentList: Array<AppointmentModel>;
    /** Resource items for each appointment in the appointment list. */
    appointmentResourcesList: Array<Array<ValidResourceInstance>>;
    /** Date to be rendered in the list's header. */
    date: Date;
    /** A function that formats dates according to the locale. */
    formatDate: FormatterFn;
    /** A component that renders appointment list's items. */
    appointmentListItemComponent: React.ComponentType<CompactAppointments.AppointmentListItemProps>;
    /** A component that renders the appointment list's header. */
    appointmentListHeaderComponent: React.ComponentType<
      CompactAppointments.AppointmentListHeaderProps
    >;
  }
  /** Properties passes to a component that renders appointment list's items. */
  export interface AppointmentListItemProps {
    /** An object that represents appointment data. */
    data: AppointmentModel;
    /** Specifies the appointment resource items */
    resources: Array<ValidResourceInstance>;
    /** A function that formats dates according to the locale. */
    formatDate: FormatterFn;

  }
  /** Properties passes to a component that renders the appointment list's header. */
  export interface AppointmentListHeaderProps {
    /** Date to be rendered in the list's header. */
    date: Date;
    /** A function that formats dates according to the locale. */
    formatDate: FormatterFn;
  }
}

export interface CompactAppointmentsProps {
  maxAppointmentsPerCell: (viewName: string) => MaxAppointmentsPerCell;
  minAppointmentSize: (viewName: string) => MinAppointmentSize;
  /** A component that renders a container for the compact appointments item. */
  containerComponent: React.ComponentType<CompactAppointments.ContainerProps>;
  /** A component that renders the appointment content. */
  contentComponent: React.ComponentType<CompactAppointments.ContentProps>;
  /** A component that renders the appointment list's overlay. */
  appointmentListOverlayComponent: React.ComponentType<
    CompactAppointments.AppointmentListOverlayProps
  >;
  /** A component that renders the appointment list's layout. */
  appointmentListLayoutComponent: React.ComponentType<
    CompactAppointments.AppointmentListLayoutProps
  >;
  /** A component that renders appointment list's items. */
  appointmentListItemComponent: React.ComponentType<CompactAppointments.AppointmentListItemProps>;
  /** A component that renders the appointment list's header. */
  appointmentListHeaderComponent: React.ComponentType<
    CompactAppointments.AppointmentListHeaderProps
  >;
}

type MaxAppointmentsPerCell = {
  timetable: number | undefined;
  allDayPanel: number | undefined;
};
type MinAppointmentSize = {
  timetable: number;
  allDayPanel: number;
};
