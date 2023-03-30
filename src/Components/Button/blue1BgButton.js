import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';


const Blue1BgButton = (props) => {
  const {
    className, onClick, icon, title, disabled,
  } = props;
  return (
    <div className={classnames('blue1-bg-button-wrapper', className)}>
      <Button
        type="link"
        icon={icon || <PlusOutlined />}
        onClick={onClick}
        disabled={disabled}
      >
        {title}
      </Button>
    </div>
  );
};
Blue1BgButton.defaultProps = {
  className: '',
  onClick: () => {},
  icon: '',
  title: '',
  disabled: false,
};
Blue1BgButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Blue1BgButton;
