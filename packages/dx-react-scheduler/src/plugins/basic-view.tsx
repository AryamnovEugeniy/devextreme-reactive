import * as React from 'react';
import {
  Template,
  Plugin,
  Getter,
  TemplateConnector,
  TemplatePlaceholder,
  ComputedFn,
} from '@devexpress/dx-react-core';
import {
  computed,
  startViewDate as startViewDateCore,
  endViewDate as endViewDateCore,
  availableViews as availableViewsCore,
  HORIZONTAL_GROUP_ORIENTATION,
  VERTICAL_GROUP_ORIENTATION,
} from '@devexpress/dx-scheduler-core';
import { memoize } from '@devexpress/dx-core';
import { BasicViewProps, BasicViewState, ScrollingStrategy } from '../types';

const CellPlaceholder = params => <TemplatePlaceholder name="cell" params={params} />;
const TimeTableAppointmentLayer = () => <TemplatePlaceholder name="timeTableAppointmentLayer" />;

const startViewDateBaseComputed = ({ viewCellsData }) => startViewDateCore(viewCellsData);
const endViewDateBaseComputed = ({ viewCellsData }) => endViewDateCore(viewCellsData);

const TimeTablePlaceholder = params => <TemplatePlaceholder name="timeTable" params={params} />;
const TimeTableContainerPlaceholder = () => <TemplatePlaceholder name="timeTableContainer" />;
const DayScalePlaceholder = () => <TemplatePlaceholder name="dayScale" />;
const DayScaleEmptyCellPlaceholder = () => <TemplatePlaceholder name="dayScaleEmptyCell" />;

const GroupingPanelPlaceholder = () => <TemplatePlaceholder name="groupingPanel" />;

class BasicViewBase extends React.PureComponent<BasicViewProps, BasicViewState> {
  state = {
    timeTableElementsMeta: [{}, {}],
    scrollingStrategy: {
      topBoundary: 0,
      bottomBoundary: 0,
      leftBoundary: 0,
      rightBoundary: 0,
      changeVerticalScroll: () => undefined,
      changeHorizontalScroll: () => undefined,
    },
  };

  scrollingStrategyComputed = memoize((viewName, scrollingStrategy) => getters =>
    computed(getters, viewName!, () => scrollingStrategy, getters.scrollingStrategy));

  // timeTableElementsMetaComputed = memoize((viewName, timeTableElementsMeta) => getters =>
  //   computed(getters, viewName!, () => timeTableElementsMeta, getters.timeTableElementsMeta));
  timeTableElementsMetaComputed = memoize((viewName, timeTableElementsMeta) => (getters) => {
    if (getters.currentView.name !== viewName && !!getters.timeTableElementsMeta) {
      return getters.timeTableElementsMeta;
    }
    if (!timeTableElementsMeta[0].parentRect) {
      return {};
    }

    const validTimeTableElementsMeta = {
      parentRect: () => ({
        x: timeTableElementsMeta[0].parentRect().x,
        y: timeTableElementsMeta[0].parentRect().y,
        width: timeTableElementsMeta[0].parentRect().width,
        height: timeTableElementsMeta[0].parentRect().height * timeTableElementsMeta.length,
        top: timeTableElementsMeta[0].parentRect().top,
        right: timeTableElementsMeta[0].parentRect().right,
        bottom: timeTableElementsMeta[timeTableElementsMeta.length - 1].parentRect().bottom,
        left: timeTableElementsMeta[0].parentRect().left,
      }),
      getCellRects: timeTableElementsMeta.reduce((acc, group) => {
        return [
          ...acc,
          ...group.getCellRects,
        ];
      }, []),
    };

    return validTimeTableElementsMeta;
  });

  intervalCountComputed = memoize((viewName, intervalCount) => getters =>
    computed(getters, viewName!, () => intervalCount, getters.intervalCount));

  cellDurationComputed = memoize((viewName, cellDuration) => getters =>
    computed(getters, viewName, () => cellDuration, getters.cellDuration));

  excludedDaysComputed = memoize((viewName, excludedDays) => getters => computed(
    getters, viewName!, () => excludedDays, getters.excludedDays,
  ));

