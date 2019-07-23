import * as React from 'react';
import * as PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = () => ({
  root: {
    height: '100%',
    top: '300px',
    overflow: 'hidden',
  },
});

class RootBase extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ref = React.createRef();
  }

  render() {
    const {
      children, visible, classes, className, scheduler, divRef, ...restProps
    } = this.props;
    return (
      <Drawer
        className={classNames(classes.root, className)}
        PaperProps={{ style: { position: 'absolute', width: '50%' } }}
        BackdropProps={{ style: { position: 'absolute' } }}
        ModalProps={{
          container: divRef,
          style: { position: 'absolute' },
        }}
        variant="temporary"
        open={visible}
        anchor="left"
        transitionDuration={1000}
        {...restProps}
      >
        {children}
      </Drawer>
    );
  }
}

RootBase.propTypes = {
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  scheduler: PropTypes.string,
};

RootBase.defaultProps = {
  visible: false,
  className: undefined,
  scheduler: undefined,
};

export const Root = withStyles(styles)(RootBase, { name: 'Root' });
