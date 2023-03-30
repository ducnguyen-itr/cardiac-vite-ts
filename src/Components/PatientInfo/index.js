/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  ClockCircleOutlined,
  EnvironmentOutlined, ExclamationCircleFilled, ExclamationCircleOutlined,
  HomeOutlined, MailOutlined, MobileOutlined, PlusOutlined, QuestionCircleOutlined, SwitcherOutlined, UserOutlined,
} from '@ant-design/icons';
import { Popover, Tag, Tooltip } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useEffect, useMemo, useRef,
} from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import fetchCarePlan from '../../Apollo/Functions/Fetch/fetchCarePlan';
import handleDeleteCarePlan from '../../Apollo/Functions/Handle/handleDeleteCarePlan';
import handleSwitchCarePlan from '../../Apollo/Functions/Handle/handleSwitchCarePlan';
import handleUpdateCarePlan from '../../Apollo/Functions/Handle/handleUpdateCarePlan';
import editIcon from '../../Assets/Images/Icons/edit.svg';
import emergencyIcon from '../../Assets/Images/Icons/emergency.svg';
import stethoscopeIcon from '../../Assets/Images/Icons/stethoscope.svg';
import {
  CARE_PLAN_STATUS, CARE_PLAN_TABS, CONFIRMATION_LAYOUT_TYPES, NEW_PATIENTS_TABS,
} from '../../Constants';
import { CARE_PLAN_PROGRAM_TYPE } from '../../Constants/carePlanData';
import EMITTER_CONSTANTS from '../../Constants/emitter';
import { PATIENT_DETAIL_TAB } from '../../Constants/patientDetails';
import { zeroPad } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import {
  useActions, useEmitter, useMergeState,
} from '../../Helpers/customHooks';
import StopHealthCareModal from '../../Pages/PatientDetails/Layout/stopHealthCareModal';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import displayLoading from '../../Redux/Actions/isLoading';
import { setPathRequest } from '../../Redux/Actions/savePath';
import { getTabName } from '../../Utils';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';
import AppointmentDrawer from '../AppointmentDrawer';
import AssignDrawer from '../AssignDrawer/assignDrawer';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import NormalInput from '../Input/NormalInput';
import MissingPatientInfoTag from '../MissingPatientInfoTag';
import SwitchProgramTypeModal from '../Modal/SwitchProgramTypeModal';
import {
  generateCaregiverInfo, mutaionStartHealthCareProgram, mutationResendReferenceCode,
} from '../PatientInfoDrawer/helper';
import PatientTypeTag from '../PatientTypeTag';
import DisplayHealthcareTeam from '../UI/displayHealthcareTeam';
import { formatNoteData, getShowButton } from './helper';
import SmallHeader from './smallHeader';
import './style.scss';

