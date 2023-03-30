import {
  ArrowRightOutlined, EditOutlined, ExclamationCircleFilled, ExclamationCircleOutlined, MailOutlined, PlusOutlined, QuestionCircleOutlined,
} from '@ant-design/icons';
import {
  Divider, notification, Space, Spin, Typography,
} from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import fetchPatient from '../../Apollo/Functions/Fetch/fetchPatient';
import handleDeleteCarePlan from '../../Apollo/Functions/Handle/handleDeleteCarePlan';
import { CONFIRMATION_LAYOUT_TYPES, NEW_PATIENTS_TABS, TableNames } from '../../Constants';
import { NEW_PATIENT_MESSAGES } from '../../Constants/newPatientData';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { useActions, useMergeState, useUpdateEffect } from '../../Helpers/customHooks';
import StopHealthCareModal from '../../Pages/PatientDetails/Layout/stopHealthCareModal';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import displayLoading from '../../Redux/Actions/isLoading';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import { setPathRequest } from '../../Redux/Actions/savePath';
import {
  getTabName, isShowCreateAptBtnNew, isShowDeleteCarePlan, isShowStartHCPtBtn, isShowStopHCPBtn, zeroPad,
} from '../../Utils';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';
import AppointmentDrawer from '../AppointmentDrawer';
import AssignDrawer from '../AssignDrawer/assignDrawer';
import ReAssignDrawer from '../AssignDrawer/reAssignDrawer';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import EditContactInfoDrawer from '../EditContactInfoDrawer';
import DisplayCaregiver from '../UI/displayCaregiver';
import DisplayData2 from '../UI/displayData2';
import DisplayData3 from '../UI/displayData3';
import ModalHeader from '../UI/modalHeader';
import {
  generateCaregiverInfo, getBasicAndContact, handleBottomClick, mutaionStartHealthCareProgram,
  mutateDeleteCarePlan,
  mutationEditContactInfo, mutationResendReferenceCode, queryCareplanData, queryResendCode, showGenderAndAge,
} from './helper';

const {
  NewAssigned, NewRegistered, Notification, Monthly,
  Active, NewMD,
} = TableNames;
const EditInitialData = [NewAssigned, Active, NewMD, NewRegistered];