  availableViewsComputed = memoize((viewName, viewDisplayName) => ({ availableViews }) =>
    availableViewsCore(availableViews, viewName!, viewDisplayName));

  currentViewComputed = memoize((viewName, viewDisplayName, type) => ({ currentView }) => (
    currentView && currentView.name !== viewName
      ? currentView
      : { name: viewName, type, displayName: viewDisplayName }
  ));

  endViewDateComputed: ComputedFn = (getters) => {
    const { name: viewName } = this.props;
    return computed(
      getters, viewName!, endViewDateBaseComputed, getters.endViewDate,
    );
  }

  startViewDateComputed: ComputedFn = (getters) => {
    const { name: viewName } = this.props;
    return computed(
      getters, viewName!, startViewDateBaseComputed, getters.startViewDate,
    );
  }

  viewCellsDataComputed = memoize((
    viewName, cellDuration, startDayHour, endDayHour, viewCellsDataBaseComputed,
  ) => getters => computed(
    getters,
    viewName,
    viewCellsDataBaseComputed(cellDuration, startDayHour, endDayHour),
    getters.viewCellsData,
  ));

  timeTableAppointmentsComputed = memoize((
    viewName, cellDuration, calculateAppointmentsIntervals,
  ) => getters => computed(
      getters,
      viewName,
      calculateAppointmentsIntervals(cellDuration),
      getters.timeTableAppointments,
    ));

  updateCellElementsMeta = memoize((cellElementsMeta, groupIndex) => {
    this.setState(({ timeTableElementsMeta }) => {
      const nextElementsMeta = timeTableElementsMeta.slice();
      nextElementsMeta[groupIndex] = cellElementsMeta;
      return { timeTableElementsMeta: nextElementsMeta }
    });
  });

  setScrollingStrategy = (scrollingStrategy: ScrollingStrategy) => {
    this.setState({ scrollingStrategy });
  }

