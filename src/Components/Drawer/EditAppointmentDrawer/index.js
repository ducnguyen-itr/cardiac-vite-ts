import {
  CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined, DownOutlined,
} from '@ant-design/icons';
import {
  Drawer, Dropdown, Menu, Select, Space, Spin,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  CONFIRMATION_LAYOUT_TYPES,
} from '../../../Constants';
import { useMergeState, useUpdateEffect } from '../../../Helpers/customHooks';
import { APPOINTMENT_DURATION_OPTIONS, APPOINTMENT_TYPE_OPTIONS } from '../../../Pages/Appointments/CreateAppointment/helper';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { getAttendees } from '../../../Utils/calendar';
import CustomAvatar from '../../Avatar';
import CustomButton from '../../Button/customButton';
import DatepickerCT from '../../Input/datepickerCT';
import InputTitle from '../../Input/inputTitle';
import NormalRadioButton from '../../Input/NormalRadioButton';
import NormalSelect from '../../Input/NormalSelect';
import ModalHeader from '../../UI/modalHeader';
import { CANCEL_APPOINTMENT_TYPES, EDIT_APPOINTMENT_TYPES } from '../EventInfoDrawer/helper';
import {
  fetchAppointmentV2,
  fetchingUsersAppointmentData, handleCreateAppointment, handleFetchingPatientInfoMissing,
  hanleUpdateAppointment, initState,
} from './helper';
import PatientAppointmentInfo from './patientAppointmentInfo';
import PatientInfoMissing from './PatientInfoMissing';
import './style.scss';

const { Option, OptGroup } = Select;
const APPONTMENT_DRAWER_TYPES = ['CREATE', 'EDIT', 'DISPLAY'];

