import { QuestionCircleOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomButton from '../../Button/customButton';
import './style.scss';

function ConfirmSendCodeModal(props) {
  return (
    <Modal className="modal-send-report" visible={props.visible} closable={false} footer={null} destroyOnClose centered>
      <div className={classnames('confirmation-layout-wrapper', props.className)}>
        <div className="confirmation-layout-body">
          <div className="cl-body-row">
            <QuestionCircleOutlined className="row-icon" />
            <div className="row-title">
              <span>Resend refrence code</span>
            </div>
          </div>
          <div className="mt8 confirm-modal-content">
            Are you sure you want to resend the reference code to
            {props.phoneNumber && (
              <>
                {' '}
                <strong className="nowrap">{`+1 ${props.phoneNumber}`}</strong>
                {' '}
                and
              </>
            )}
            {' '}
            <strong className="nowrap">{props.email}</strong>
            ?
          </div>
        </div>
        <div className="confirmation-layout-footer">
          <div className="cl-footer-buttons">
            <CustomButton className="mr8" onClick={props.toggleClick} disabled={props.isConfirming} label="Cancel" />
            <CustomButton type="primary" onClick={props.onClick} loading={props.isConfirming} label="Resend" />
          </div>
        </div>
      </div>
    </Modal>
  );
}

ConfirmSendCodeModal.defaultProps = {
  visible: false,
  className: '',
  onClick: () => {},
  toggleClick: () => {},
  isConfirming: false,
  phoneNumber: '',
  email: '',
};

ConfirmSendCodeModal.propTypes = {
  visible: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  toggleClick: PropTypes.func,
  isConfirming: PropTypes.bool,
  phoneNumber: PropTypes.string,
  email: PropTypes.string,
};


export default ConfirmSendCodeModal;
