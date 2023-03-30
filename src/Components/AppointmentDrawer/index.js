import { CalendarOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  Drawer, Select, Space, Spin,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  APPOINTMENT_TYPES, ASSIGN_SELECT_TYPES, CONFIRMATION_LAYOUT_TYPES, RADIO_TYPES,
} from '../../Constants';
import auth from '../../Helpers/auth';
import { useMergeState } from '../../Helpers/customHooks';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { getAttendees } from '../../Utils/calendar';
import { getFullNameId } from '../../Utils/patientsTable';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import AssignSelect from '../Input/assignSelect';
import DatepickerCT from '../Input/datepickerCT';
import InputTitle from '../Input/inputTitle';
import RadioCT from '../Input/radioCT';
import ModalHeader from '../UI/modalHeader';
import AppointmentInfo from './appointmentInfo';
import {
  fetchingUsersAppointmentData, handleCreateAppointment, handleFetchingAppointmentInfo,
  handleFetchingPatientArray, handleFetchingPatientInfo, handleFetchingPatientInfoMissing,
  hanleUpdateAppointment, initState, queryChecExistApt,
} from './helper';
import PatientAppointmentInfo from './patientAppointmentInfo';
import PatientInfoMissing from './PatientInfoMissing';
import './style.scss';

const { Option, OptGroup } = Select;
const APPONTMENT_DRAWER_TYPES = ['CREATE', 'EDIT', 'DISPLAY'];

