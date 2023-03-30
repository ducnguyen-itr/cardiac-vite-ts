import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CustomButton from '../../Button/customButton';
import { CARE_PLAN_PROGRAM_TYPE } from '../../../Constants/carePlanData';
import RadioCT from '../../Input/radioCT';
import { RADIO_TYPES } from '../../../Constants';
import './style.scss';

const SwitchProgramTypeModal = (props) => {
  const [type, setType] = useState(CARE_PLAN_PROGRAM_TYPE.CCM);

  const onClose = () => {
    props.onClose();
  };


  const onChangeType = (name, value) => {
    setType(value);
  };

  const footer = () => {
    if (props.programType === CARE_PLAN_PROGRAM_TYPE.CCM) {
      return (
        <div className="switch-program-type-modal-footer">
          <div className="switch-program-type-modal-right-button-group">
            <CustomButton
              className="switch-program-type-modal-cancel-button"
              onClick={onClose}
              label="Cancel"
            />
            <CustomButton
              className="switch-program-type-modal-submit-button"
              type="primary"
              onClick={e => props.onSubmit(false, type === 'CCM & RPM' ? CARE_PLAN_PROGRAM_TYPE.CCM_RPM : type)}
              loading={props.isOkLoading}
              label="OK"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="switch-program-type-modal-footer">
        <CustomButton
          className="switch-program-type-modal-cancel-button"
          onClick={onClose}
          label="Cancel"
        />

        <div className="switch-program-type-modal-right-button-group">
          <CustomButton
            type="primary"
            ghost
            onClick={e => props.onSubmit(true, CARE_PLAN_PROGRAM_TYPE.RPM)}
            loading={props.isGoOverviewLoading}
            label="Go to Care plan overview"
          />
          <CustomButton
            className="switch-program-type-modal-submit-button"
            type="primary"
            onClick={e => props.onSubmit(false, CARE_PLAN_PROGRAM_TYPE.RPM)}
            loading={props.isOkLoading}
            label="OK"
          />
        </div>
      </div>
    );
  };

  return (
    <Modal
      className={classNames('switch-program-type-modal', props.className)}
      visible={props.visible}
      closable={false}
      onCancel={onClose}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <div className="switch-program-type-modal-container">
        <QuestionCircleOutlined className="switch-program-type-modal-icon" />
        <div className="switch-program-type-modal-content">
          <div className="switch-program-type-modal-title">{`Do you want to switch to ${props.programType}?`}</div>
          <div className="switch-program-type-modal-note">
            {`Switching to ${props.programType} will stop the current care plan and create a new one with the same information from the Demographic and Medical records tabs. Are you sure you want to proceed? `}
            {props.programType === CARE_PLAN_PROGRAM_TYPE.RPM
              && (
              <span>
                <b className="switch-program-type-modal-note-bold">Go to the Care plan overview </b>
                tab if you only want to add or remove RPM.
              </span>
              )}
          </div>
          {props.programType === CARE_PLAN_PROGRAM_TYPE.CCM && (
          <RadioCT
            name="programType"
            className="switch-program-type-modal-radio"
            title="Select plan type"
            data={[CARE_PLAN_PROGRAM_TYPE.CCM, 'CCM & RPM']}
            value={type}
            onChange={onChangeType}
            type={RADIO_TYPES.APPOINTMENT}
          />
          )}
        </div>
      </div>
      {footer()}
    </Modal>
  );
};

SwitchProgramTypeModal.defaultProps = {
  className: '',
  programType: undefined,
  visible: false,
  isGoOverviewLoading: false,
  isOkLoading: false,
  onClose: () => {},
  onSubmit: () => {},
};

SwitchProgramTypeModal.propTypes = {
  /** component class name */
  className: PropTypes.string,
  /** program type */
  programType: PropTypes.string,
  /** visible */
  visible: PropTypes.bool,
  /** isGoOverviewLoading */
  isGoOverviewLoading: PropTypes.bool,
  /** isOkLoading */
  isOkLoading: PropTypes.bool,
  /** onClose */
  onClose: PropTypes.func,
  /** onSubmit */
  onSubmit: PropTypes.func,
};

export default SwitchProgramTypeModal;
