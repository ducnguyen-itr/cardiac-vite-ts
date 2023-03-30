import {
  Modal, Radio, Space,
} from 'antd';
import './style.scss';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import classnames from 'classnames';

import { useMergeState } from '../../../Helpers/customHooks';
import CustomButton from '../../Button/customButton';


const EnableBioheartMonitorModal = (props) => {
  const [state, setState] = useMergeState({
    reportFrequency: props.reportFrequency || 2,
  });

  const onClickEnable = () => {
    props.onClickEnable(state, props.isEdit);
  };

  const onChangeRadio = (e) => {
    const reportFrequency = e.target.value;
    setState({ reportFrequency });
  };

  const isDisabledSaveBtn = () => {
    const { reportFrequency } = state;
    if (props.isEdit && reportFrequency === props.reportFrequency) {
      return true;
    }
    return false;
  };
  const footerBtns = [
    <div className="action-btns">
      <CustomButton
        key="cancel"
        onClick={props.onClickCancel}
        label="Cancel"
      />
      <CustomButton
        key="create"
        onClick={onClickEnable}
        type="primary"
        loading={props.loading}
        disabled={isDisabledSaveBtn()}
        label={props.isEdit ? 'Save' : 'Enable'}
      />
    </div>,
  ];

  useEffect(() => {
    if (props.visible) {
      setState({ reportFrequency: props.reportFrequency || 2 });
    }
  }, [props.visible]);
  // if (props.isEdit) {
  //   footerBtns.unshift(
  //     <CustomButton
  //       key="disabled"
  //       className="disabled-btn"
  //       onClick={props.onClickDisabled}
  //       danger
  //       loading={props.loading}
  //       label="Disable"
  //     />,
  //   );
  // }

  return (
    <Modal
      className={classnames('enable-bioheart-monitor-modal', props.isEdit ? 'enable-bioheart-monitor-modal-has-disabled-btn' : '')}
      title={props.isEdit ? 'Edit Bioheart monitor' : 'Enable Bioheart monitor'}
      visible={props.visible}
      width={570}
      onCancel={props.onClickCancel}
      footer={footerBtns}
      maskClosable={false}
    >
      <div className="radio-container">
        <div className="sub-title">Report frequency</div>
        <Radio.Group onChange={onChangeRadio} value={state.reportFrequency}>
          <Space>
            <Radio value={2}>2 days</Radio>
            <Radio value={5}>5 days</Radio>
            <Radio value={7}>Weekly</Radio>
          </Space>
        </Radio.Group>
      </div>
    </Modal>
  );
};
EnableBioheartMonitorModal.defaultProps = {
  visible: false,
  loading: false,
  onClickEnable: () => { },
  onClickCancel: () => { },
  onClickDisabled: () => { },
  isEdit: false,
  reportFrequency: '',
};

EnableBioheartMonitorModal.propTypes = {
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onClickEnable: PropTypes.func,
  onClickCancel: PropTypes.func,
  onClickDisabled: PropTypes.func,
  isEdit: PropTypes.bool,
  reportFrequency: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default EnableBioheartMonitorModal;
