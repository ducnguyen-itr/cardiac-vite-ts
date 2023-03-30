import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomButton from './customButton';


const FullWidthButtons = (props) => {
  const {
    className, leftTitle, rightTitle, onClickLeft, onClickRight, disabled, isLoading,
  } = props;
  return (
    <div className={classnames('full-width-buttons-wrapper', className)}>
      {leftTitle ? (
        <CustomButton
          disabled={isLoading}
          onClick={onClickLeft}
          className="button-with"
          label={leftTitle}
        />

      ) : <div />}

      <CustomButton
        loading={isLoading}
        type="primary"
        disabled={disabled}
        className="button-with"
        onClick={onClickRight}
        label={rightTitle}
      />
    </div>
  );
};
FullWidthButtons.defaultProps = {
  className: '',
  leftTitle: '',
  rightTitle: '',
  onClickLeft: () => {},
  onClickRight: () => {},
  disabled: false,
  isLoading: false,
};
FullWidthButtons.propTypes = {
  className: PropTypes.string,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default FullWidthButtons;
