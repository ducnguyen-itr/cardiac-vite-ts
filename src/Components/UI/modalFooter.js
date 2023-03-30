import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomButton from '../Button/customButton';

const ModalFooter = props => (
  <div className={classnames('modal-footer-wrapper', props.className)}>

    {
      props.dangerTitle ? (
        <CustomButton
          danger
          className={props.dangerTitle}
          onClick={props.onClickDanger}
          disabled={props.loading}
          label={props.dangerTitle}
        />
      ) : <div />
    }

    <div className="modal-footer-buttons">
      <CustomButton className={props.leftBtnClassName} onClick={props.onClickLeftBtn} disabled={props.loading} label={props.leftTitle} />
      <CustomButton type="primary" onClick={props.onClickRightBtn} disabled={props.disabled} loading={props.loading} label={props.rightTitle} />
    </div>
  </div>
);

ModalFooter.defaultProps = {
  className: undefined,
  disabled: false,
  loading: false,
  leftBtnClassName: 'mr8',
  dangerTitle: '',
  onClickDanger: () => {},
};

ModalFooter.propTypes = {
  className: PropTypes.string,
  leftTitle: PropTypes.string.isRequired,
  rightTitle: PropTypes.string.isRequired,
  onClickRightBtn: PropTypes.func.isRequired,
  onClickLeftBtn: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  leftBtnClassName: PropTypes.string,
  dangerTitle: PropTypes.string,
  onClickDanger: PropTypes.func,
};

export default ModalFooter;