const PatientInfo = (props) => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const hyperName = getTabName(location?.pathname);
  const noteDataRef = useRef('');
  const countDownRef = useRef(undefined);
  const countDownResendRef = useRef(0);

  const actions = useActions({ displayLoading, setPathRequest }, []);
  const input = document.querySelector('.patient-info-detail-popover-input > input');

  const isDetails = props.type === 'DETAILS';
  const {
    firstName, lastName, fullName, carePlanId, photo, dateOfBirth, gender, email,
    address, startDate, createdAt, stopDate, facilityName, patientId, _id, facilityId,
    mobilePhone, countryText, emergencyPhoneText, willDeletedAt,
  } = props?.patientData || {};
  const [state, setState] = useMergeState({
    loading: false,
    isOkLoading: false,
    countDownResend: 0,
    isOpenNote: false,
    isOpenAssignNurse: false,
    isOpenAssignMD: false,
    isShowResendReferenceModal: false,
    isReactivateLoading: false,
    isShowReactivateModal: false,
    isOpenAppointmentDrawer: false,
    isShowDeleteNewCPModal: false,
    isSmallHeader: false,
    isOpenSwitchProgramModal: false,
    programType: undefined,
    elementInput: undefined,
  });

  const [noteData, setNoteData] = useMergeState({});

  const onClickNote = () => {
    const input = document.querySelector('.patient-info-detail-popover-input > textarea');
    if (input) {
      setTimeout(() => {
        if (!state.isSmallHeader) {
          input[0].focus();
        } else {
          input[1].focus();
        }
      }, [50]);
    }
    setState({ elementInput: null });
  };

  const toggleResendReferenceModal = () => {
    setState({ isShowResendReferenceModal: !state.isShowResendReferenceModal });
  };

  const toggleReactivateCarePlanModal = () => {
    setState({ isShowReactivateModal: !state.isShowReactivateModal });
  };

  const onCloseAppointmentDrawer = () => {
    setState({ isOpenAppointmentDrawer: false, patientId: '' });
  };

  const onClickCancelStopHC = () => {
    setState({ stopHCModal: false });
  };

  const onSwitchProgramType = async (isGoOverview, type) => {
    props.switchCarePlan(true);
    if (!isGoOverview) {
      setState({ isOkLoading: true });
    } else {
      actions.setPathRequest({ patientDetailsActiveTab: PATIENT_DETAIL_TAB.CARE_PLAN, careplanActiveTab: CARE_PLAN_TABS.OVERVIEW });
      setState({ isOpenSwitchProgramModal: false });
      props.switchCarePlan(false);
      return;
    }
    try {
      const result = await handleSwitchCarePlan({
        _id: props._id,
        programType: type,
      });

      if (result.isSuccess) {
        props.goToCarePlanTab();
        actions.setPathRequest({ patientDetailsActiveTab: PATIENT_DETAIL_TAB.CARE_PLAN });
        if (result.carePlan?.status === CARE_PLAN_STATUS.NEW) {
          if (auth.isMD()) {
            history.replace(`/patients/new/new-md/${result.carePlan?._id}`);
          } else {
            history.replace(`/patients/new/new-assigned/${result.carePlan?._id}`);
          }
        }
        if (result.carePlan?.status === CARE_PLAN_STATUS.ACTIVE) {
          history.replace(`/patients/active/${result.carePlan?._id}`);
        }
      } else {
        props.switchCarePlan(false);
      }
      setState({ isOpenSwitchProgramModal: false });
    } catch (error) {
      consoleLog(error);
      props.switchCarePlan(false);
    }
    if (!isGoOverview) {
      setState({ isOkLoading: false });
    }
  };

  const onClickOpenStopHCModal = () => {
    setState({ stopHCModal: true });
  };

  const onClickStopHealthCareProgram = () => {
    onClickOpenStopHCModal();
  };

  const completedStopHC = () => {
    setState({ stopHCModal: false, isStarted: false });
    history.replace('/patients/inactive');
  };

  const onClickCreateApt = () => {
    const parseLocation = location.pathname.split('/');
    history.push({
      pathname: `/patients/${parseLocation[2]}/create-appointment/${props._id}`,
      state: {
        isFollowUp: false,
        carePlanId: props._id,
        lastPathName: location?.pathname,
      },
    });
    setState({ isOpenAppointmentDrawer: true, patientId });
  };

  const fetchNoteData = async ({ isFirstTime = false }) => {
    try {
      const result = await fetchCarePlan({ _id: props._id }, 14);
      const noteData = formatNoteData(result);
      setNoteData(noteData);
      if (noteData?.content && isFirstTime) {
        setState({ isOpenNote: true });
      }
      noteDataRef.current = noteData?.content;
    } catch (error) {
      consoleLog(error);
    }
  };

  const updateNote = async () => {
    try {
      await handleUpdateCarePlan({
        _id:
          props._id,
        input: {
          note: {
            content: noteData?.content,
            lastUpdatedAt: moment().toISOString(),
          },
        },
      });
    } catch (error) {
      consoleLog(error);
    }
  };

  const handleStartHC = async (isReactivate = false) => {
    actions.displayLoading(true);
    setState({ isReactivateLoading: true });
    const tempCPId = actions._id || _id;
    const res = await mutaionStartHealthCareProgram(tempCPId, patientId, facilityId);
    setState({ isReactivateLoading: false });
    if (res?.isSuccess) {
      setState({ isStarted: true });
      showSuccessMsg(isReactivate ? 'Reactivate care plan successfully!' : 'Care plan is  started sucessfully!');
      history.replace('/patients/active');
    } else {
      if (res.message === 'Patient already has an ongoing care plan') {
        showFailedMsg('Patient already has an ongoing care plan');
      } else {
        showFailedMsg(`Failed to ${isReactivate ? 'reactivate' : 'start'} care plan!`);
      }
      setState({ isShowReactivateModal: false });
    }
    actions.displayLoading(false);
  };

  const onClickDeleteCarePlan = () => {
    setState({ isShowDeleteNewCPModal: true });
  };

  const handleOpenChangeNote = (newOpen) => {
    setState({ isOpenNote: newOpen });
  };

  const onChangeNote = (name, value) => {
    setNoteData({ content: value });
  };

  const onBlurNote = () => {
    if (noteData?.content !== noteDataRef.current) {
      updateNote();
    }
  };

  const handleClickAssign = (name = '') => {
    if (name === 'Nurse') {
      setState({ isOpenAssignNurse: true });
    } else {
      setState({ isOpenAssignMD: true });
    }
  };

  const onClickSwitchProgramType = () => {
    if (props.patientData.isCCM) {
      setState({ isOpenSwitchProgramModal: true, programType: CARE_PLAN_PROGRAM_TYPE.RPM });
    } else {
      setState({ isOpenSwitchProgramModal: true, programType: CARE_PLAN_PROGRAM_TYPE.CCM });
    }
  };

  const onCloseAssignDrawer = () => {
    setState({ isOpenAssignNurse: false, isOpenAssignMD: false });
  };

  const onClickAssign = async () => {
    if (state?.isOpenAssignMD) {
      setState({ isOpenAssignMD: false });
      return;
    }
    setState({ isOpenAssignNurse: false });
    // props.setPathRequest({ activeNewTab: 'Assigned' });
  };

  const onClickConfirmResendReference = async () => {
    setState({ loading: true });
    const res = await mutationResendReferenceCode(params?.carePlanId);
    if (res) {
      setState({ isShowResendReferenceModal: false, loading: false, countDownResend: 90 });
    } else {
      setState({ isShowResendReferenceModal: false, loading: false });
    }
  };

  const handlePushDeleteTap = () => {
    actions.setPathRequest({ activeNewTab: NEW_PATIENTS_TABS[2], redirecFilter: undefined });
    history.push('/patients/new');
  };

  const onConfirmDeleteCarePlan = async () => {
    setState({ loading: true });
    try {
      const sendingData = {
        _id: params?.carePlanId,
        deletedDate: moment().toISOString(),
      };
      await handleDeleteCarePlan(sendingData);
      setState({ isShowDeleteNewCPModal: false });
      handlePushDeleteTap();
      showSuccessMsg('Care plan deleted successfully!');
    } catch (error) {
      consoleLog(error);
      showFailedMsg('Failed to delete care plan!');
    }
    setState({ loading: false });
  };

  const handleUpdatedNoteListener = ({ carePlan }) => {
    if (carePlan === props._id) {
      fetchNoteData({ isFirstTime: false });
    }
  };

  const handleScroll = (isSmallHeader) => {
    if (isSmallHeader !== state.isSmallHeader) {
      setState({ isSmallHeader });
      input.blur();
    }
  };

  const isShowButtonOrData = useMemo(() => getShowButton(props.patientData, hyperName), [props.patientData, hyperName]);

  // focus note input in the first time
  useEffect(() => {
    const input = document.querySelector('.patient-info-detail-popover-input > textarea');
    if (input) {
      setTimeout(() => {
        input.focus();
      }, [50]);
    }
  }, [state.elementInput]);

  useEffect(() => {
    fetchNoteData({ isFirstTime: true });
  }, []);

  useEffect(() => {
    if (state.countDownResend !== 0 || countDownResendRef.current !== 0) {
      countDownResendRef.current = state.countDownResend - 1;
      countDownRef.current = setTimeout(() => {
        setState({ countDownResend: countDownResendRef.current });
      }, 1000);
    }
    // clearTimeout(countDownRef.current);
  }, [state.countDownResend]);

  useEmitter(EMITTER_CONSTANTS.ON_NOTE_CHANGED, handleUpdatedNoteListener, [props._id]);

  useEmitter(EMITTER_CONSTANTS.IS_SMALL_HEADER, handleScroll, [state?.isSmallHeader]);

  const popoverContent = (
    <div
      className="patient-info-detail-popover-content"
    >
      <NormalInput
        className="patient-info-detail-popover-input"
        name="note"
        autoSize
        type="textarea"
        value={noteData?.content}
        onChange={onChangeNote}
        onBlur={onBlurNote}
        maxLength={500}
      />
      <div className="patient-info-detail-popover-bottom">
        <div className="patient-info-detail-popover-bottom-item">
          <UserOutlined className="patient-info-detail-popover-icon" />
          {noteData?.name || '--'}
        </div>
        <div className="patient-info-detail-popover-bottom-item">
          <ClockCircleOutlined className="patient-info-detail-popover-icon" />
          {noteData?.date ? moment(noteData?.date).format('MM/DD/YYYY hh:mm A') : '--'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {state.isSmallHeader && (
        <SmallHeader
          className="small-patient-detail-info-wrapper"
          patientData={props?.patientData}
          isShowMissing={props.isShowMissing}
          patientMissingData={props.patientMissingData}
          popoverContent={popoverContent}
          isOpenNote={state.isOpenNote}
          handleOpenChangeNote={handleOpenChangeNote}
          onClickNote={onClickNote}
          isShowButtonOrData={isShowButtonOrData}
          isShowSwitchButton={(props.patientData?.isCCM || props.patientData?.isRPM) && _.includes(location.pathname, '/patients/active/')}
          toggleResendReferenceModal={toggleResendReferenceModal}
          onClickCreateApt={onClickCreateApt}
          handleStartHC={handleStartHC}
          onClickStopHealthCareProgram={onClickStopHealthCareProgram}
          toggleReactivateCarePlanModal={toggleReactivateCarePlanModal}
          onClickDeleteCarePlan={onClickDeleteCarePlan}
          onClickSwitchProgramType={onClickSwitchProgramType}
        />
      )}
      <div className={classNames('patient-detail-info-wrapper', props.className)}>
        <div className="patient-info-content">
          <div className="patient-info-avatar">
            <CustomAvatar
              avatarLink={photo}
              size={100}
              firstName={firstName}
              lastName={lastName}
            />
          </div>
          <div className="patient-info-detail">
            <div className="patient-info-detail-top">
              <div className="patient-info-detail-name f-start-cen">
                <span className="patient-info-detail-name-value">{fullName}</span>
                {!!willDeletedAt && (
                  <Tooltip
                    placement="bottomLeft"
                    className="delete-tag-tooltip"
                    title={`The patient has deleted their account since ${moment(willDeletedAt, 'YYYY-MM-DD').subtract(30, 'd').format('MM/DD/YYYY')}`}
                    overlayClassName="delete-tag-tooltip-overlay"
                    getPopupContainer={node => node}
                  >
                    <ExclamationCircleFilled className="delete-tag-icon" />
                  </Tooltip>
                )}
                {props.patientData?.isCCM && <PatientTypeTag className="ml10" title="CCM" isShow isCCM />}
                {props.patientData?.isRPM && <PatientTypeTag className="ml10" title="RPM" isShow />}
                {props.isShowMissing && (
                  <MissingPatientInfoTag
                    className="ml10"
                    patientMissingData={props.patientMissingData}
                  />
                )}
              </div>
              <div className="patient-info-detail-top-item">{`Care plan ID: ${zeroPad(carePlanId) || '--'}`}</div>
              {dateOfBirth && (
                <div className="patient-info-detail-top-item">
                  {`${moment(dateOfBirth).format('MM/DD/YYYY')} (${moment().diff(moment(dateOfBirth), 'year')})`}
                </div>
              )}
              {gender && <div className="patient-info-detail-top-item">{_.capitalize(gender)}</div>}
              {!_.isEmpty(props.patientData) && !state.isSmallHeader && (
                <Popover
                  className="patient-info-detail-popover"
                  content={popoverContent}
                  trigger="click"
                  placement="right"
                  visible={state.isOpenNote}
                  onVisibleChange={handleOpenChangeNote}
                  // getPopupContainer={trigger => trigger}
                  zIndex={9999999999}
                >
                  <CustomButton
                    type="primary"
                    className="patient-info-detail-button-note"
                    onClick={onClickNote}
                    ghost
                    title="Note"
                    icon={<img src={editIcon} alt="" />}
                    label="Note"
                  />
                </Popover>
              )}

            </div>
            <div className="patient-info-detail-bottom">
              <div className="patient-info-detail-bottom-col">
                <div className="patient-info-detail-bottom-col-item">
                  <MailOutlined className="patient-info-detail-bottom-col-item-icon" />
                  {email || '--'}
                </div>
                <div className="patient-info-detail-bottom-col-item">
                  <MobileOutlined className="patient-info-detail-bottom-col-item-icon" />
                  {mobilePhone || '--'}
                </div>
                <div className="patient-info-detail-bottom-col-item">
                  <img src={emergencyIcon} alt="" className="patient-info-detail-bottom-col-item-icon" />
                  {emergencyPhoneText || '--'}
                </div>
              </div>
              <div className="patient-info-detail-bottom-col">
                <div className="patient-info-detail-bottom-col-item">
                  <EnvironmentOutlined className="patient-info-detail-bottom-col-item-icon" />
                  {countryText || '--'}
                </div>
                <div className="patient-info-detail-bottom-col-item">
                  <HomeOutlined className="patient-info-detail-bottom-col-item-icon" />
                  {address || '--'}
                </div>
                <div className="patient-info-detail-bottom-col-item">
                  <img src={stethoscopeIcon} alt="" className="patient-info-detail-bottom-col-item-icon" />
                  {facilityName || '--'}
                </div>
              </div>
              <div className="patient-info-detail-bottom-col">
                <div className="patient-info-detail-bottom-col-item">
                  <div className="patient-info-detail-bottom-col-item-title">Create date:</div>
                  <div className="patient-info-detail-bottom-col-item-value">
                    {createdAt ? moment(createdAt).format('MM/DD/YYYY') : '--'}

                  </div>
                </div>
                {isShowButtonOrData?.isShowStartDate && (
                  <div className="patient-info-detail-bottom-col-item">
                    <div className="patient-info-detail-bottom-col-item-title">Start date:</div>
                    <div className="patient-info-detail-bottom-col-item-value">
                      {startDate ? moment(startDate).format('MM/DD/YYYY') : '--'}

                    </div>
                  </div>
                )}
                {isShowButtonOrData?.isShowStopDate && (
                  <div className="patient-info-detail-bottom-col-item">
                    <div className="patient-info-detail-bottom-col-item-title">Stop date:</div>
                    <div className="patient-info-detail-bottom-col-item-value">
                      {stopDate ? moment(stopDate).format('MM/DD/YYYY') : '--'}

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="patient-info-footer">
          <div className="patient-info-footer-title">Healthcare team</div>
          <div className="patient-info-footer-content">
            <DisplayHealthcareTeam
              className="patient-info-footer-content-left"
              isDetails={isDetails}
              onClickButton={handleClickAssign}
              caregiverInfo={generateCaregiverInfo(props?.patientData)}
              name={hyperName}
            />
            <div className="patient-info-footer-content-right">
              {(props.patientData?.isCCM || props.patientData?.isRPM) && _.includes(location.pathname, '/patients/active/') && (
                <CustomButton
                  type="primary"
                  ghost
                  className="patient-info-footer-btn"
                  onClick={onClickSwitchProgramType}
                  icon={<SwitcherOutlined />}
                  label={props.patientData?.isCCM ? 'Switch to RPM' : 'Switch to CCM'}
                />
              )}
              {isShowButtonOrData?.isShowReferenceCode && (
                <CustomButton
                  type="primary"
                  ghost
                  className="patient-info-footer-btn"
                  onClick={toggleResendReferenceModal}
                  icon={<MailOutlined />}
                  disabled={state.countDownResend !== 0}
                  label={`Resend reference code${state.countDownResend !== 0 ? `(${state.countDownResend})` : ''}`}
                />
              )}
              {isShowButtonOrData?.isShowCreateApt && (
                <CustomButton
                  type="primary"
                  ghost
                  className="patient-info-footer-btn"
                  onClick={onClickCreateApt}
                  icon={<PlusOutlined />}
                  label="Schedule new appointment"
                />
              )}
              {isShowButtonOrData?.isShowStartCarePlan && (
                <CustomButton
                  type="primary"
                  className="patient-info-footer-btn"
                  onClick={() => handleStartHC(false)}
                  label="Start care plan"
                />
              )}
              {isShowButtonOrData?.isShowStopCarePlan && (
                <CustomButton
                  block
                  danger
                  className="patient-info-footer-btn"
                  onClick={onClickStopHealthCareProgram}
                  label="Stop care plan"
                />
              )}
              {isShowButtonOrData?.isShowReactivateCarePlan && (
                <CustomButton
                  type="primary"
                  className="patient-info-footer-btn"
                  onClick={toggleReactivateCarePlanModal}
                  label="Reactivate care plan"
                />
              )}
              {isShowButtonOrData?.isShowDeleteCarePlan && (
                <CustomButton
                  danger
                  className="patient-info-footer-btn"
                  onClick={onClickDeleteCarePlan}
                  label="Delete care plan"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <AssignDrawer
        _id={props._id || _id}
        visible={state.isOpenAssignNurse || state.isOpenAssignMD}
        title={state.isOpenAssignNurse ? 'Assign nurse' : 'Assign physician'}
        type={state.isOpenAssignNurse ? 'nurse' : 'physician'}
        onClose={onCloseAssignDrawer}
        onClickAssign={onClickAssign}
        facilityName={facilityName}
      />
      <ConfirmationLayout
        toggleClick={toggleResendReferenceModal}
        type={CONFIRMATION_LAYOUT_TYPES.RESEND_REFERENCE_CODE}
        visible={state.isShowResendReferenceModal}
        onClick={onClickConfirmResendReference}
        isConfirming={state.isReactivateLoading}
      />
      <AppointmentDrawer
        patientId={params?.carePlanId}
        visible={state.isOpenAppointmentDrawer}
        onCloseDrawer={onCloseAppointmentDrawer}
      />
      <ConfirmationLayout
        toggleClick={toggleReactivateCarePlanModal}
        type={CONFIRMATION_LAYOUT_TYPES.REACTIVATE_CARE_PLAN}
        visible={state.isShowReactivateModal}
        onClick={() => { handleStartHC(true); }}
        isConfirming={state.isReactivateLoading}
        icon={<ExclamationCircleOutlined className="row-icon color-blue-6" />}
      />
      <ConfirmationLayout
        toggleClick={() => { setState({ isShowDeleteNewCPModal: false }); }}
        type={CONFIRMATION_LAYOUT_TYPES.DELETE_NEW_CARE_PLAN}
        visible={state.isShowDeleteNewCPModal}
        onClick={onConfirmDeleteCarePlan}
        isConfirming={state.loading}
        icon={<QuestionCircleOutlined className="row-icon" />}
      />

      <StopHealthCareModal
        _id={props._id || props.patientData._id}
        patientId={props.patientData?.patientId}
        facilityId={props.patientData.facilityId}
        visible={state.stopHCModal}
        onClickCancel={onClickCancelStopHC}
        completedStopHC={completedStopHC}
        name={`${firstName || ''} ${lastName || ''}`}
      />

      <SwitchProgramTypeModal
        visible={state.isOpenSwitchProgramModal}
        programType={state.programType}
        onClose={() => { setState({ isOpenSwitchProgramModal: false, programType: undefined }); }}
        onSubmit={onSwitchProgramType}
        isOkLoading={state.isOkLoading}
      />
    </>
  );
};

PatientInfo.defaultProps = {
  className: '',
  patientData: {},
  type: '',
  _id: '',
  isShowMissing: false,
  patientMissingData: {},
  switchCarePlan: () => { },
  goToCarePlanTab: () => { },
};

PatientInfo.propTypes = {
  /** Component class name */
  className: PropTypes.string,
  /** Patient data */
  patientData: PropTypes.shape(),
  /** type */
  type: PropTypes.string,
  /** id */
  _id: PropTypes.string,
  /** is missing data */
  isShowMissing: PropTypes.bool,
  /** missing data detail */
  patientMissingData: PropTypes.shape(),
  /** switchCarePlan */
  switchCarePlan: PropTypes.func,
  /** goToCarePlanTab */
  goToCarePlanTab: PropTypes.func,
};

export default PatientInfo;
