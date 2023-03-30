import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Button } from 'antd';

const HalfRightButtons = (props) => {
  const {
    className, leftTitle, rightTitle, onClickLeft, onClickRight, disabled, isLoading,
  } = props;
  return (
    <div className={classnames('half-right-buttons-wrapper', className)}>
      <div />
      <div className="footer-buttons">
        <Button
          disabled={isLoading}
          onClick={onClickLeft}
          className="cancel-button"
        >
          {leftTitle}
        </Button>
        <Button
          loading={isLoading}
          type="primary"
          disabled={disabled}
          className="add-button"
          onClick={onClickRight}
        >
          {rightTitle}
        </Button>
      </div>
    </div>
  );
};
HalfRightButtons.defaultProps = {
  className: '',
  leftTitle: 'Cancel',
  rightTitle: 'Add',
  onClickLeft: () => {},
  onClickRight: () => {},
  disabled: false,
  isLoading: false,
};
HalfRightButtons.propTypes = {
  className: PropTypes.string,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default HalfRightButtons;
