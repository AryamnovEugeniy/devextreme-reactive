import { withStyles } from '@material-ui/core/styles';
import { ContainerBase } from '../common/container';

const styles = (theme) => ({
  container: {
    position: 'sticky',
    display: 'table',
    minWidth: '100%',
    top: '56px',
    background: theme.palette.background.paper,
    zIndex: 2,
  },
});

export const Container = withStyles(styles, { name: 'AllDayContainer' })(ContainerBase);
