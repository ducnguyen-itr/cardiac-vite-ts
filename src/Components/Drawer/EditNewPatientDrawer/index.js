import { Drawer } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CONFIRMATION_LAYOUT_TYPES, MessageData } from '../../../Constants';
import { PROGRAM_TYPE_OPTIONS } from '../../../Constants/newPatientData';
import { DEFAULT_COUNTRY } from '../../../Constants/patientDetails';
import { useMergeState } from '../../../Helpers/customHooks';
import { formatPhoneNumber } from '../../../Pages/Patients/AddNewPatients/helper';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { isValidPhone } from '../../../Utils/patientFormat';
import CustomButton from '../../Button/customButton';
import InputCT from '../../Input/inputCT';
import PhoneNumberInput from '../../Input/PhoneNumberInput';
import RadioCT from '../../Input/radioCT';
import SelectCTV2 from '../../Input/selectCTV2';
import ModalHeader from '../../UI/modalHeader';
import isValid, { isDisabledSave } from './helper';
import './style.scss';


const EditNewPatientDrawer = (props) => {
  const {
    onClickSave, visible, onClickCancel, patientInfo,
  } = props;
  const [state, setState] = useMergeState({
    firstName: patientInfo?.firstName || '',
    lastName: patientInfo?.lastName || '',
    email: patientInfo?.email || '',
    phoneNumber: patientInfo?.phoneNumber || '',
    template: patientInfo?.template || '',
    country: patientInfo?.country || _.clone(DEFAULT_COUNTRY),
    isShowPatientExistedModal: false,
    programType: {},
  });

  const [error, setError] = useMergeState({ phoneError: '', programTypeError: '' });

  const {
    firstName, lastName, email, phoneNumber, template,
    isShowPatientExistedModal,
  } = state;

  const setFocusInput = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
    }
  };


  const checkValidForm = async (data) => {
    const errors = { phoneError: '', programTypeError: '' };
    if (_.isEmpty(data.phoneNumber) || !isValidPhone(data?.phoneNumber, data?.country?.alpha2)) {
      _.assign(errors, { phoneError: 'Invalid phone number.' });
    }
    if (_.isEmpty(data.programType)) {
      _.assign(errors, { programTypeError: 'Plan type must be chosen.' });
    }
    setError(errors);
    if (errors.phoneError) {
      setFocusInput('.phone-focus-2');
    }
    if (errors.phoneError || errors.programTypeError) {
      return false;
    }
    return true;
  };

  const onClickSaveBtn = async () => {
    const isValid = await checkValidForm(state);
    if (!isValid) {
      return;
    }
    const {
      firstName, lastName, phoneNumber, email, template, country, programType,
    } = state;
    const patientsClone = _.cloneDeep(props.patients);
    _.remove(patientsClone, props.patientInfo);
    const existedPatient = _.find(patientsClone, x => x.email === email
      && x.phoneNumber === formatPhoneNumber(phoneNumber)
      && x.firstName === firstName && x.lastName === lastName);
    if (existedPatient) {
      setState({ isShowPatientExistedModal: true });
    } else {
      onClickSave({
        phoneNumber,
        firstName: firstName?.trim() || '',
        lastName: lastName?.trim() || '',
        email: email?.trim() || '',
        country: country || {},
        template,
        isError: false,
        programType,
      });
    }
  };
  const onChange = (key, value) => {
    if (error.phoneError) {
      if (key === 'phoneNumber') {
        if (isValidPhone(value, state.country?.alpha2) || value === '') {
          setError({ phoneError: '' });
        }
      }
    }
    if (error.programTypeError && key === 'programType') {
      setError({ programTypeError: '' });
    }
    setState({ [key]: value });
  };

  const togglePatientExistedModal = () => {
    setState({ isShowPatientExistedModal: !isShowPatientExistedModal });
  };

  useEffect(() => {
    if (props.visible) {
      setState({
        firstName: patientInfo?.firstName || '',
        lastName: patientInfo?.lastName || '',
        email: patientInfo?.email || '',
        phoneNumber: patientInfo?.phoneNumber || '',
        template: patientInfo?.template || '',
        country: patientInfo?.country || '',
        programType: patientInfo?.programType || {},
      });
      checkValidForm(patientInfo);
    }
  }, [patientInfo, props.visible]);

  const renderNewPatient = () => (
    <div className="add-new-patient-drawer">
      <SelectCTV2
        title="General cardiac template"
        placeholder="Select a template"
        value={template}
        onChange={onChange}
        name="template"
        data={props.templates}
        isObject
      />
      <div className="title">General information</div>
      <div className="add-name-container">
        <InputCT
          className="first-name"
          title="First name"
          placeholder="First name"
          name="firstName"
          value={firstName}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
          errMes={!isValid(undefined, firstName) ? MessageData.InvalidValue : null}
        />
        <InputCT
          className="last-name"
          title="Last name"
          placeholder="Last name"
          value={lastName}
          onChange={onChange}
          name="lastName"
          errMesClassName="div-small-incorrect-mes"
          errMes={!isValid(undefined, lastName) ? MessageData.InvalidValue : null}
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
        errMes={!isValid('email', email) ? MessageData.InvalidValue : null}
      />
      {/* <InputCT
        mask="_"
        format="###-###-####"
        type="NUMBER"
        title="Phone number"
        placeholder="012-345-6789"
        value={phoneNumber}
        onChange={onChange}
        name="phoneNumber"
        errMesClassName="div-small-incorrect-mes"
        errMes={!isValid('phoneNumber', phoneNumber) ? MessageData.InvalidValue : null}
      /> */}
      <PhoneNumberInput
        title="Phone number"
        className="phone-number-add-new phone-focus"
        focusClass="phone-focus-2"
        name="phoneNumber"
        onChange={onChange}
        value={phoneNumber}
        countryValue={state.country}
        countryName="country"
        couldSelect
        isObjectCountry
        errMes={error.phoneError}
      />
      <RadioCT
        isObject
        className="horizontal-pair-radio just-spc-bt mt10"
        name="programType"
        title="Plan type"
        titleClassName="fw-normal mb0"
        data={PROGRAM_TYPE_OPTIONS}
        onChange={onChange}
        value={state.programType}
      />
      {error.programTypeError && <div className="error-message ">{error.programTypeError}</div>}
      <div className="button-container">
        <div className="drawer-btn">
          <CustomButton onClick={onClickCancel} label="Cancel" />
        </div>
        <div className="drawer-btn">
          <CustomButton
            type="primary"
            disabled={isDisabledSave({ state, error })}
            onClick={onClickSaveBtn}
            label="Save"
          />
        </div>
      </div>
    </div>
  );
  return (
    <>
      <Drawer
        width={400}
        placement="right"
        className="edit-add-patient-info-drawer"
        title="Patient information"
        // closable={false}
        onClose={onClickCancel}
        visible={visible}
        maskClosable={false}
      >
        <ModalHeader
          title="Patient information"
          onClick={onClickCancel}
        />
        {renderNewPatient()}
      </Drawer>
      <ConfirmationLayout
        type={CONFIRMATION_LAYOUT_TYPES.PATIENT_EXISTED}
        visible={isShowPatientExistedModal}
        toggleClick={togglePatientExistedModal}
        onClick={togglePatientExistedModal}
      />
    </>
  );
};

EditNewPatientDrawer.defaultProps = {
  visible: false,
};

EditNewPatientDrawer.propTypes = {
  onClickSave: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  onClickCancel: PropTypes.func.isRequired,
  patientInfo: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    template: PropTypes.string,
    country: PropTypes.shape(),
    programType: PropTypes.shape(),
  }).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  patients: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default EditNewPatientDrawer;
