import { Drawer } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useActions, useMergeState } from '../../Helpers/customHooks';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import { isValidEmail } from '../../Utils';
import CustomButton from '../Button/customButton';
import InputCT from '../Input/inputCT';
import ModalHeader from '../UI/modalHeader';
import { isDisabledSaveBtn } from './helper';
import './style.scss';

const EditContactInfoDrawer = (props) => {
  const leavePopUp = useSelector(state => state.leavePopUp);
  const actions = useActions({ setLeavePopRequest }, []);
  const [state, setState] = useMergeState({
    firstName: props.data?.firstName || '',
    lastName: props.data?.lastName || '',
    email: props.data?.email || '',
    phoneNumber: props.data?.phoneNumber || '',
    innitData: {},
  });

  const {
    firstName, lastName, email, phoneNumber, emailErrMes, phoneErr, innitData,
  } = state;
  const onChange = (key, value) => {
    if (key === 'email') {
      setState({ emailErrMes: '' });
    }
    setState({ [key]: value, phoneErr: '' });
  };

  const checkError = () => {
    const obj = {};
    if (phoneNumber && phoneNumber.replaceAll('-', '').length !== 10) {
      _.assign(obj, { phoneErr: 'Phone number formatted incorrectly' });
    } else _.assign(obj, { phoneErr: '' });

    setState({ ...obj });
    return obj;
  };

  const onClickSaveBtn = async () => {
    const errors = await checkError();
    if (errors.phoneErr) return;

    if (emailErrMes) {
      return;
    }
    if (!isValidEmail(email)) {
      setState({ emailErrMes: 'Incorrect email format' });
      return;
    }

    props.onSave(state);
  };

  const onClose = () => {
    if (leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        type: 'DISMISS_UPDATE',
        func: () => {
          props.onClose();
        },
      });
      return;
    }
    props.onClose();
  };

  const onCheckEmail = () => {
    if (email) {
      if (!isValidEmail(email)) {
        setState({ emailErrMes: 'Incorrect email format' });
        return;
      }
      setState({ emailErrMes: '' });
    }
  };

  useEffect(() => {
    if (props.visible) {
      const innitData = {
        firstName: props.data?.firstName || '',
        lastName: props.data?.lastName || '',
        email: props.data?.email || '',
        phoneNumber: props.data?.phoneNumber || '',
      };
      setState({
        firstName: props.data?.firstName || '',
        lastName: props.data?.lastName || '',
        email: props.data?.email || '',
        phoneNumber: props.data?.phoneNumber || '',
        phoneErr: '',
        emailErrMes: '',
        innitData,
      });
    }
  }, [props.data, props.visible]);

  useEffect(() => {
    if (!isDisabledSaveBtn(state, innitData) && !leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({ isUnsaved: true });
    }
    if (isDisabledSaveBtn(state, innitData) && leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({ isUnsaved: false });
    }
  }, [state]);

  const renderMainView = () => (
    <div className="patient-edit-info-drawer">
      <ModalHeader
        className="patient-edit-info-drawer-header"
        title="Edit initial contact info"
        onClick={onClose}
      />
      <div className="patient-edit-info-drawer-form">
        <div className="edit-name-container">
          <InputCT
            className="first-name"
            title="First name"
            placeholder="First name"
            name="firstName"
            value={firstName}
            onChange={onChange}
          />
          <InputCT
            className="last-name"
            title="Last name"
            placeholder="Last name"
            value={lastName}
            onChange={onChange}
            name="lastName"
          />
        </div>

        <InputCT
          className="mb16"
          title="Email"
          placeholder="j.smith@email.com"
          value={email}
          onChange={onChange}
          name="email"
          errMesClassName="div-small-incorrect-mes"
          errMes={emailErrMes}
        // onBlur={onCheckEmail}
        />
        <InputCT
          mask="_"
          format="###-###-####"
          type="NUMBER"
          title="Phone number"
          placeholder="012-345-6789"
          value={phoneNumber}
          onChange={onChange}
          name="phoneNumber"
          errMesClassName="div-small-incorrect-mes"
          errMes={phoneErr}
        />
        <div className="button-container">
          <div className="drawer-btn">
            <CustomButton onClick={onClose} label="Cancel" />
          </div>
          <div className="drawer-btn">
            <CustomButton
              type="primary"
              onClick={onClickSaveBtn}
              disabled={isDisabledSaveBtn(state, innitData)}
              loading={props.loading}
              label="Save"
            />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Drawer
        width={415}
        placement="right"
        closable={false}
        visible={props.visible}
        onClose={onClose}
      >
        {renderMainView()}
      </Drawer>
    </>
  );
};
EditContactInfoDrawer.defaultProps = {
  data: {},
  loading: false,
};

EditContactInfoDrawer.propTypes = {
  data: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default EditContactInfoDrawer;