const AppointmentDrawer = (props) => {
  const oldSearch = useRef(undefined);
  const oldPatientsArray = useRef([]);
  const appointmentData = useRef({});
  const appointmentInfoRef = useRef(undefined);
  const debounceCallingAPI = useRef(0);
  const debounceFetching = useRef(undefined);
  const optimizeCheckingApt = useRef(undefined);

  const [state, setState] = useMergeState({
    ...initState,
    date: props.followUpId ? moment() : undefined,
    loadingOption: false,
    showFailedUpdateModal: false,
  });

  const { onCloseDrawer, visible } = props;

  const {
    current, selectedPatient, patientArray, appointmentType,
    date, time, attendees, patientId, loading, isCancel,
    patientsLoading, status, missingInfo, selectedNurse, selectedMD,
  } = state;

  const fetchingPatientArray = async (search = undefined) => {
    if (oldSearch.current && oldSearch.current === search) {
      return;
    }
    setState({ patientsLoading: true });
    const patientArray = await handleFetchingPatientArray(search);
    oldSearch.current = search;
    oldPatientsArray.current = patientArray;
    setState({ patientsLoading: false, patientArray });
  };

  const callDebounceSearching = (input) => {
    if (debounceFetching.current) {
      clearTimeout(debounceFetching.current);
    }
    debounceFetching.current = setTimeout(() => {
      fetchingPatientArray(input);
    }, 300);
  };

  const fetchingAppointmentInfo = async () => {
    setState({ loading: true });
    const obj = await handleFetchingAppointmentInfo(props._id);
    // const { facilityId } = obj?.selectedPatient;
    // const nurseData = await fetchingUsersAppointmentData(facilityId, true);
    // const physicianData = await fetchingUsersAppointmentData(facilityId, false);
    if (_.isEmpty(obj)) {
      setState({ loading: false });
    } else {
      setState({
        ...obj, loading: false, current: APPONTMENT_DRAWER_TYPES[2],
      });
    }
  };

  const fetchingPatientInfo = async () => {
    setState({ loading: true });
    const obj = await handleFetchingPatientInfo(props.patientId);
    const { facilityId } = obj?.selectedPatient;
    const nurseData = await fetchingUsersAppointmentData(facilityId, true);
    const physicianData = await fetchingUsersAppointmentData(facilityId, false);
    setState({
      ...obj, nurseData, physicianData, loading: false,
    });
  };

  const fetchCheckExisApt = async () => {
    const shouldCheck = _.isEmpty(optimizeCheckingApt.current)
      || !_.isEqual({
        date: state.date,
        time: state.time,
        selectedMD: state.selectedMD,
        selectedNurse: state.selectedNurse,
        selectedPatient: state.selectedPatient,
      }, optimizeCheckingApt.current);

    if (shouldCheck) {
      const res = await queryChecExistApt(state.date, state.time, state.attendees, state.selectedNurse, state.selectedMD, appointmentData.current);
      if (!_.isEmpty(res)) {
        setState(res);
        optimizeCheckingApt.current = {
          date: state.date,
          time: state.time,
          selectedPatient: state.selectedPatient,
          selectedMD: state.selectedMD,
          selectedNurse: state.selectedNurse,
        };
      }
    }
  };

  const onClickCancel = () => {
    const {
      appointmentType, date, time, attendees, selectedNurse, selectedMD,
    } = appointmentData.current;
    setState({
      current: APPONTMENT_DRAWER_TYPES[2],
      appointmentType,
      date,
      time,
      attendees,
      selectedNurse,
      selectedMD,
      selectedNurseError: '',
      selectedMDError: '',
    });
    appointmentData.current = {};
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

  const isDisabledInput = () => {
    const isEdit = current === APPONTMENT_DRAWER_TYPES[1];
    const userId = auth.userId();
    const lastAttendees = [selectedNurse, selectedMD];
    const isChangeTypeOrTime = !_.isEqual(
      {
        appointmentType: appointmentData?.current?.appointmentType,
        date: appointmentData?.current?.date,
        time: appointmentData?.current?.time,
      },
      {
        appointmentType,
        date: moment(date).toISOString(),
        time: moment(time).toISOString(),
      },
    );
    if (isEdit && isChangeTypeOrTime) {
      let isDisabled = true;
      _.forEach(lastAttendees, (x) => {
        if (x.userId === userId) {
          isDisabled = false;
        }
      });
      return isDisabled;
    }
    return false;
  };
  const updateAppointment = async (isCancel = false) => {
    if (moment().valueOf() - debounceCallingAPI.current < 300) {
      return;
    }
    debounceCallingAPI.current = moment().valueOf();
    setState({ loading: true });
    const obj = await hanleUpdateAppointment(isCancel, {
      date, time, attendees, appointmentType, selectedNurse, selectedMD,
    }, props._id);

    if (_.isEmpty(obj)) {
      setState({ loading: false });
      onCloseDrawer();
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

  const onDeleteTag = () => {
    setState({
      patientId: '', selectedPatient: {}, missingInfo: [], attendees: [],
    });
  };

  const isDisabledCreate = (isEdit = false) => {
    if (!selectedPatient?.userId || !appointmentType || !date || !time || (_.isEmpty(selectedMD) && _.isEmpty(selectedNurse))) {
      return true;
    }
    if (state.selectedMDError || state.selectedNurseError) {
      return true;
    }
    if (isEdit && _.isEqual({
      ...appointmentData.current,
      selectedNurse: appointmentData.current?.selectedNurse?.userId,
      selectedMD: appointmentData.current?.selectedMD?.userId,
    }, {
      appointmentType,
      date: moment(date).toISOString(),
      time: moment(time).toISOString(),
      attendees,
      selectedNurse: selectedNurse?.userId,
      selectedMD: selectedMD?.userId,
    })) {
      return true;
    }
    return false;
  };

  const onClickEditAppointment = () => {
    appointmentData.current = {
      appointmentType,
      date,
      time,
      attendees: _.cloneDeep(attendees),
      selectedNurse: _.cloneDeep(selectedNurse),
      selectedMD: _.cloneDeep(selectedMD),
    };
    setState({ current: APPONTMENT_DRAWER_TYPES[1] });
  };

  const isShowJoinButton = () => {
    const meId = auth.getLoginData()._id;
    const isAttendee = _.find(attendees, x => x.isCheck && x?._id === meId);
    if (!isAttendee) return false;
    return appointmentType === APPOINTMENT_TYPES[0]
      && moment().isBetween(moment(date).subtract(15, 'minutes'), moment(date).add(120, 'minutes'), undefined, '[]')
      && !isCancel
      && status !== 'Inactive';
  };

  const isDisabledOption = (optionUserId = '', isNurse = false, isDisabled = false) => {
    if (current !== APPONTMENT_DRAWER_TYPES[1]) return isDisabled;
    if (isNurse) {
      if (moment(time).toISOString() === appointmentData.current?.time && moment(date).toISOString() === appointmentData.current?.date) {
        return (optionUserId !== appointmentData.current?.selectedNurse?.userId) && isDisabled;
      }
      return isDisabled;
    }
    if (moment(time).toISOString() === appointmentData.current?.time && moment(date).toISOString() === appointmentData.current?.date) {
      return (optionUserId !== appointmentData.current?.selectedMD?.userId) && isDisabled;
    }
    return isDisabled;
  };

  const fetchOption = async (date = '', time = '') => {
    setState({ loading: true });
    const { selectedPatient } = state;
    const nurseData = await fetchingUsersAppointmentData(selectedPatient?.facilityId, true, date, time);
    const physicianData = await fetchingUsersAppointmentData(selectedPatient?.facilityId, false, date, time);
    setState({ nurseData, physicianData, loading: false });
  };

  useEffect(() => {
    if (props.visible) {
      if (props._id) {
        fetchingAppointmentInfo();
      } else if (props.patientId) {
        fetchingPatientInfo();
      } else {
        setState({ // RESET STATES
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
      const missingInfo = await handleFetchingPatientInfoMissing(selectedPatient.carePlanId);
      const nurseData = await fetchingUsersAppointmentData(selectedPatient.facilityId, true);
      const physicianData = await fetchingUsersAppointmentData(selectedPatient.facilityId, false);
      setState({
        attendees, selectedPatient, missingInfo, nurseData, physicianData, loading: false,
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
      fetchCheckExisApt();
    }
  }, [state.date, state.time, state.selectedPatient, state.selectedMD, state.selectedNurse]);


  useEffect(() => {
    if (props.visible && state.current !== APPONTMENT_DRAWER_TYPES[2]) {
      if (state.date && state.time) {
        fetchOption(state.date, state.time);
      }
    }
  }, [state.date, state.time, state.current]);


  const isAssignedNurse = useMemo(() => !!state.selectedPatient?.nurse?._id, [state.selectedPatient]);
  const isAssignedMD = useMemo(() => !!state.selectedPatient?.physician?._id, [state.selectedPatient]);
  const assignedNurseOption = useMemo(() => {
    const { nurseData } = state;
    const nurseAssign = _.find(nurseData, x => x.userId === state.selectedPatient?.nurse?._id);

    const nurseAssignData = nurseAssign || {
      userId: state.selectedPatient?.nurse?._id,
      firstName: state.selectedPatient?.nurse?.firstName,
      lastName: state.selectedPatient?.nurse?.lastName,
      photo: state.selectedPatient?.nurse?.photo,
      fullName: getFullNameId(state.selectedPatient?.nurse, auth.userId()),
      disabled: state.isDisAvailabledMD,
    };
    return _.clone(nurseAssignData);
  }, [state.nurseData, state.time, state.date]);

  const assignedMDOption = useMemo(() => {
    const { physicianData } = state;
    const physicianAssign = _.find(physicianData, x => x.userId === state.selectedPatient?.physician?._id);
    const physicianAssignData = physicianAssign || {
      userId: state.selectedPatient?.physician?._id,
      firstName: state.selectedPatient?.physician?.firstName,
      lastName: state.selectedPatient?.physician?.lastName,
      photo: state.selectedPatient?.physician?.photo,
      fullName: getFullNameId(state.selectedPatient?.physician, auth.userId()),
      disabled: state.isDisAvailabledMD,
    };
    return _.clone(physicianAssignData);
  }, [state.physicianData, state.time, state.date]);


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
        <div className="appointment-drawer-b-title">
          Patient
        </div>

        {
          isEdit
            || ((props._id || props.patientId) && selectedPatient?.userId)
            ? (
              <PatientAppointmentInfo
                className="mt4"
                data={selectedPatient}
              />
            ) : (
              <>
                <div className="appointment-drawer-sub-title">
                  Search by patient name
                </div>
                <AssignSelect
                  name="patientId"
                  className="mt4"
                  data={patientArray}
                  value={patientId}
                  valueItem={selectedPatient}
                  onChange={onChange}
                  onDeleteTag={onDeleteTag}
                  type={ASSIGN_SELECT_TYPES.APPOINTMENT}
                  onSearch={callDebounceSearching}
                  loading={patientsLoading}
                />
              </>
            )
        }
        {(patientId || !_.isEmpty(selectedPatient)) && (

          <>
            <div className="appointment-drawer-b-title mt24">
              Appointment information
            </div>

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

            <RadioCT
              title="Appointment type"
              name="appointmentType"
              data={APPOINTMENT_TYPES}
              value={appointmentType}
              onChange={onChange}
              type={RADIO_TYPES.APPOINTMENT}
              className="mt12"
            />
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
              value={state.selectedNurse?.fullName}
              notFoundContent={state.loadingOption ? <Spin size="small" /> : 'No data'}
            >
              {isAssignedNurse ? (
                <>
                  <OptGroup label="Assigned nurse">
                    <Option disabled={isDisabledOption(assignedNurseOption?.userId, true, assignedNurseOption?.disabled, assignedNurseOption?.firstName)} className="appointment-option ml-12" value={assignedNurseOption?.userId} label={assignedNurseOption?.fullName}>
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
                      {isDisabledOption(assignedNurseOption?.userId, true, assignedNurseOption?.disabled) && <div className="not-available">Busy</div>}
                    </Option>
                  </OptGroup>
                  <OptGroup label="Others">
                    {
                      _.map(state.nurseData.filter(x => x.userId !== state.selectedPatient?.nurse?._id), (x, i) => (
                        <Option disabled={isDisabledOption(x.userId, true, x?.disabled, x?.firstName)} className="appointment-option ml-12" key={i} value={x.userId} label={x?.fullName}>
                          <div className="search-option">
                            <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                            <div className="search-option-name">
                              {x?.fullName}
                            </div>
                          </div>
                          {isDisabledOption(x.userId, true, x?.disabled) && <div className="not-available">Busy</div>}
                        </Option>
                      ))
                    }
                  </OptGroup>
                </>
              ) : (
                <>
                  {
                    _.map(state.nurseData, (x, i) => (
                      <Option disabled={isDisabledOption(x.userId, true, x?.disabled, x?.firstName)} className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                        <div className="search-option">
                          <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                          <div className="search-option-name">
                            {x?.fullName}
                          </div>
                        </div>
                        {isDisabledOption(x.userId, true, x?.disabled) && <div className="not-available">Busy</div>}
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
              value={state.selectedMD?.fullName}
              notFoundContent={state.loadingOption ? <Spin size="small" /> : 'No data'}
            >
              {isAssignedMD ? (
                <>
                  <OptGroup label="Assigned physician">
                    <Option disabled={isDisabledOption(assignedMDOption?.userId, false, assignedMDOption?.disabled)} className="appointment-option ml-12" value={assignedMDOption?.userId} label={assignedMDOption?.fullName}>
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
                      {isDisabledOption(assignedMDOption?.userId, false, assignedMDOption?.disabled) && <div className="not-available">Busy</div>}
                    </Option>
                  </OptGroup>
                  <OptGroup label="Others">
                    {
                      _.map(state.physicianData.filter(x => x.userId !== state.selectedPatient?.physician?._id), (x, i) => (
                        <Option disabled={isDisabledOption(x.userId, false, x?.disabled)} className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                          <div className="search-option">
                            <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                            <div className="search-option-name">
                              {x?.fullName}
                            </div>
                          </div>
                          {isDisabledOption(x.userId, false, x?.disabled) && <div className="not-available">Busy</div>}
                        </Option>
                      ))
                    }
                  </OptGroup>
                </>
              ) : (
                <>
                  {
                    _.map(state.physicianData, (x, i) => (
                      <Option disabled={isDisabledOption(x.userId, false, x?.disabled)} className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                        <div className="search-option">
                          <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                          <div className="search-option-name">
                            {x?.fullName}
                          </div>
                        </div>
                        {isDisabledOption(x.userId, false, x?.disabled) && <div className="not-available">Busy</div>}
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
                <div className="footer-btns">
                  <CustomButton
                    disabled={loading}
                    onClick={onClickCancel}
                    label="Cancel"
                  />
                  <CustomButton
                    block
                    type="primary"
                    disabled={isDisabledCreate(isEdit)}
                    onClick={() => updateAppointment()}
                    label="Save"
                  />
                </div>
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
        )}
      </div>
    </div>
  );

  const renderMainView = () => {
    switch (current) {
      case APPONTMENT_DRAWER_TYPES[0]:
        return renderAppointment();
      case APPONTMENT_DRAWER_TYPES[1]:
        return renderAppointment(true);
      case APPONTMENT_DRAWER_TYPES[2]:
        return (
          <AppointmentInfo
            ref={appointmentInfoRef}
            onCloseDrawer={onCloseDrawer}
            selectedPatient={selectedPatient}
            data={{
              date,
              time,
              appointmentType,
              isCancel,
              _id: props._id,
            }}
            attendees={attendees}
            onClickEditAppointment={onClickEditAppointment}
            updateAppointment={updateAppointment}
            isJoin={isShowJoinButton()}
          />
        );
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
AppointmentDrawer.defaultProps = {
  visible: false,
  _id: '', // appointmentID
  onCloseDrawer: () => { },
  followUpId: undefined,
  patientId: '',
};
AppointmentDrawer.propTypes = {
  visible: PropTypes.bool,
  _id: PropTypes.string,
  onCloseDrawer: PropTypes.func,
  followUpId: PropTypes.string,
  patientId: PropTypes.string,
};

export default AppointmentDrawer;
