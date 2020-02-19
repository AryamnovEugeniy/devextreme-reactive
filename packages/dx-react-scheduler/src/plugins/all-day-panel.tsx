import * as React from 'react';
import { getMessagesFormatter, memoize } from '@devexpress/dx-core';
import {
  Getter,
  Plugin,
  Template,
  TemplatePlaceholder,
  TemplateConnector,
  PluginComponents,
} from '@devexpress/dx-react-core';
import {
  allDayCells, calculateAllDayDateIntervals,
  VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION, VIEW_TYPES,
} from '@devexpress/dx-scheduler-core';
import moment from 'moment';

import { AllDayPanelProps, AllDayPanelState } from '../types';

const pluginDependencies = [
  { name: 'DayView', optional: true },
  { name: 'WeekView', optional: true },
];
const defaultMessages = {
  allDay: 'All Day',
};
const AllDayAppointmentLayerPlaceholder = () =>
  <TemplatePlaceholder name="allDayAppointmentLayer" />;
const AllDayPanelPlaceholder = params => <TemplatePlaceholder name="allDayPanel" params={params} />;
const CellPlaceholder = params => <TemplatePlaceholder name="allDayPanelCell" params={params} />;

const GroupingPanelPlaceholder = () => <TemplatePlaceholder name="allDayGroupingPanel" />;

class AllDayPanelBase extends React.PureComponent<AllDayPanelProps, AllDayPanelState> {
  state: AllDayPanelState = {
    elementsMeta: {},
  };
  static defaultProps: Partial<AllDayPanelProps> = {
    messages: {},
  };
  static components: PluginComponents = {
    appointmentLayerComponent: 'AppointmentLayer',
    layoutComponent: 'Layout',
    layoutContainerComponent: 'LayoutContainer',
    cellComponent: 'Cell',
    rowComponent: 'Row',
    titleCellComponent: 'TitleCell',
    containerComponent: 'Container',
  };

  allDayCellsData = memoize(viewCellsData => allDayCells(viewCellsData));

  updateCellElementsMeta = memoize((cellElementsMeta) => {
    this.setState({ elementsMeta: cellElementsMeta });
  });

  allDayAppointmentsComputed = memoize(({
    appointments, startViewDate, endViewDate, excludedDays,
  }) => {
    const allDayLeftBound = moment(startViewDate).hours(0).minutes(0).toDate();
    const allDayRightBound = moment(endViewDate).hours(23).minutes(59).toDate();
    return calculateAllDayDateIntervals(
      appointments, allDayLeftBound, allDayRightBound, excludedDays,
    );
  });

  getMessageFormatter = memoize((messages, allDayPanelDefaultMessages) =>
    getMessagesFormatter({ ...allDayPanelDefaultMessages, ...messages }));

  render() {
    const {
      appointmentLayerComponent: AppointmentLayer,
      layoutComponent: Layout,
      cellComponent: Cell,
      rowComponent,
      titleCellComponent: TitleCell,
      containerComponent: Container,
      messages,
    } = this.props;
    const { elementsMeta } = this.state;
    const getMessage = this.getMessageFormatter(messages, defaultMessages);

    return (
      <Plugin
        name="AllDayPanel"
        dependencies={pluginDependencies}
      >
        <Getter name="allDayElementsMeta" value={elementsMeta} />
        <Getter
          name="allDayAppointments"
          computed={this.allDayAppointmentsComputed}
        />
        <Template name="body">
          {(params: any) => (
            <TemplateConnector>
              {({ groupOrientation, currentView }) => {
                if (currentView.type === VIEW_TYPES.MONTH) {
                  return <TemplatePlaceholder params={{ ...params }} />;
                }
                return (
                  <TemplatePlaceholder
                    params={{
                      ...params,
                      highlightDayScale: groupOrientation?.(currentView.name)
                        === VERTICAL_GROUP_ORIENTATION,
                    }}
                  />
                );
              }}
            </TemplateConnector>
          )}
        </Template>
        <Template name="dayScaleEmptyCell">
          <TemplateConnector>
            {({ currentView, groupOrientation }) => {
              if (currentView.type === VIEW_TYPES.MONTH) return <TemplatePlaceholder />;
              // if (groupOrientation?.(currentView.name) === VERTICAL_GROUP_ORIENTATION) {
              //   return (
              //     <GroupingPanelPlaceholder />
              //   );
              // }
              return (
                <TitleCell getMessage={getMessage} />
              );
            }}
          </TemplateConnector>
        </Template>

        <Template name="timeTable">
          {(params: any) => {
            return (
              <Container style={{ position: 'relative', zIndex: 0 }}>
                <TemplateConnector>
                  {({ currentView }) => {
                    if (currentView.type === VIEW_TYPES.MONTH) return null;
                    return (
                      <Container style={{ position: 'sticky', top: '56px', zIndex: 2 }}>
                        <AllDayPanelPlaceholder
                          viewCellsData={params.cellsData}
                          groupId={params.groupId}
                        />
                      </Container>
                    );
                  }}
                </TemplateConnector>
                <TemplatePlaceholder params={{ ...params }}/>
              </Container>
            );
          }}
        </Template>

        <Template name="allDayPanel">
          {(params: any) => {
            return (
              <TemplateConnector>
                {({
                  currentView, formatDate, groups,
                }) => {
                  if (currentView.type === VIEW_TYPES.MONTH) return null;
                  const groupOrientation = HORIZONTAL_GROUP_ORIENTATION;
                  const { viewCellsData, groupId } = params;

                  return (
                    <>
                      <Layout
                        cellComponent={CellPlaceholder}
                        rowComponent={rowComponent}
                        cellsData={this.allDayCellsData(viewCellsData)}
                        setCellElementsMeta={() => console.log('hi')}
                        formatDate={formatDate}
                        groups={
                          groupOrientation === VERTICAL_GROUP_ORIENTATION
                            ? groups : undefined
                        }
                        groupOrientation={groupOrientation}
                        groupId={groupId}
                      />
                      <AppointmentLayer>
                        <AllDayAppointmentLayerPlaceholder />
                      </AppointmentLayer>
                    </>
                  );
                }}
              </TemplateConnector>
            );
          }}
        </Template>

        <Template name="allDayPanelCell">
          {(params: any) => <Cell {...params} />}
        </Template>
      </Plugin>
    );
  }
}

/** A plugin that renders the All Day Panel. */
export const AllDayPanel: React.ComponentType<AllDayPanelProps> = AllDayPanelBase;