const PatientInfo = (props) => {
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  const hyperName = getTabName(location?.pathname);
  const checkedEmailTimeout = useRef(0);
  const checkedEmail = useRef(undefined);
  const countDownRef = useRef(undefined);
  const countDownResendRef = useRef(0);
  const leavePopUp = useSelector(state => state.leavePopUp);

  const actions = useActions({ setLeavePopRequest, setPathRequest }, []);

  const [state, setState] = useMergeState({
    loading: false,
    patientData: {},
    stopHCModal: false,
    isStarted: _.includes(props.name, 'active'),
    isOpenAssignNurse: false,
    isOpenAssignMD: false,
    isOpenReAssignDrawer: false,
    isOpenAppointmentDrawer: false,
    patientId: '',
    isShowErrorModal: false,
    isShowResendModal: false,
    message: '',
    countDownResend: 0,
    isShowResendReferenceModal: false,
    isShowEditContactDrawer: false,
    editContactInfo: {},
    isShowDeleteModal: false,
    isDeleteButtonLoading: false,
    isShowMessageModal: false,
    isReactivateLoading: false,
    isShowReactivateModal: false,
    isShowDeleteNewCPModal: false,
  });

  const {
    patientData, stopHCModal, isStarted, isOpenAssignNurse, isOpenAssignMD, isShowErrorModal, message, loading,
    isShowResendModal, countDownResend, isShowResendReferenceModal, isShowEditContactDrawer, editContactInfo, isOpenReAssignDrawer,
  } = state;

  const {
    email, lastName, firstName,
    gender, age,
    reason, carePlanId, status, photo,
    facilityName, isNoSF36,
    isUnLinked,
    invitationPhone,
    invitationEmail,
    invitationFirstName,
    invitationLastName,
    invitationFullName,
    // isCognitoCompleted,
    willDeletedAt,
  } = patientData || {};

  const propsName = props.name;

  const isDetails = props.type === 'DETAILS';

  const classNameCT = isDetails ? '' : 'mt16';

  const fetchData = async () => {
    setState({ loading: true });
    const res = await queryCareplanData(props._id);
    _.assign(res, { loading: false });
    setState(res);
  };

  const isEditable = () => {
    // if (props?.patientData?.isUnLinked) return false;
    if (auth.isMD() && hyperName === NewAssigned) return false;
    return EditInitialData.includes(hyperName);
  };

  useEffect(() => {
    if (isDetails) {
      if (!_.isEmpty(props.patientData)) {
        const { nurse, physician } = props.patientData;
        const tagArr = [];
        if (nurse && !_.isEmpty(nurse)) {
          tagArr.push({
            _id: nurse?._id,
            role: nurse?.title,
            firstName: nurse?.firstName,
            lastName: nurse?.lastName,
          });
        }
        if (physician && !_.isEmpty(physician)) {
          tagArr.push({
            _id: physician?._id,
            role: physician?.title,
            firstName: physician?.firstName,
            lastName: physician?.lastName,
          });
        }

        setState({ patientData: props.patientData, tagArr });
      }
    } else if (props._id) {
      fetchData();
    }

    const e = document.getElementsByClassName('ant-drawer-body')[0];
    if (e) {
      e.scrollTo({ top: 0 });
    }
  }, [props._id, props.patientData]);

  useEffect(() => {
    if (countDownResend !== 0 || countDownResendRef.current !== 0) {
      countDownResendRef.current = countDownResend - 1;
      countDownRef.current = setTimeout(() => {
        setState({ countDownResend: countDownResendRef.current });
      }, 1000);
    }
    // clearTimeout(countDownRef.current);
  }, [state.countDownResend]);

  useEffect(() => () => {
    notification.destroy();
  }, []);

  useEffect(() => {
    setState({ isStarted: _.includes(props.name, 'active') });
  }, [props.name]);

  const checkActiveCarePlan = async () => {
    if (checkedEmail.current === email && moment().valueOf() - checkedEmailTimeout.current < 5000) {
      return;
    }
    setState({ loading: true });
    try {
      const patient = await fetchPatient({ email });
      if (!_.isEmpty(patient?.currentCarePlan) && patient?.currentCarePlan?.status !== 'Inactive') {
        showFailedMsg(NEW_PATIENT_MESSAGES.NEW_OR_ACTIVE_CAREPLAN_COPY);
        checkedEmail.current = email;
        checkedEmailTimeout.current = moment().valueOf();
        setState({ loading: false });
        return;
      }
      setState({ loading: false });
      props.setPathRequest({ navigateFromTab: location?.pathname });
      history.push(`/patients/new/create-new-patient/${patientData?._id}`);
    } catch (error) {
      setState({ loading: false });
      consoleLog('Failed to fetch patient', error);
    }
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
    setState({ isOpenAppointmentDrawer: true, patientId: patientData.patientId });
  };

  const onCloseAppointmentDrawer = () => {
    setState({ isOpenAppointmentDrawer: false, patientId: '' });
  };

  const handleClickAssign = (name = '') => {
    if (name === 'Nurse') {
      setState({ isOpenAssignNurse: true });
    } else {
      setState({ isOpenAssignMD: true });
    }
  };

  const onClickEdit = () => {
    setState({ isOpenReAssignDrawer: true });
  };

  const onClickAssign = async () => {
    if (isOpenAssignMD) {
      setState({ isOpenAssignMD: false });
      return;
    }
    setState({ isOpenAssignNurse: false });
    props.setPathRequest({ activeNewTab: 'Assigned' });
  };

  const onBack = () => {
    props.onBack();
  };

  const onClickDelete = async () => {
    setState({ isDeleteButtonLoading: true });
    const deletedCarePlan = await mutateDeleteCarePlan(props._id);
    if (deletedCarePlan?.isSuccess) {
      showSuccessMsg('The care plan has been deleted successfully!');
      onBack();
    } else {
      showFailedMsg(deletedCarePlan?.message);
    }
    setState({ isDeleteButtonLoading: false });
  };

  const completedStopHC = () => {
    setState({ stopHCModal: false, isStarted: false });
    history.replace('/patients/inactive');
  };

  const handleStartHC = async (isReactivate = false) => {
    // if (props.isIncompletedQOL) {
    //   setState({ isShowErrorModal: true, message: MISSING_QOL });
    //   return;
    // }
    // if (_.isEmpty(props.overview) && state.patientData?.isEmptyMedication) {
    //   setState({ isShowErrorModal: true, message: MISSING_OVERVIEW_MEDICATION });
    //   return;
    // }
    // if (_.isEmpty(props.overview)) {
    //   setState({ isShowErrorModal: true, message: MISSING_OVERVIEW });
    //   return;
    // }
    // if (state.patientData?.isEmptyMedication) {
    //   setState({ isShowErrorModal: true, message: MISSING_MEDICATION });
    //   return;
    // }
    props.displayLoading(true);
    setState({ isReactivateLoading: true });
    const tempCPId = props._id || patientData._id;
    const res = await mutaionStartHealthCareProgram(tempCPId, patientData.patientId, patientData.facilityId);
    props.displayLoading(false);
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
  };

  const onClickCancelStopHC = () => {
    setState({ stopHCModal: false });
  };

  const onClickOpenStopHCModal = () => {
    setState({ stopHCModal: true });
  };

  const onCloseAssignDrawer = () => {
    setState({ isOpenAssignNurse: false, isOpenAssignMD: false });
  };

  const onCloseReAssignDrawer = (isChange) => {
    setState({ isOpenReAssignDrawer: false });
    if (isChange) {
      props.fetchDataAfterEdit();
    }
  };

  const onClickEditPatientInfo = () => {
    props.onClickEditPatientInfo(false);
  };

  const onClickMessages = () => {
    setState({ isShowMessageModal: true });
  };

  const onCloseMessageModal = () => {
    setState({ isShowMessageModal: false });
  };

  const toggleErrorModal = () => {
    setState({ isShowErrorModal: !isShowErrorModal, message: '' });
  };

  const toggleResendModal = () => {
    setState({ isShowResendModal: !isShowResendModal });
  };

  const toggleResendReferenceModal = () => {
    setState({ isShowResendReferenceModal: !isShowResendReferenceModal });
  };

  const toggleDeleteCarePlanModal = () => {
    setState({ isShowDeleteModal: !state.isShowDeleteModal });
  };

  const toggleReactivateCarePlanModal = () => {
    setState({ isShowReactivateModal: !state.isShowReactivateModal });
  };

  const toggleEditContactDrawer = () => {
    const editContactInfo = {
      firstName: invitationFirstName || '',
      lastName: invitationLastName || '',
      phoneNumber: invitationPhone || '',
      email: invitationEmail || '',
    };
    setState({ isShowEditContactDrawer: !isShowEditContactDrawer, editContactInfo });
  };

  const onClickConfirmResendLogin = async () => {
    const obj = await queryResendCode(patientData.patientId, email);
    setState(obj);
  };
  const handlePushDeleteTap = () => {
    actions.setPathRequest({ activeNewTab: NEW_PATIENTS_TABS[2] });
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

  const onClickConfirmResendReference = async () => {
    setState({ loading: true });
    const res = await mutationResendReferenceCode(params?.carePlanId);
    if (res) {
      setState({ isShowResendReferenceModal: false, loading: false, countDownResend: 90 });
    } else {
      setState({ isShowResendReferenceModal: false, loading: false });
    }
  };

  const onClickSaveEditContact = async (state) => {
    setState({ loading: true });
    try {
      const res = await mutationEditContactInfo(state, params?.carePlanId);
      if (res) {
        setState({ isShowEditContactDrawer: false });
        showSuccessMsg('Initial contact info updated successfully!');
        props.fetchDataAfterEdit();
        setState({ loading: false });
      }
    } catch (error) {
      showFailedMsg('Failed to update Initial contact info!');
      consoleLog('failed to update contact information');
    }
    setState({ loading: false });
    setState({ isShowEditContactDrawer: false });
    actions.setLeavePopRequest({ isUnsaved: false });
  };

  const {
    basicInfo, contactInfo, invationInfo, insuranceInfo, info,
  } = getBasicAndContact(patientData);

  const onClickBottomButton = (e) => {
    const pathName = handleBottomClick(
      propsName, patientData?._id, status, params?.reportId, props.setPathRequest, patientData?.physician?._id, patientData?.nurse?._id,
    );
    if ((hyperName === Notification || hyperName === Monthly || location?.pathname.includes('on-demand')) && leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        func: () => history.push(pathName),
      });
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    history.push(pathName);
  };

  const showInfoTitle = () => (
    <div className="patient-info-title">
      <Typography.Title level={4}>
        {firstName || lastName ? `${firstName} ${lastName}` : invitationFullName || ''}
      </Typography.Title>

      <div className={classnames('patient-info-subtitle', 'f-row')}>
        <div className={props.patientData?.dateOfBirth || props.patientData?.gender ? 'patient-id' : ''}>
          <span>
            {carePlanId ? `Care plan ID: ${zeroPad(carePlanId)}` : ''}
          </span>
        </div>
        <div className="padl16">
          <span>
            {showGenderAndAge(props.patientData)}
          </span>
        </div>
      </div>
    </div>
  );

  const isShowReactiveBtn = () => {
    const isShow = propsName === 'inactive' && isDetails;
    if (willDeletedAt) {
      return (moment(willDeletedAt).valueOf() > moment().valueOf()) && isShow;
    }
    return isShow;
  };


  const isShowCreateAppointmentBtn = () => {
    if (auth.isMD() && _.isEmpty(props.patientData?.physician)) {
      return false;
    }
    return isDetails && isShowCreateAptBtnNew(hyperName);
  };

  const isShowExtraHeader = () => auth.isMD() && hyperName !== 'inactive' && !_.isEmpty(state.patientData.nurse)
    && !_.isEmpty(state.patientData.physician);

  const isStartHCPNurse = () => isDetails && auth.isNurse()
    && propsName === 'new-assigned'
    && isShowStartHCPtBtn(hyperName)
    && !_.isEmpty(state.patientData?.nurse)
    && !_.isEmpty(state.patientData?.physician)
    && (state.patientData.status === 'new');


  const onClickStopHealthCareProgram = () => {
    onClickOpenStopHCModal();
  };

  const onClickDeleteNewCarePlan = () => {
    setState({ isShowDeleteNewCPModal: true });
  };

  const showFooterButon = () => (
    <div className="patient-info-drawer-footer">
      <CustomButton
        ghost
        type="primary"
        className="f1-cen"
        onClick={onClickBottomButton}
        label="Go to patient details"
        isReverse
        icon={<ArrowRightOutlined className="ml4" />}
      />
    </div>
  );

  const getHeaderExtra = () => {
    if (isShowExtraHeader()) {
      if (isStarted) {
        return (
          <CustomButton danger type="primary" ghost onClick={onClickOpenStopHCModal} className="mt8 width100" label="Stop health care program" />
        );
      }
      return (
        <CustomButton
          className="mt8 width100"
          type="primary"
          // disabled={props.patientData?.isDisabledStartCarePlan}
          onClick={() => handleStartHC(false)}
          label="Start health care program"
        />
      );
    }
    return null;
  };

  useUpdateEffect(() => {
    // *: Close drawer
    if (!props._id) {
      setState({ patientData: {} });
    }
  }, [props._id]);

  return (
    <>
      <div className={classnames('patient-info-drawer', props.className)}>
        {
          props.type === 'DRAWER' && (
            <>
              {
                state.loading && (
                  <Space className="loading-space" size="middle">
                    <Spin size="large" />
                  </Space>
                )
              }
              <ModalHeader
                className="patient-info-drawer-header"
                title={firstName && lastName ? `${firstName} ${lastName}` : ''}
                onClick={props.onClose}
              />
            </>
          )
        }

        <div className="patient-info-body">
          {props.isDeleted && (
            <>
              <div className="deleted-notice">
                <ExclamationCircleFilled className="deleted-notice-icon" />
                <div className="deleted-notice-content">
                  {`The patient has deleted their account since ${moment(props.isDeleted).subtract(30, 'd').format('MM/DD/YYYY')}`}
                </div>

              </div>
              {/* {!['active', 'inactive'].includes(hyperName) && (
              <div className="deleted-notice-action-center">
                <CustomButton
                  className="deleted-notice-action-center-btn"
                  type="danger"
                  ghost
                  onClick={toggleDeleteCarePlanModal}
                  label="Delete"
                />
              </div>
            )} */}
              <div className="details-devider" />
            </>
          )}
          <div>
            <CustomAvatar
              avatarLink={photo}
              size={80}
              firstName={props.patientData?.firstName}
              lastName={props.patientData?.lastName}
            />

            {showInfoTitle()}

            {/* always show Edit patient info button */}
            {
              isEditable()
              && (
                <CustomButton
                  type="primary"
                  className="mt12 fcen"
                  block
                  ghost
                  onClick={onClickEditPatientInfo}
                  title="Edit patient info"
                  icon={<EditOutlined />}
                  label=" Edit patient info"
                />
              )
            }
            {!auth.isMD() && isUnLinked && isDetails && isEditable()
              && (
                <CustomButton
                  ghost
                  block
                  type="primary"
                  className="mt8 fcen"
                  style={{ marginTop: '0.5em' }}
                  onClick={toggleResendReferenceModal}
                  disabled={countDownResend !== 0}
                  icon={<MailOutlined className="ml14" />}
                  label={`Resend reference code${countDownResend !== 0 ? `(${countDownResend})` : ''}`}
                />
              )}
            {/* {
              isEditable() && !isUnLinked
              && (
              <Button
                type="primary"
                className="mt12 fcen"
                block
                ghost
                onClick={onClickMessages}
                title="Edit patient info"
                icon={<MessageOutlined />}
              >
                Messages
              </Button>
              )
            } */}
            {
              isDetails && (
                <div className="details-devider" />
              )
            }

            <>
              <DisplayData2
                title="Information"
                data={info}
                isStrip={!isDetails}
                className={classNameCT}
                leftWidth={12}
                titleClassName={isDetails ? 'mb4' : ''}
                rowClassName={isDetails ? 'detail-left-ct' : ''}
              />
              {
                isDetails && (
                  <div className="details-devider" />
                )
              }
              <DisplayData2
                title="Contact information"
                data={contactInfo}
                className={classNameCT}
                isStrip={!isDetails}
                leftWidth={12}
                titleClassName={isDetails ? 'mb4' : ''}
                rowClassName={isDetails ? 'detail-left-ct' : ''}
              />
              {
                isDetails && (
                  <div className="details-devider" />
                )
              }
              <DisplayData2
                title="Insurance information"
                data={insuranceInfo}
                className={classNameCT}
                isStrip={!isDetails}
                leftWidth={12}
                titleClassName={isDetails ? 'mb4' : ''}
                rowClassName={isDetails ? 'detail-left-ct' : ''}
              />
            </>

            {isDetails && <Divider className="div24" />}
            <div className="registered-clinic">
              <span>Registered clinic</span>
            </div>

            <div className="mt8">
              <span>{facilityName}</span>
            </div>

            {!(auth.isMD() && hyperName === NewRegistered) && (
              <>
                {
                  isDetails && (
                    <div className="details-devider" />
                  )
                }
                <DisplayCaregiver
                  className={classNameCT}
                  isDetails={isDetails}
                  onClickButton={handleClickAssign}
                  caregiverInfo={generateCaregiverInfo(patientData)}
                  onClickEdit={onClickEdit}
                  name={hyperName}
                />
              </>
            )}

            {
              isDetails && propsName === 'inactive' && (
                <div className="details-devider" />
              )
            }

            {
              propsName === 'inactive' && (
                <DisplayData3
                  title="Reason for completion"
                  className={classNameCT}
                  data={reason}
                />
              )
            }

            {isShowReactiveBtn() && (
              <>
                <div className="details-devider" />
                <CustomButton
                  className="mt4"
                  block
                  type="primary"
                  label="Reactivate care plan"
                  onClick={toggleReactivateCarePlanModal}
                />
              </>
            )}

            {/* Nurse can start and stop care plan */}

            {
              isDetails && state.patientData.status !== 'inactive' && (
                <Divider className="div24" />
              )
            }
            {
              state.patientData.status !== 'inactive' && (
                <CustomButton
                  block
                  type="primary"
                  ghost
                  className="patient-info-create-apt-btn"
                  onClick={onClickCreateApt}
                  icon={<PlusOutlined />}
                  label="Schedule new appointment"
                />
              )
            }

            {
              isDetails && getHeaderExtra()
            }

            {
              isStartHCPNurse() && (
                <>
                  <CustomButton
                    block
                    type="primary"
                    className="mt8"
                    style={{ marginTop: '0.5em' }}
                    onClick={() => handleStartHC(false)}
                    label="Start health care program"
                  />
                </>
              )
            }
            {
              isDetails && auth.isNurse()
              && isShowStopHCPBtn(hyperName)
              && propsName === 'active'
              && !_.isEmpty(state.patientData?.nurse)
              && !_.isEmpty(state.patientData?.physician)
              && (state.patientData.status === 'active')
              && (
                <>
                  <CustomButton
                    block
                    // type="primary"
                    danger
                    className="mt8"
                    style={{ marginTop: '0.5em' }}
                    onClick={onClickStopHealthCareProgram}
                    label="Stop health care program"
                  />
                </>
              )
            }

          </div>
          {
            isDetails && isShowDeleteCarePlan(hyperName) && (
              <CustomButton
                block
                danger
                className="mt12"
                onClick={onClickDeleteNewCarePlan}
                label="Delete"
              />
            )
          }

          {
            !isDetails && showFooterButon()
          }
        </div>
      </div>

      <StopHealthCareModal
        _id={props._id || patientData._id}
        patientId={patientData.patientId}
        facilityId={patientData.facilityId}
        visible={stopHCModal}
        onClickCancel={onClickCancelStopHC}
        completedStopHC={completedStopHC}
        name={`${firstName || ''} ${lastName || ''}`}
      />

      <AssignDrawer
        _id={props._id || patientData._id}
        visible={isOpenAssignNurse || isOpenAssignMD}
        title={isOpenAssignNurse ? 'Assign nurse' : 'Assign physician'}
        type={isOpenAssignNurse ? 'nurse' : 'physician'}
        onClose={onCloseAssignDrawer}
        onClickAssign={onClickAssign}
        facilityName={facilityName}
      />
      {isOpenReAssignDrawer && (
        <ReAssignDrawer
          _id={props._id || patientData?._id}
          visible={isOpenReAssignDrawer}
          title="Edit caregivers"
          onClose={onCloseReAssignDrawer}
          onClickAssign={onClickAssign}
          facilityId={patientData?.facilityId}
          nurse={patientData?.nurse}
          physician={patientData?.physician}
          facilityName={facilityName}
          status={status}
        />
      )}

      <AppointmentDrawer
        patientId={params?.carePlanId}
        visible={state.isOpenAppointmentDrawer}
        onCloseDrawer={onCloseAppointmentDrawer}
      />

      <ConfirmationLayout
        toggleClick={toggleErrorModal}
        type={CONFIRMATION_LAYOUT_TYPES.INCOMPLETE_INFO}
        visible={isShowErrorModal}
        onClick={toggleErrorModal}
        message={message}
        icon={<ExclamationCircleOutlined className="row-icon color-red-6" />}
      />

      <ConfirmationLayout
        toggleClick={() => { setState({ isShowDeleteNewCPModal: false }); }}
        type={CONFIRMATION_LAYOUT_TYPES.DELETE_NEW_CARE_PLAN}
        visible={state.isShowDeleteNewCPModal}
        onClick={onConfirmDeleteCarePlan}
        isConfirming={loading}
        icon={<QuestionCircleOutlined className="row-icon" />}
      />

      <ConfirmationLayout
        toggleClick={toggleResendModal}
        type={CONFIRMATION_LAYOUT_TYPES.RESEND_LOGIN_INFO}
        visible={isShowResendModal}
        onClick={onClickConfirmResendLogin}
        isConfirming={loading}
      >
        <div className="cl-body-content">
          <span>An email with a new temporary password will be sent to</span>
          <span className="b">{` ${email}`}</span>
          <span>. Are you sure you want to resend this email?</span>
        </div>
      </ConfirmationLayout>

      <ConfirmationLayout
        toggleClick={toggleResendReferenceModal}
        type={CONFIRMATION_LAYOUT_TYPES.RESEND_REFERENCE_CODE}
        visible={isShowResendReferenceModal}
        onClick={onClickConfirmResendReference}
        isConfirming={state.isReactivateLoading}
      />

      <ConfirmationLayout
        toggleClick={toggleDeleteCarePlanModal}
        type={CONFIRMATION_LAYOUT_TYPES.DELETE_CARE_PLAN}
        visible={state.isShowDeleteModal}
        onClick={onClickDelete}
        isConfirming={state.isDeleteButtonLoading}
      />

      <ConfirmationLayout
        toggleClick={toggleReactivateCarePlanModal}
        type={CONFIRMATION_LAYOUT_TYPES.REACTIVATE_CARE_PLAN}
        visible={state.isShowReactivateModal}
        onClick={() => { handleStartHC(true); }}
        isConfirming={state.isReactivateLoading}
        icon={<ExclamationCircleOutlined className="row-icon color-blue-6" />}
      />

      <EditContactInfoDrawer
        visible={isShowEditContactDrawer}
        onClose={toggleEditContactDrawer}
        onSave={onClickSaveEditContact}
        data={editContactInfo}
        loading={loading}
      />
      {/* <MessageBarModal
        visible={state.isShowMessageModal}
        onClose={onCloseMessageModal}
      /> */}
      <div className="container-messsage-modal" />
    </>
  );
};

PatientInfo.defaultProps = {
  className: undefined,
  onClose: () => { },
  _id: '',
  name: '',
  type: '',
  patientData: {},
  onClickEditPatientInfo: () => { },
  fetchDataAfterEdit: () => { },
  isDeleted: '',
  onBack: () => { },
};

PatientInfo.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  _id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  patientData: PropTypes.shape(),
  setPathRequest: PropTypes.func.isRequired,
  displayLoading: PropTypes.func.isRequired,
  onClickEditPatientInfo: PropTypes.func,
  fetchDataAfterEdit: PropTypes.func,
  isDeleted: PropTypes.string,
  onBack: PropTypes.func,
};

const mapStateToProps = state => ({
});
const mapDispatchToProps = {
  setPathRequest,
  displayLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(PatientInfo);
