import * as React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'clsx';
import { scrollingStrategy } from '../utils';
import { GROUPING_PANEL_VERTICAL_CELL_WIDTH } from '../constants';

const useStyles = makeStyles(theme => ({
  container: {
    overflowY: 'auto',
    position: 'relative',
  },
  stickyHeader: {
    top: 0,
    zIndex: 1,
    tableLayout: 'fixed',
    position: 'sticky',
    overflow: 'visible',
    background: theme.palette.background.paper,
    display: 'table',
  },
  timeTable: {
    position: 'relative',
    minWidth: '100%',
    display: 'table',
  },
  leftPanel: {
    left: 0,
    zIndex: 1,
    boxSizing: 'border-box',
    float: 'left',
    width: ({ groupingPanelSize }) => `${theme.spacing(10)
      + groupingPanelSize * GROUPING_PANEL_VERTICAL_CELL_WIDTH + 1}px`,
  },
}));

export const HorizontalViewLayout = React.memo(({
  dayScaleComponent: DayScale,
  timeTableComponent: TimeTable,
  groupingPanelComponent: GroupingPanel,
  groupingPanelSize,
  setScrollingStrategy,
  className,
  ...restProps
}) => {
  const layoutRef = React.useRef(null);
  const layoutHeaderRef = React.useRef(null);
  const leftPanelRef = React.useRef(null);

  const [isLeftBorderSet, setIsLeftBorderSet] = React.useState(false);
  const [isTopBorderSet, setIsTopBorderSet] = React.useState(false);

  React.useEffect(() => {
    setScrollingStrategy(scrollingStrategy(
      layoutRef.current, layoutHeaderRef.current, leftPanelRef.current,
    ));
  }, [layoutRef, layoutHeaderRef, leftPanelRef]);

  const classes = useStyles({ groupingPanelSize });

  const setBorders = React.useCallback((event) => {
    // eslint-disable-next-line no-bitwise
    if ((!!event.target.scrollLeft ^ isLeftBorderSet)) {
      setIsLeftBorderSet(!isLeftBorderSet);
    }
    // eslint-disable-next-line no-bitwise
    if (!!event.target.scrollTop ^ isTopBorderSet) {
      setIsTopBorderSet(!isTopBorderSet);
    }
  }, [isLeftBorderSet, isTopBorderSet]);

  return (
    <Grid
      ref={layoutRef}
      className={classNames(classes.container, className)}
      container
      direction="column"
      wrap="nowrap"
      onScroll={setBorders}
      {...restProps}
    >
      {/* Fix Safari sticky header https://bugs.webkit.org/show_bug.cgi?id=175029 */}
      <div>
        <Grid
          ref={layoutHeaderRef}
          className={classes.stickyHeader}
        >
          <DayScale />
        </Grid>
        <Grid
          className={classes.timeTable}
        >
          {/* <div
            ref={leftPanelRef}
          >
            <GroupingPanel />
          </div> */}
          <TimeTable />
        </Grid>
      </div>
    </Grid>
  );
});

HorizontalViewLayout.propTypes = {
  // oneOfType is a workaround because withStyles returns react object
  dayScaleComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  timeTableComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  groupingPanelComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  groupingPanelSize: PropTypes.number,
  setScrollingStrategy: PropTypes.func.isRequired,
  className: PropTypes.string,
};

HorizontalViewLayout.defaultProps = {
  groupingPanelComponent: () => null,
  groupingPanelSize: 0,
  className: undefined,
};

// export const HorizontalViewLayout = withStyles(styles, { name: 'HorizontalViewLayout' })(HorizontalViewLayoutBase);
