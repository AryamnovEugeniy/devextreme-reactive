import * as React from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = () => ({
  container: {
    position: 'absolute',
  },
});

class ContainerBase extends React.PureComponent {

  render() {
    const {
      children, classes, className, ...restProps
    } = this.props;
    return (
      <div
        className={classNames(classes.container, className)}
        style={{ position: 'relative' }}
        {...restProps}
      >
        {children}
      </div>
    );
  }
}

ContainerBase.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

ContainerBase.defaultProps = {
  className: undefined,
};

export const Container = withStyles(styles)(ContainerBase, { name: 'Container' });
