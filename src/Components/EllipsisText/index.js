import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Typography } from 'antd';

const { Text } = Typography;
function EllipsisText(props) {
  return (
    <Text
      className={classnames('ellipsis-text', props.className)}
      style={props.isEllipsis ? { width: props.width } : undefined}
      ellipsis={props.isEllipsis ? { tooltip: props.tooltipText } : false}
    >
      {props.title}
    </Text>
  );
}

EllipsisText.defaultProps = {
  className: '',
  width: '',
  tooltipText: '',
  title: '',
  isEllipsis: true,
};

EllipsisText.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Width of component */
  width: PropTypes.string,
  /** Component tooltip text */
  tooltipText: PropTypes.string,
  /** Component title */
  title: PropTypes.string,
  /** Whether show ellipsis */
  isEllipsis: PropTypes.bool,
};

export default EllipsisText;