const EditAppointmentDrawer = (props) => {
  const appointmentData = useRef({});
  const appointmentInfoRef = useRef(undefined);
  const debounceCallingAPI = useRef(0);

  const [state, setState] = useMergeState({
    ...initState,
    date: props.followUpId ? moment() : undefined,
    loadingOption: false,
    showFailedUpdateModal: false,
  });

  const { onCloseDrawer, visible } = props;

  const {
    current, selectedPatient, appointmentType,
    date, time, attendees, loading,
    missingInfo, selectedNurse, selectedMD,
    duration,
  } = state;


  const fetchingAppointmentInfo = async () => {
    setState({ loading: true });
    const obj = (await fetchAppointmentV2(props._id))?.appointmentData;
    if (_.isEmpty(obj)) {
      setState({ loading: false });
    } else {
      appointmentData.current = {
        selectedMD: obj?.selectedMD?.userId,
        selectedNurse: obj?.selectedNurse?.userId,
        date: obj?.date,
        time: obj?.time,
        duration: obj.duration,
        appointmentType: obj.appointmentType,
      };
      setState({
        ...obj, loading: false, current: APPONTMENT_DRAWER_TYPES[1],
      });
    }
  };

  const onClickCancel = () => {
    props.onCloseDrawer();
  };

  const onClickCreateAppointment = async () => {
    if (moment().valueOf() - debounceCallingAPI.current < 300) {
      return;
    }
    debounceCallingAPI.current = moment().valueOf();
    setState({ loading: true });
    const obj = await handleCreateAppointment({
      date, time, attendees, appointmentType, selectedNurse, selectedMD,
    }, selectedPatient, props.followUpId, onCloseDrawer);
    setState(obj);
  };

  const updateAppointment = async (isCancel = false, key) => {
    if (moment().valueOf() - debounceCallingAPI.current < 300) {
      return;
    }
    debounceCallingAPI.current = moment().valueOf();
    setState({ loading: true });
    const obj = await hanleUpdateAppointment(isCancel, {
      date,
      time,
      attendees,
      appointmentType,
      selectedNurse,
      selectedMD,
      duration,
      selectedPatient,
    }, props._id, appointmentData.current, key);

    if (_.isEmpty(obj)) {
      setState({ loading: false });
      // onCloseDrawer();
    } else {
      setState({ loading: false, ...obj });
      appointmentData.current = {};
      onCloseDrawer();
      if (isCancel) {
        appointmentInfoRef.current.closeConfirmModal();
        onCloseDrawer();
      }
    }
    setState({ loading: false });
  };

  const toggleCancelModal = () => {
    setState({ showFailedUpdateModal: false });
  };

  const handleCloseDrawer = () => {
    onCloseDrawer();
  };

  const onChange = (key, value) => {
    if (key === 'duration') {
      setState({ [key]: value.value });
      return;
    }
    if (key === 'appointmentType') {
      setState({ [key]: value.target.value });
      return;
    }
    setState({ [key]: value });
  };

  const onChangeNurseSelect = (value) => {
    const item = _.find(state.nurseData, x => x.userId === value);
    setState({ selectedNurse: item });
  };

  const onChangeMDSelect = (value) => {
    const item = _.find(state.physicianData, x => x.userId === value);
    setState({ selectedMD: item });
  };


  const isDisabledCreate = (isEdit = false) => {
    if (state.loadingOption) {
      return true;
    }
    if (!appointmentType || !date || !time || (_.isEmpty(selectedMD) && _.isEmpty(selectedNurse))) {
      return true;
    }
    if (state.selectedMDError || state.selectedNurseError) {
      return true;
    }
    if (isEdit && _.isEqual({
      ...appointmentData.current,
    }, {
      appointmentType,
      date: moment(date).toISOString(),
      duration,
      // attendees,
      selectedNurse: selectedNurse?.userId,
      selectedMD: selectedMD?.userId,
      time: moment(time).toISOString(),
    })) {
      return true;
    }
    return false;
  };

  const fetchOption = async (date = '', time = '', duration = '') => {
    setState({ loadingOption: true });
    const { selectedPatient } = state;
    const nurseData = await fetchingUsersAppointmentData(selectedPatient?.facilityId, true, date, time, duration);
    const physicianData = await fetchingUsersAppointmentData(selectedPatient?.facilityId, false, date, time, duration);
    if (!nurseData.find(x => x.userId === selectedNurse?.userId) && selectedNurse?.userId) {
      setState({ selectedNurse: {} });
    }
    if (!physicianData.find(x => x.userId === selectedMD?.userId) && selectedMD?.userId) {
      setState({ selectedMD: {} });
    }
    setState({ nurseData, physicianData, loadingOption: false });
  };

  const onCancelApm = (e) => {
    const { key } = e || {};
    updateAppointment(false, key);
  };

  useEffect(() => {
    if (props.visible) {
      if (props._id) {
        fetchingAppointmentInfo();
      } else {
        setState({
          ...initState,
          date: props.followUpId ? moment() : undefined,
        });
      }
    } else {
      setState({
        ...initState,
        date: props.followUpId ? moment() : undefined,
      });
    }
  }, [props.visible, props._id, props.patientId]);

  useEffect(async () => {
    if (state.patientId && props.visible) {
      setState({ loading: true });
      const selectedPatient = _.find(state.patientArray, x => x.userId === state.patientId);
      const attendees = getAttendees(selectedPatient);
      const promises = [
        handleFetchingPatientInfoMissing(selectedPatient.carePlanId),
        fetchingUsersAppointmentData(selectedPatient.facilityId, true),
        fetchingUsersAppointmentData(selectedPatient.facilityId, false)];
      const result = await Promise.all(promises);
      setState({
        attendees,
        selectedPatient,
        missingInfo: result[0],
        nurseData: result[1],
        physicianData: result[2],
        loading: false,
      });
    }
  }, [state.patientId, props.visible]);

  useEffect(() => {
    if (
      [
        APPONTMENT_DRAWER_TYPES[0],
        APPONTMENT_DRAWER_TYPES[1],
      ].includes(state.current)
      && state.date && state.time
      && !_.isEmpty(state.selectedPatient)) {
      // fetchCheckExisApt();
    }
  }, [state.date, state.time, state.selectedPatient, state.selectedMD, state.selectedNurse]);

  useUpdateEffect(() => {
    if (props.visible && state.current !== APPONTMENT_DRAWER_TYPES[2]) {
      if (state.date && state.time && state.duration) {
        fetchOption(state.date, state.time, state.duration);
      }
    }
  }, [state.date, state.time, state.current, state.duration]);

  const assignedNurseOption = useMemo(() => {
    const { nurseData } = state;
    const nurseAssign = _.find(nurseData, x => x.userId === state.selectedPatient?.nurse?._id);
    return _.clone(nurseAssign);
  }, [state.nurseData, state.time, state.date]);

  const assignedMDOption = useMemo(() => {
    const { physicianData } = state;
    const physicianAssign = _.find(physicianData, x => x.userId === state.selectedPatient?.physician?._id);
    return _.clone(physicianAssign);
  }, [state.physicianData, state.time, state.date]);

  const isDisabledUpdateAllApm = useMemo(() => {
    const { date } = appointmentData.current || {};
    return moment(state.date).format('YYYY-MM-DDD') !== moment(date).format('YYYY-MM-DDD');
  }, [state.date, appointmentData.current]);

  const menu = (
    <Menu onClick={onCancelApm} className="dropdown-edit-apm-menu">
      {_.map(EDIT_APPOINTMENT_TYPES, (x, i) => (
        <Menu.Item disabled={i === 2 && isDisabledUpdateAllApm} className="dropdown-edit-apm-item" key={i}>
          {x}
        </Menu.Item>
      ))}
    </Menu>
  );

  const renderAppointment = (isEdit = false) => (
    <div className="appointment-drawer">
      <ModalHeader
        className="patient-info-drawer-header"
        title={isEdit ? 'Edit appointment' : 'Create new appointment'}
        onClick={handleCloseDrawer}
      />
      {missingInfo.length > 0 && (
        <PatientInfoMissing missingInfo={missingInfo} />
      )}
      <div className="main-wrapper">
        <>
          <div className="appointment-drawer-b-title mt24">
            Appointment information
          </div>

          <NormalRadioButton
            className="create-appointment-radio-btn mt16"
            title="Appointment type"
            name="appointmentType"
            onChange={onChange}
            value={appointmentType}
            options={APPOINTMENT_TYPE_OPTIONS}
            isNewPatient={!state.selectedPatient?.userId && !state.selectedPatient?.isInvitedPatient}
          />

          {!state.selectedPatient?.userId && !state.selectedPatient?.isInvitedPatient && (
            <div className="in-person-notice">
              Only in-person appointment type is available for patients that have not linked their care plan
            </div>
          )}
          <div className="pair-date-input">
            <DatepickerCT
              name="date"
              title="Date"
              className="mt12"
              value={date}
              onChange={onChange}
              disabledDate="TODAY_FUTURE"
              suffixIcon={<CalendarOutlined />}
            />
            <DatepickerCT
              name="time"
              title="Time"
              className="mt12"
              value={time}
              onChange={onChange}
              suffixIcon={<ClockCircleOutlined />}
              type="TIME"
              placeholder="Select time"
              format="hh:mm A"
              minuteStep={15}
              use12Hours
            />
          </div>

          <NormalSelect
            name="duration"
            className="mt16"
            title="Duration (min)"
            placeholder="Select..."
            options={APPOINTMENT_DURATION_OPTIONS}
            value={state.duration}
            onChange={onChange}
          />

          {selectedPatient.facilityName && (
            <>
              <div className="mt12">
                <span>Clinic</span>
              </div>

              <div className="appointment-drawer-clinic-info">
                <div className="appointment-drawer-clinic-info-title">
                  <span>{selectedPatient.facilityName}</span>
                </div>
                <span>{selectedPatient.facilityAddress}</span>
              </div>
            </>
          )}

          <div className="appointment-drawer-b-title mt20">
            Patient’s information
          </div>
          <PatientAppointmentInfo
            className="mt4"
            data={selectedPatient}
          />

          <div className="appointment-drawer-b-title mt24">
            Attendees
          </div>

          <InputTitle title="Nurse" className="mt12" />
          <Select
            placeholder="Select..."
            optionFilterProp="label"
            onChange={onChangeNurseSelect}
            filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
            showSearch
            allowClear
            value={state.selectedNurse?.fullName}
            disabled={state.loadingOption}
          >
            {!_.isEmpty(assignedNurseOption) ? (
              <>
                <OptGroup label="Assigned nurse">
                  <Option
                    className="appointment-option"
                    value={assignedNurseOption?.userId}
                    label={assignedNurseOption?.fullName}
                  >
                    <div className="search-option">
                      <CustomAvatar
                        avatarLink={assignedNurseOption?.photo}
                        firstName={assignedNurseOption?.firstName}
                        lastName={assignedNurseOption?.lastName}
                      />
                      <div className="search-option-name">
                        {assignedNurseOption?.fullName}
                      </div>
                    </div>
                    {!assignedNurseOption.available && <div className="not-available">Busy</div>}
                  </Option>
                </OptGroup>
                {!_.isEmpty(state.nurseData.filter(x => x.userId !== state.selectedPatient?.nurse?._id))
                  && (
                    <OptGroup label="Others">
                      {
                        _.map(state.nurseData.filter(x => x.userId !== state.selectedPatient?.nurse?._id), (x, i) => (
                          <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                            <div className="search-option">
                              <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                              <div className="search-option-name">
                                {x?.fullName}
                              </div>
                            </div>
                            {!x.available && <div className="not-available">Busy</div>}
                          </Option>
                        ))
                      }
                    </OptGroup>
                  )}

              </>
            ) : (
              <>
                {
                  _.map(state.nurseData, (x, i) => (
                    <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                      <div className="search-option">
                        <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                        <div className="search-option-name">
                          {x?.fullName}
                        </div>
                      </div>
                      {!x.available && <div className="not-available">Busy</div>}
                    </Option>
                  ))
                }
              </>
            )}
          </Select>
          {state?.selectedNurseError && (
            <div className="select-error-message">
              <span>{state?.selectedNurseError}</span>
            </div>
          )}
          <InputTitle title="Physician" className="mt12" />
          <Select
            placeholder="Select..."
            optionFilterProp="label"
            onChange={onChangeMDSelect}
            filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
            showSearch
            allowClear
            value={state.selectedMD?.fullName || null}
            disabled={state.loadingOption}
          >
            {!_.isEmpty(assignedMDOption) ? (
              <>
                <OptGroup label="Assigned physician">
                  <Option className="appointment-option" value={assignedMDOption?.userId} label={assignedMDOption?.fullName}>
                    <div className="search-option">
                      <CustomAvatar
                        avatarLink={assignedMDOption?.photo}
                        firstName={assignedMDOption?.firstName}
                        lastName={assignedMDOption?.lastName}
                      />
                      <div className="search-option-name">
                        {assignedMDOption?.fullName}
                      </div>
                    </div>
                    {!assignedMDOption.available && <div className="not-available">Busy</div>}
                  </Option>
                </OptGroup>
                {!_.isEmpty(state.physicianData.filter(x => x.userId !== state.selectedPatient?.physician?._id)) && (
                  <OptGroup label="Others">
                    {
                      _.map(state.physicianData.filter(x => x.userId !== state.selectedPatient?.physician?._id), (x, i) => (
                        <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                          <div className="search-option">
                            <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                            <div className="search-option-name">
                              {x?.fullName}
                            </div>
                          </div>
                          {!x.available && <div className="not-available">Busy</div>}
                        </Option>
                      ))
                    }
                  </OptGroup>
                )}

              </>
            ) : (
              <>
                {
                  _.map(state.physicianData, (x, i) => (
                    <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                      <div className="search-option">
                        <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                        <div className="search-option-name">
                          {x?.fullName}
                        </div>
                      </div>
                      {!x.available && <div className="not-available">Busy</div>}
                    </Option>
                  ))
                }
              </>
            )}

          </Select>
          {state?.selectedMDError && (
            <div className="select-error-message">
              <span>{state?.selectedMDError}</span>
            </div>
          )}
          {isEdit
            ? (
              <>
                {state?.isRecurring ? (
                  <Dropdown
                    overlay={menu}
                    trigger={['click']}
                    placement="bottomLeft"
                    disabled={isDisabledCreate(isEdit)}
                  >
                    <CustomButton
                      className="w100 mb16 mt16 row-reverse"
                      type="primary"
                      label="Save change"
                      disabled={isDisabledCreate(isEdit)}
                      icon={<DownOutlined />}
                    />
                  </Dropdown>
                ) : (
                  <CustomButton
                    className="w100 mb16 mt16 row-reverse"
                    type="primary"
                    label="Save change"
                    disabled={isDisabledCreate(isEdit)}
                    // icon={<DownOutlined />}
                    onClick={() => updateAppointment(false, '0')}
                  />
                )}
                <CustomButton
                  className="w100"
                  disabled={loading}
                  onClick={onClickCancel}
                  label="Cancel"
                />
              </>
            )
            : (
              <CustomButton
                block
                type="primary"
                className="mt56"
                disabled={isDisabledCreate()}
                onClick={onClickCreateAppointment}
                label="Create"
              />
            )
          }
        </>
      </div>
    </div>
  );

  const renderMainView = () => {
    switch (current) {
      case APPONTMENT_DRAWER_TYPES[0]:
        return renderAppointment();
      case APPONTMENT_DRAWER_TYPES[1]:
        return renderAppointment(true);
      default:
        return null;
    }
  };

  return (
    <Drawer
      width={400}
      placement="right"
      closable={false}
      visible={visible}
    >
      {
        loading && (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        )
      }
      {renderMainView()}
      <ConfirmationLayout
        onClick={toggleCancelModal}
        type={CONFIRMATION_LAYOUT_TYPES.FAILED_TO_UPDATE_APM}
        visible={state.showFailedUpdateModal}
        icon={<CloseCircleOutlined style={{ color: '#F5222D', fontSize: '21px' }} />}
      />
    </Drawer>
  );
};
EditAppointmentDrawer.defaultProps = {
  visible: false,
  _id: '', // appointmentID
  onCloseDrawer: () => { },
  followUpId: undefined,
  patientId: '',
};
EditAppointmentDrawer.propTypes = {
  visible: PropTypes.bool,
  _id: PropTypes.string,
  onCloseDrawer: PropTypes.func,
  followUpId: PropTypes.string,
  patientId: PropTypes.string,
};

export default EditAppointmentDrawer;
