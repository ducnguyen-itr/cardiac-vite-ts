import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';

const IconButton = forwardRef((props, ref) => (
  <button
    id={props.id}
    ref={ref}
    className={classnames(
      'icon-btn',
      props.disabled && '--disabled',
      props.className,
    )}
    type="button"
    style={props.style}
    disabled={props.disabled}
    onClick={props.isLoading ? undefined : props.onClick}
  >
    {props.iconComponent}
  </button>
));

IconButton.defaultProps = {
  id: '',
  className: '',
  disabled: false,
  style: {},
  onClick: () => { },
  isLoading: false,
};

IconButton.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  style: PropTypes.shape(),
  iconComponent: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default IconButton;
