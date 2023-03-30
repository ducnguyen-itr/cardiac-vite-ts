import { CloseOutlined } from '@ant-design/icons';
import {
  Button, Drawer, Input, Modal, notification,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useMergeState } from '../../../Helpers/customHooks';
import CustomButton from '../../Button/customButton';
import { handleSplitAllergies, handleUpdateAllergies } from './helper';
import './style.scss';

const { TextArea } = Input;

const AddAllergyModal = (props) => {
  const showNotificationTime = useRef(0);
  const [state, setState] = useMergeState({
    value: '',
    loading: false,
  });

  // const onChange = (e) => {
  //   e.preventDefault();
  //   setState({ value: e.target.value });
  // };


  const debounceShowNotification = (message) => {
    if (moment().valueOf() - showNotificationTime.current > 5000) {
      notification.error({
        message,
        placement: 'bottomLeft',
        duration: 5,
        onClose: () => {
          showNotificationTime.current = 0;
        },
      });
      showNotificationTime.current = moment().valueOf();
    }
  };


  const onChange = (e) => {
    e.preventDefault();
    const { value } = e.target;

    let lineCount = 0;
    const lineCountLimit = 10;
    // const charactersPerLine = auth.isMD() ? 144 : 176;
    const charactersPerLine = 75;
    const splitedLineBreakValue = value.split(/\r\n|\r|\n/);
    _.remove(splitedLineBreakValue, x => !x); // *: Remove empty lines
    lineCount += splitedLineBreakValue.length; // *: Line count included all line breaks
    _.forEach(splitedLineBreakValue, (splitedLine) => {
      const singleLineCount = Math.ceil(splitedLine.length / charactersPerLine);
      if (singleLineCount > 1) { // *: Add more line count if each single line has larger than 1 line
        lineCount += (singleLineCount - 1);
      }
    });
    if (lineCount > lineCountLimit) {
      debounceShowNotification('Could not add more lines');
    } else {
      setState({ value });
    }
  };


  const setAllergies = (value) => {
    props.setAllergies(value);
  };

  const onCancel = () => {
    props.onCancel();
  };

  const onSave = async () => {
    setState({ loading: true });
    const alleg = handleSplitAllergies(state.value);
    const updatedAllergies = await handleUpdateAllergies(props._id, alleg);
    if (updatedAllergies.isSuccess) {
      setAllergies(alleg);
      setState({ loading: false, value: alleg });
      onCancel();
    }
    setState({ loading: false });
  };

  useEffect(() => {
    if (props.visible && !_.isEmpty(props.allergiesData)) {
      setState({ value: props.allergiesData });
    }
  }, [props.visible]);
  return (
    <Drawer
      className="add-allergy-drawer"
      // title="Add patient’s allergies"
      visible={props.visible}
      okText="Save"
      // okButtonProps={{ loading: state.loading }}
      onOk={onSave}
      onCancel={onCancel}
      // footer={[
      //   <CustomButton key="back" onClick={onCancel} label="Cancel" />,
      //   <CustomButton
      //     disabled={_.isEqual(props.allergiesData, state.value)}
      //     key="submit"
      //     type="primary"
      //     loading={state.loading}
      //     onClick={onSave}
      //     label="Save"
      //   />,
      // ]}
      maskClosable={false}
    >
      <div className="add-allergy-drawer-header">
        <div className="add-allergy-drawer-header-title">
          {!props.allergiesData ? 'Add allergies' : 'Edit allergies'}
        </div>
        <CustomButton
          className="add-allergy-drawer-header-close-btn"
          onClick={onCancel}
          icon={<CloseOutlined />}
        />
      </div>
      <div className="horizol-divider" />
      <div className="add-allergy-drawer-body">
        <div className="instruction">Is there anything the patient’s allergic to?</div>
        <TextArea
          className="allergies-input"
          placeholder="Enter the patient’s allergies ..."
          name="allergy"
          value={state.value}
          onChange={onChange}
          onResize={{ minRows: 4, maxRows: 6 }}
          maxLength={750}
        />
      </div>
      <div className="add-allergy-drawer-footer">
        <CustomButton
          className="save-btn"
          disabled={(!state.value && !props.allergiesData) || _.isEqual(props.allergiesData, state.value)}
          key="submit"
          type="primary"
          loading={state.loading}
          onClick={onSave}
          label={!props.allergiesData ? 'Add' : 'Save'}
        />
      </div>
    </Drawer>
  );
};

AddAllergyModal.defaultProps = {
  visible: false,
  allergiesData: '',
  onCancel: () => { },
  setAllergies: () => { },
};

AddAllergyModal.propTypes = {
  _id: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  allergiesData: PropTypes.string,
  onCancel: PropTypes.func,
  setAllergies: PropTypes.func,
};

export default AddAllergyModal;
