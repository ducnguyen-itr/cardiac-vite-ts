import { CloseOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomButton from '../Button/customButton';

const ModalHeader = props => (
  <div className={classnames('modal-header-wrapper', props.className)}>
    <div className="modal-header-title">
      <span>{props.title}</span>
    </div>
    {props.isShowBtn && (
      <CustomButton
        ghost
        onClick={props.onClick}
        className={props.btnClassName}
        disabled={props.loading}
        icon={!props.btnTitle ? <CloseOutlined /> : undefined}
        label={props.btnTitle}
      />
    )}
  </div>
);

ModalHeader.defaultProps = {
  className: undefined,
  btnClassName: undefined,
  btnTitle: '',
  loading: false,
  onClick: () => { },
  isShowBtn: true,
};

ModalHeader.propTypes = {
  className: PropTypes.string,
  btnClassName: PropTypes.string,
  title: PropTypes.string.isRequired,
  btnTitle: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  isShowBtn: PropTypes.bool,
};

export default ModalHeader;