  render() {
    const {
      name: viewName,
      intervalCount,
      displayName,
      type,
      excludedDays,
      cellDuration,
      startDayHour,
      endDayHour,
      viewCellsDataComputed,
      calculateAppointmentsIntervals,
      dayScaleCellComponent,
      dayScaleRowComponent,
      dayScaleLayoutComponent: DayScale,
      timeTableCellComponent: TimeTableCell,
      timeTableLayoutComponent: TimeTableLayout,
      timeTableRowComponent,
      appointmentLayerComponent: AppointmentLayer,
      dayScaleEmptyCellComponent: DayScaleEmptyCell,
      layoutProps,
      layoutComponent: Layout,
    } = this.props;
    const { timeTableElementsMeta, scrollingStrategy } = this.state;
    const viewDisplayName = displayName || viewName;
    // console.log(timeTableElementsMeta[0].parentRect && timeTableElementsMeta[0].parentRect())
    // console.log(timeTableElementsMeta[1].parentRect && timeTableElementsMeta[1].parentRect())
    // console.log('////////////////////////////////////')

    return (
      <Plugin name="basicView">
        <Getter
          name="availableViews"
          computed={this.availableViewsComputed(viewName, viewDisplayName)}
        />
        <Getter
          name="currentView"
          computed={this.currentViewComputed(viewName, viewDisplayName, type)}
        />
        <Getter
          name="intervalCount"
          computed={this.intervalCountComputed(viewName, intervalCount)}
        />
        <Getter name="excludedDays" computed={this.excludedDaysComputed(viewName, excludedDays)} />
        <Getter
          name="viewCellsData"
          computed={this.viewCellsDataComputed(
            viewName, cellDuration, startDayHour, endDayHour, viewCellsDataComputed,
          )}
        />
        <Getter name="startViewDate" computed={this.startViewDateComputed} />
        <Getter name="endViewDate" computed={this.endViewDateComputed} />
        <Getter
          name="cellDuration"
          computed={this.cellDurationComputed(viewName, cellDuration)}
        />

        <Getter
          name="timeTableElementsMeta"
          computed={this.timeTableElementsMetaComputed(viewName, timeTableElementsMeta)}
        />
        <Getter
          name="scrollingStrategy"
          computed={this.scrollingStrategyComputed(viewName, scrollingStrategy)}
        />

        <Getter
          name="timeTableAppointments"
          computed={this.timeTableAppointmentsComputed(
            viewName, cellDuration, calculateAppointmentsIntervals,
          )}
        />

        <Template name="body">
          {params => (
            <TemplateConnector>
              {({ currentView, groupOrientation, groups }) => {
                if (currentView.name !== viewName) return <TemplatePlaceholder />;
                const isVerticalGrouping = groupOrientation?.(viewName)
                  === VERTICAL_GROUP_ORIENTATION;
                return (
                  <Layout
                    dayScaleComponent={DayScalePlaceholder}
                    timeTableComponent={TimeTableContainerPlaceholder}
                    setScrollingStrategy={this.setScrollingStrategy}
                    groupingPanelComponent={
                      isVerticalGrouping ? GroupingPanelPlaceholder : undefined
                    }
                    groupingPanelSize={isVerticalGrouping ? groups?.length : 0}
                    dayScaleEmptyCellComponent={DayScaleEmptyCellPlaceholder}
                    {...layoutProps}
                    {...params}
                  />
                );
              }}
            </TemplateConnector>
          )}
        </Template>

        <Template name="dayScale">
          <TemplateConnector>
            {({ currentView, viewCellsData, formatDate, groupByDate, groupOrientation }) => {
              if (currentView.name !== viewName) return <TemplatePlaceholder />;
              const groupByDateEnabled = groupByDate?.(viewName);
              const isHorizontalGrouping = groupOrientation?.(viewName)
                === HORIZONTAL_GROUP_ORIENTATION;
              const cellsData = viewCellsData.reduce((acc, group) => [...acc, ...group], []);
              return (
                <DayScale
                  cellComponent={dayScaleCellComponent}
                  rowComponent={dayScaleRowComponent}
                  groupingPanelComponent={
                    isHorizontalGrouping ? GroupingPanelPlaceholder : undefined
                  }
                  cellsData={cellsData}
                  formatDate={formatDate}
                  groupedByDate={groupByDateEnabled}
                />
              );
            }}
          </TemplateConnector>
        </Template>

        <Template name="cell">
          {params => (
            <TemplateConnector>
              {({ currentView }) => {
                if (currentView.name !== viewName) return <TemplatePlaceholder params={params} />;
                return (
                  <TimeTableCell {...params} />
                );
              }}
            </TemplateConnector>
          )}
        </Template>

        <Template name="timeTableContainer">
          <TemplateConnector>
            {({ formatDate, currentView, viewCellsData }) => {
              if (currentView.name !== viewName) return <TemplatePlaceholder />;
              // return (
              //   <>
              //     <TimeTableLayout
              //       cellsData={viewCellsData}
              //       rowComponent={timeTableRowComponent}
              //       cellComponent={CellPlaceholder}
              //       formatDate={formatDate}
              //       setCellElementsMeta={this.updateCellElementsMeta}
              //     />
              //     <AppointmentLayer>
              //       <TimeTableAppointmentLayer />
              //     </AppointmentLayer>
              //   </>
              // );
              return (
                <>
                  {viewCellsData.map((timeTable, index) => {
                    return (
                      <TimeTablePlaceholder
                        key={index.toString()}
                        groupId={index}
                        cellsData={timeTable}
                        formatDate={formatDate}
                      />
                    );
                  })}
                  <AppointmentLayer>
                    <TimeTableAppointmentLayer />
                  </AppointmentLayer>
                </>
              )
            }}
          </TemplateConnector>
        </Template>

        <Template name="timeTable">
          {(params: any) => {
            return (
              <TimeTableLayout
                cellsData={params.cellsData}
                rowComponent={timeTableRowComponent}
                cellComponent={CellPlaceholder}
                formatDate={params.formatDate}
                setCellElementsMeta={this.updateCellElementsMeta}
                groupId={params.groupId}
              />
            );
          }}
        </Template>

        <Template name="dayScaleEmptyCell">
          <TemplateConnector>
            {({ currentView }) => {
              if (currentView.name !== viewName || !DayScaleEmptyCell) {
                return <TemplatePlaceholder />;
              }
              return (
                <DayScaleEmptyCell />
              );
            }}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}
export const BasicView: React.ComponentType<BasicViewProps> = BasicViewBase;
