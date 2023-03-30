import Auth from '@aws-amplify/auth';
import { Form, notification } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { useMergeState } from '../../Helpers/customHooks';

import { FullMessageData } from '../../Constants';
import consoleLog from '../../Helpers/consoleLog';
import CustomButton from '../Button/customButton';
import InputCT from '../Input/inputCT';

const { IncorrectDefault } = FullMessageData.Authorization;

const ChangePassword = (props) => {
  const showNotificationTime = useRef(0);

  const [state, setState] = useMergeState({
    currPassword: '',
    currPasswordErr: '',

    newPassword: '',
    newPasswordErr: '',

    confirmPassword: '',
    confirmPasswordErr: '',
    loading: false,
  });

  const debounceShowNotification = () => {
    if (moment().valueOf() - showNotificationTime.current > 5000) {
      notification.error({
        message: 'There is no internet connection',
        placement: 'bottomLeft',
        duration: 5,
        onClose: () => {
          showNotificationTime.current = 0;
        },
      });
      showNotificationTime.current = moment().valueOf();
    }
  };

  const {
    currPassword, newPassword, confirmPassword,
    currPasswordErr, newPasswordErr, confirmPasswordErr,
    loading,
  } = state;

  const onChange = (key, value) => setState({
    [key]: value,
    currPasswordErr: '',
    newPasswordErr: '',
    confirmPasswordErr: '',
  });

  const checkUpdateConditions = () => {
    if (!newPassword || newPassword.length < 8) {
      setState({ newPasswordErr: 'The password must be at least 8 characters' });
      return true;
    }
    if (newPassword !== confirmPassword) {
      setState({ confirmPasswordErr: 'The specified passwords do not match' });
      return true;
    }
    if (newPassword === currPassword) {
      setState({ newPasswordErr: 'The new password must be different from the old password' });
      return true;
    }
    return false;
  };

  const handleChangePassword = async () => {
    if (checkUpdateConditions()) {
      return;
    }
    setState({ loading: true });
    const obj = { loading: false };
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      try {
        await Auth.changePassword(authUser, currPassword, newPassword);
        setState(obj);
        props.handleChangePassword();
      } catch (error) {
        throw error;
      }
    } catch (error) {
      consoleLog('Failed to change password', error);
      switch (error.code) {
        case 'NetworkError':
          debounceShowNotification();
          break;
        default:
          _.assign(obj, { currPasswordErr: IncorrectDefault });
          break;
      }
      setState(obj);
    }
  };

  return (
    <Form>
      <Form.Item className="mb0-mt8" validateStatus={currPasswordErr ? 'error' : undefined}>
        <InputCT
          name="currPassword"
          // className="mt8"
          title="Current password"
          placeholder="Enter current password"
          value={currPassword}
          type="PASSWORD"
          onChange={onChange}
          autoComplete="new-password"
          errMes={currPasswordErr}
          errMesClassName="div-small-incorrect-mes"
        />
      </Form.Item>

      <Form.Item className="mb0-mt16" validateStatus={newPasswordErr ? 'error' : undefined}>
        <InputCT
          name="newPassword"
          // className="mt16"
          title="New password"
          placeholder="Enter new password"
          value={newPassword}
          type="PASSWORD"
          onChange={onChange}
          autoComplete="new-password"
          errMes={newPasswordErr}
          errMesClassName="div-small-incorrect-mes"
        />
      </Form.Item>

      <Form.Item className="mb0-mt16" validateStatus={confirmPasswordErr ? 'error' : undefined}>
        <InputCT
          name="confirmPassword"
          // className="mt16"
          title="Confirm new password"
          placeholder="Enter new password again"
          value={confirmPassword}
          type="PASSWORD"
          onChange={onChange}
          autoComplete="new-password"
          errMes={confirmPasswordErr}
          errMesClassName="div-small-incorrect-mes"
        />
      </Form.Item>

      <CustomButton
        disabled={!currPassword || !newPassword || !confirmPassword}
        className="mt56"
        type="primary"
        block
        onClick={handleChangePassword}
        loading={loading}
        label="Change"
      />
    </Form>
  );
};

ChangePassword.propTypes = {
  handleChangePassword: PropTypes.func.isRequired,
};

export default ChangePassword;
