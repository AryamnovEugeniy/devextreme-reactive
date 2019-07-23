import * as React from 'react';
import {
  Plugin, Getter, Template, TemplatePlaceholder,
} from '@devexpress/dx-react-core';
import { appointments, formatDateTimeGetter } from '@devexpress/dx-scheduler-core';
import { SchedulerProps } from '../types';



class SchedulerCoreBase extends React.PureComponent<SchedulerProps> {
  render() {
    const {
      data,
      rootComponent: Root,
      locale,
      height,
    } = this.props;

    const layoutHeight = (height !== 'auto') ? height : '100%';

    return (
      <Plugin
        name="SchedulerCore"
      >
        <Getter name="appointments" value={appointments(data)} />
        <Getter name="formatDate" value={formatDateTimeGetter(locale)} />
        <Template name="root">
          <Root style={{ height: layoutHeight }}>
            <TemplatePlaceholder name="schedulerRoot" />
            <div style={{width: '100%', height: '100%',position: 'relative', display: 'flex', flexDirection: 'column' }}>

              <TemplatePlaceholder name="header" />
              <TemplatePlaceholder name="body" />
              <TemplatePlaceholder name="footer" />

            </div>

          </Root>
        </Template>
      </Plugin>
    );
    // return (
    //   <Plugin
    //     name="SchedulerCore"
    //   >
    //     <Getter name="appointments" value={appointments(data)} />
    //     <Getter name="formatDate" value={formatDateTimeGetter(locale)} />
    //     <Template name="root">
    //       <Root style={{ height: layoutHeight, display: 'flex', flexDirection: 'column', width: '100%'}}>
    //         <TemplatePlaceholder name="schedulerRoot" />
    //           <TemplatePlaceholder name="header" />
    //           <TemplatePlaceholder name="body" />
    //           <TemplatePlaceholder name="footer" />

    //       </Root>
    //     </Template>
    //   </Plugin>
    // );
  }
}

/***
 * The Scheduler is a root container component designed to process
 * and display the specified data. The Scheduler's functionality
 * (data visualization and processing) is implemented in several plugins
 * specified as child components.
 * */
export const SchedulerCore: React.ComponentType<SchedulerProps> = SchedulerCoreBase;
