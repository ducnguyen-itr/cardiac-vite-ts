import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CloseOutlined } from '@ant-design/icons';
// import _ from 'lodash';
import { Button } from 'antd';

const CloseButton = (props) => {
  const { className, onClick } = props;
  return (
    <Button
      ghost
      onClick={onClick}
      className={classnames('close-button-wrapper', className)}
    >
      <CloseOutlined />
    </Button>
  );
};
CloseButton.defaultProps = {
  className: '',
  onClick: () => {},
};
CloseButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default CloseButton;
