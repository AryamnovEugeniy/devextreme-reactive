import * as React from 'react';
import {
  Plugin, PluginComponents, Getter, Getters, Template, TemplateConnector, TemplatePlaceholder,
} from '@devexpress/dx-react-core';
import {
  filterAppointmentsByCountPerCell,
  overlappingAppointments,
  VIEW_TYPES,
  hiddenAppointments,
  HORIZONTAL_GROUP_ORIENTATION,
  isTimeTableElementsMetaActual,
  getVerticalRect,
} from '@devexpress/dx-scheduler-core';

import { CompactAppointmentsProps } from '../types';

const CompactAppointmentsContainerPlaceholder = params => (
  <TemplatePlaceholder name="compactAppointmentsContainer" params={params} />
);
const CompactAppointmentsContentPlaceholder = params => (
  <TemplatePlaceholder name="compactAppointmentsContent" params={params} />
);

const pluginDependencies = [
  { name: 'DayView', optional: true },
  { name: 'WeekView', optional: true },
  { name: 'MonthView', optional: true },
  { name: 'AllDayPanel', optional: true },
  { name: 'IntegratedGrouping', optional: true },
];

const getHiddenTimeTableAppointmentsComputed = ({
  timeTableOverlappingAppointments, currentView, viewCellsData,
  groupOrientation: getGroupOrientation, groups, groupByDate,
}: Getters) => {
  const result = hiddenAppointments(
    timeTableOverlappingAppointments, 1,
    currentView.type === VIEW_TYPES.MONTH,
    viewCellsData,
    {
      groupOrientation: getGroupOrientation
        ? getGroupOrientation(currentView?.name)
        : HORIZONTAL_GROUP_ORIENTATION,
      groupedByDate: groupByDate?.(currentView?.name),
      groupCount: groups ? groups[groups.length - 1].length : 1,
    },
  );
  return result;
};

const getTimeTableAppointmentsComputed = ({
  timeTableOverlappingAppointments, currentView,
}: Getters) => {
  const filteredAppointments = filterAppointmentsByCountPerCell(
    timeTableOverlappingAppointments, 1, currentView.type === VIEW_TYPES.MONTH,
  );
  return filteredAppointments;
};

const getOverlappingAppointmentsComputed = ({
  timeTableAppointments, currentView,
}: Getters) => {
  return overlappingAppointments(timeTableAppointments, currentView.type === VIEW_TYPES.MONTH);
};

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

  constructor(props) {
    super(props);

    this.state = {
      appointmentListVisible: false,
      appointmentList: [],
      appointmentListTarget: null,
    };

    this.toggleAppointmentVisibility = this.toggleAppointmentVisibility.bind(this);
  }

  toggleAppointmentVisibility() {
    const { appointmentListVisible } = this.state;
    this.setState({ appointmentListVisible: !appointmentListVisible });
  }

  render() {
    const {
      // maxAppointmentsPerCell,
      // minAppointmentSize,
      containerComponent: Container,
      contentComponent: Content,
      appointmentListOverlayComponent: AppointmentListOverlay,
      appointmentListLayoutComponent: AppointmentListLayout,
      // appointmentListItemComponent,
      // appointmentListHeaderComponent,
    } = this.props;

    const {
      appointmentListVisible,
      appointmentList,
      target,
    } = this.state;
    console.log(target)

    return (
      <Plugin
        name="CompactAppointments"
        dependencies={pluginDependencies}
      >
        <Getter
          name="timeTableOverlappingAppointments"
          computed={getOverlappingAppointmentsComputed}
        />
        <Getter name="timeTableAppointments" computed={getTimeTableAppointmentsComputed} />
        <Getter
          name="compactTimeTableAppointments"
          computed={getHiddenTimeTableAppointmentsComputed}
        />

        <Template name="timeTableAppointmentLayer">
          <TemplatePlaceholder />
          <TemplateConnector>
            {({
              compactTimeTableAppointments,

              timeTableElementsMeta,
              viewCellsData,

              formatDate,
            }) => {
              if (!isTimeTableElementsMetaActual(viewCellsData, timeTableElementsMeta)) return null;

              return compactTimeTableAppointments.map(({ cellData, appointments }) => {
                const cellIndex = cellData.index;
                const style = getVerticalRect(timeTableElementsMeta, cellIndex);
                return (
                  <CompactAppointmentsContainerPlaceholder
                    key={cellIndex}
                    style={{ ...style, position: 'absolute' }}
                    cellData={cellData}
                    appointments={appointments}
                    formatDate={formatDate}
                  />
                );
              });
            }}
          </TemplateConnector>
        </Template>

        <Template name="compactAppointmentsContainer">
          {({ style, cellData, appointments, formatDate }: any) => {
            return (
              <Container style={style}>
                <CompactAppointmentsContentPlaceholder
                  cellData={cellData}
                  appointments={appointments}
                  formatDate={formatDate}
                />
              </Container>
            );
          }}
        </Template>
        <Template name="compactAppointmentsContent">
          {({ cellData, appointments, formatDate }: any) => {
            const openAppointmentList = (nextTarget, nextAppointmentList) => {
              this.setState({
                target: nextTarget,
                appointmentList: nextAppointmentList,
              });
              this.toggleAppointmentVisibility();
            };
            return (
              <Content
                cellData={cellData}
                appointments={appointments}
                formatDate={formatDate}
                onClick={openAppointmentList}
              />
            );
          }}
        </Template>

        <Template name="timeTable">
          <TemplatePlaceholder />
          <TemplatePlaceholder name="appointmentList" />
        </Template>
        <Template name="appointmentList">
          <AppointmentListOverlay
            onHide={this.toggleAppointmentVisibility}
            visible={appointmentListVisible}
            target={target}
          >

          </AppointmentListOverlay>
        </Template>

      </Plugin>
    );
  }
}

/** A plugin that renders container for hidden appointments. */
export const CompactAppointments: React.ComponentType<
  CompactAppointmentsProps
> = CompactAppointmentsBase;
