import { CalendarOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { RADIO_TYPES } from '../../../Constants';
import { GENDER_DATA } from '../../../Constants/newPatientData';
import { useMergeState } from '../../../Helpers/customHooks';
import CustomButton from '../../Button/customButton';
import DatepickerCT from '../../Input/datepickerCT';
import InputCT from '../../Input/inputCT';
import RadioCT from '../../Input/radioCT';
import ModalHeader from '../../UI/modalHeader';
import { isDisabledSaveButton } from './helper';
import './style.scss';


const EditPatientInfoDrawer = (props) => {
  const {
    visible, onClickCancel, patientInfo,
  } = props;
  const [state, setState] = useMergeState({
    firstName: patientInfo?.firstName || '',
    lastName: patientInfo?.lastName || '',
    email: patientInfo?.email || '',
    phoneNumber: patientInfo?.phoneNumber || '',
    gender: '',
    dob: patientInfo?.dob || '',
    height: '',
    weight: '',
    country: '',
    address: '',
    city: '',
    zipCode: '',
    insurance: '',
  });

  const {
    firstName, lastName, phoneNumber,
  } = state;

  const onClickSaveBtn = () => {

  };
  const onChange = (key, value) => {
    setState({ [key]: value });
  };


  useEffect(() => {

  }, [patientInfo]);

  const renderNewPatient = () => (
    <div className="edit-patient-info-drawer">

      <InputCT
        title="First name"
        placeholder="First name"
        name="firstName"
        value={firstName}
        onChange={onChange}
        errMesClassName="div-small-incorrect-mes"
        // errMes={!isValid(undefined, firstName) ? MessageData.InvalidValue : null}
      />
      <InputCT
        title="Last name"
        className="mt16"
        placeholder="Last name"
        value={lastName}
        onChange={onChange}
        name="lastName"
        errMesClassName="div-small-incorrect-mes"
        // errMes={!isValid(undefined, lastName) ? MessageData.InvalidValue : null}
      />

      <RadioCT
        name="gender"
        title="Gender"
        titleClassName="fw-normal mb0"
        className="mt16"
        textClass="mt8"
        value={state.gender}
        data={GENDER_DATA}
        onChange={onChange}
        type={RADIO_TYPES.APPOINTMENT}
      />

      <DatepickerCT
        name="dob"
        title="Date of birth"
        className="mt16"
        value={state.dob}
        onChange={onChange}
        disabledDate="PAST"
        suffixIcon={<CalendarOutlined />}
      />


      <div className="group-input-container mt16">
        <InputCT
          className="first-input"
          title="Height"
          placeholder="Height"
          name="height"
          value={state.height}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
        />
        <InputCT
          className="last-input"
          title="Weight"
          placeholder="Weight"
          name="weight"
          value={state.firstName}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
        />
      </div>


      <div className="group-input-container mt16">
        <InputCT
          className="first-input"
          mask="_"
          format="###-###-####"
          type="NUMBER"
          title="Phone number"
          placeholder="012-345-6789"
          value={phoneNumber}
          onChange={onChange}
          name="phoneNumber"
          errMesClassName="div-small-incorrect-mes"
        />
        <InputCT
          className="last-input"
          title="Country"
          placeholder="Country"
          name="weight"
          value={state.firstName}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
        />
      </div>

      <InputCT
        title="Address"
        placeholder="Address"
        name="weight"
        value={state.firstName}
        onChange={onChange}
        errMesClassName="div-small-incorrect-mes"
      />

      <div className="group-input-container mt16">
        <InputCT
          className="first-input"
          title="City"
          placeholder="City"
          name="height"
          value={state.height}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
        />
        <InputCT
          className="last-input"
          title="Zip code"
          placeholder="Zip code"
          name="weight"
          value={state.firstName}
          onChange={onChange}
          errMesClassName="div-small-incorrect-mes"
        />
      </div>

      <InputCT
        title="Insurance"
        placeholder="Insurance"
        name="weight"
        value={state.firstName}
        onChange={onChange}
        errMesClassName="div-small-incorrect-mes"
      />

      <div className="button-container">
        <div className="drawer-btn">
          <CustomButton onClick={onClickCancel} label="Cancel" />
        </div>
        <div className="drawer-btn">
          <CustomButton
            type="primary"
            disabled={isDisabledSaveButton(state)}
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
        className="edit-patient-info-drawer-wrapper"
        title="Patient information"
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
    </>
  );
};

EditPatientInfoDrawer.defaultProps = {
  visible: false,
};

EditPatientInfoDrawer.propTypes = {
  visible: PropTypes.bool,
  onClickCancel: PropTypes.func.isRequired,
  patientInfo: PropTypes.shape().isRequired,
};

export default EditPatientInfoDrawer;
