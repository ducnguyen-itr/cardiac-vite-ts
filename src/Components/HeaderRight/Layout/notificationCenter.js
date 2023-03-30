import { DeleteOutlined, NotificationFilled } from '@ant-design/icons';
import { Drawer, notification, Spin } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import handleDeleteAllNotification from '../../../Apollo/Functions/Handle/handleDeleteAllNotification';
import handleDeleteNotification from '../../../Apollo/Functions/Handle/handleDeleteNotification';
import handleMarkAsReadNotification from '../../../Apollo/Functions/Handle/handleMarkAsReadNotification';
import { CARE_PLAN_TABS, NOTIFICATION_CENTER } from '../../../Constants';
import { HEART_MORNITOR_TABS } from '../../../Constants/carePlan';
import { PATIENT_DETAIL_TAB } from '../../../Constants/patientDetails';
import { getFullName, getFullNameAPT } from '../../../Helpers';
import auth from '../../../Helpers/auth';
import consoleLog from '../../../Helpers/consoleLog';
import { useActions, useMergeState } from '../../../Helpers/customHooks';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { setLeavePopRequest } from '../../../Redux/Actions/leavePopUp';
import { setPathRequest } from '../../../Redux/Actions/savePath';
import {
  checkChangeAppointmentTime,
  formatNotificaiotnTitle, getMedicationString, isChangeAppointment, zeroPad,
} from '../../../Utils';
import CustomButton from '../../Button/customButton';
import ModalHeader from '../../UI/modalHeader';

const {
  SENT_REPORT,
  APPOINTMENT,
  UPDATED_CAREPLAN,
  START_CAREPLAN,
  PATIENT_COMPLETE_PROFILE,
  REPORT_STUDY,
  REQUEST_STUDY,
  DAILY_ENTRY,
  UPDATE_BIOHEART_AUTHORIZED,
  CENCELED_APPOINTMENT,
  REMOVE_ATTENDEE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  NEW_APPOINTMENT,
  NURSE_ASSIGNMENT,
  NURSE_REASSIGNMENT,
  PHYSICIAN_ASSIGNMENT,
  PHYSICIAN_REASSIGNMENT,
  NEW_APPOINTMENT_ASSIGNEE,
  NEW_MEDICATION_ADDED,
  UPDATE_BIOHEART_REPORT_STATUS,
  APPOINTMENT_FINISHED,
  APPOINTMENT_OVERDUE,
  COMPLETED_CARE_PLAN,
  PATIENT_DELETED_ACCOUNT,
  PATIENT_RECOVER_ACCOUNT,
  RESTORE_CARE_PLAN,
  REACTIVE_CAREPLAN,
  DELETED_CARE_PLAN,
} = NOTIFICATION_CENTER;

const {
  CURRENT_STUDY, BIOHEART_MONITOR,
} = HEART_MORNITOR_TABS;

const NotificationCenter = (props) => {
  const history = useHistory();
  const location = useLocation();
  const isAdded = useRef(false);
  const leavePopUp = useSelector(state => state.leavePopUp);
  const actions = useActions({ setLeavePopRequest, setPathRequest }, []);
  const [state, setState] = useMergeState({
    isShowModal: false,
    isLoading: false,
    isDeleteAllLoading: false,
  });

  const delayLoadMore = useRef(0);
  const debounceFetchMore = (limit = 5) => {
    if (moment().valueOf() - delayLoadMore.current > 300) {
      props.fetchMoreNotifications(limit);
      setState({ isLoading: true });
      delayLoadMore.current = moment().valueOf();
    }
  };

  const showNotificationTime = useRef(0);
  const debounceShowNotification = () => {
    if (moment().valueOf() - showNotificationTime.current > 5000) {
      notification.error({
        message: 'Failed to delete notification(s)',
        placement: 'bottomLeft',
        duration: 3,
        onClose: () => {
          showNotificationTime.current = 0;
        },
      });
      showNotificationTime.current = moment().valueOf();
    }
  };

  const bottomScrollListener = () => {
    if (props.isEndOfNotifications) {
      return;
    }
    debounceFetchMore();
  };

  const onNotificationCenterScroll = (e) => {
    const { clientHeight, scrollTop, scrollHeight } = e.target;
    if (clientHeight + scrollTop >= scrollHeight) {
      bottomScrollListener();
    }
  };

  useEffect(() => {
    const element = document.getElementsByClassName('notification-center-body')[0];
    if (element) {
      if (props.visible) {
        if (!isAdded.current) {
          isAdded.current = true;
          element.addEventListener('scroll', onNotificationCenterScroll);
        }
        setState({ isLoading: false });
      } else {
        element.scrollTo({ top: 0 });
      }
    }
    return () => {
      if (isAdded.current) {
        isAdded.current = false;
        element.removeEventListener('scroll', onNotificationCenterScroll);
      }
    };
  }, [props.visible, props.data, props.isEndOfNotifications]);

  const toggleDeleteAll = () => {
    setState({ isShowModal: !state.isShowModal });
  };

  const onClickDeleteAll = async () => {
    setState({ isDeleteAllLoading: true });
    // DELETE ALL IN ONE FACILITY WHICH IS NOT MENTIONED IN US
    try {
      await handleDeleteAllNotification();
      toggleDeleteAll();
      props.onClose();
    } catch (error) {
      consoleLog('Failed to delete all notifications', error);
    }
    setState({ isDeleteAllLoading: false });
  };

  const handleOnclickUpdateCarePlan = (status, _id, key) => {
    let pathname;
    if (status === 'New') {
      if (auth.isMD()) {
        pathname = `/patients/new/new-md/${_id}`;
      } else {
        pathname = `/patients/new/new-registered/${_id}`;
      }
    } else {
      pathname = `/patients/${status.toLowerCase()}/${_id}`;
    }
    if (pathname) {
      if (key === 1) {
        actions.setPathRequest({
          patientDetailsActiveTab: status === 'New'
            ? PATIENT_DETAIL_TAB.CARE_PLAN : PATIENT_DETAIL_TAB.OVERVIEW,
        });
      }
      history.push(pathname);
    }
  };

  const handleGotoHMCurrentStudy = (status, _id) => {
    props.setPathRequest({
      patientDetailsActiveTab: PATIENT_DETAIL_TAB.HEART_MONITOR,
      // careplanActiveTab: HEART_MONITOR,
      heartMonitorActiveTab: CURRENT_STUDY,
    });
    handleOnclickUpdateCarePlan(status, _id);
  };

  const handleGoToHeartMonitorTab = (status, _id) => {
    props.setPathRequest({
      patientDetailsActiveTab: PATIENT_DETAIL_TAB.HEART_MONITOR,
      // careplanActiveTab: HEART_MONITOR,
      heartMonitorActiveTab: BIOHEART_MONITOR,
    });
    handleOnclickUpdateCarePlan(status, _id);
  };

  const handleDailyEntryTab = (status, _id, diff, date, createdAt) => {
    props.setPathRequest({
      patientDetailsActiveTab: PATIENT_DETAIL_TAB.OVERVIEW,
      dailyEntrySelectedDay: date ? moment(date) : moment(createdAt).subtract(diff, 'd'),
    });
    handleOnclickUpdateCarePlan(status, _id);
  };

  const handleCarePlanQOLTab = (status, _id) => {
    props.setPathRequest({
      patientDetailsActiveTab: PATIENT_DETAIL_TAB.CARE_PLAN,
      // careplanActiveTab: HEART_MONITOR,
      careplanActiveTab: CARE_PLAN_TABS.QUALITY_OF_LFIE,
    });
    handleOnclickUpdateCarePlan(status, _id);
  };

  const handleGoTodeleteTab = () => {
    actions.setPathRequest({ activeNewTab: 'Deleted' });
    history.push('/patients/new');
  };

  const handleGoToAppointmentTab = (status, _id, isClinicCalendar, date, appointmentId) => {
    history.push(`/appointments/${appointmentId}`);
  };

  const handleMarkAsRead = async (_id = '', key = 0, allVars = {}, e) => {
    const sendingData = { _id };
    const {
      status, carePlanId, report, isRead, diff, isClinicCalendar, date, editDate, createdAt, appointmentId,
    } = allVars || {};
    if (leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        func: async () => {
          try {
            if (!isRead) {
              await handleMarkAsReadNotification(sendingData);
            }
            let pathname;
            switch (key) {
              case 1:
                handleOnclickUpdateCarePlan(status, carePlanId, key);
                break;
              case 2:
                pathname = `/reports/${report?.type?.toLowerCase()}/${report?._id}`;
                if (pathname && pathname !== location.pathname) {
                  history.push(pathname);
                }
                break;
              case 3:
                handleGotoHMCurrentStudy(status, carePlanId);
                break;
              case 4:
                handleDailyEntryTab(status, carePlanId, diff, null, createdAt);
                break;
              case 5:
                handleGoToAppointmentTab(status, carePlanId, isClinicCalendar, date, appointmentId);
                break;
              case 6:
                handleGoToHeartMonitorTab(status, carePlanId);
                break;
              case 7:
                handleDailyEntryTab(status, carePlanId, 0, editDate);
                break;
              case 8:
                handleCarePlanQOLTab(status, carePlanId, 0, editDate);
                break;
              case 9:
                handleGoTodeleteTab();
                break;
              default:
                break;
            }
            props.onClose();
          } catch (error) {
            // debounceShowNotification();
            consoleLog('Failed to mark notification as read', error);
          }
        },
      });
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    try {
      if (!isRead) {
        await handleMarkAsReadNotification(sendingData);
      }
      let pathname;
      switch (key) {
        case 1:
          handleOnclickUpdateCarePlan(status, carePlanId, key);
          break;
        case 2:
          pathname = `/reports/${report?.type?.toLowerCase()}/${report?._id}`;
          if (pathname && pathname !== location.pathname) {
            history.push(pathname);
          }
          break;
        case 3:
          handleGotoHMCurrentStudy(status, carePlanId);
          break;
        case 4:
          handleDailyEntryTab(status, carePlanId, diff, null, createdAt);
          break;
        case 5:
          handleGoToAppointmentTab(status, carePlanId, isClinicCalendar, date, appointmentId);
          break;
        case 6:
          handleGoToHeartMonitorTab(status, carePlanId);
          break;
        case 7:
          handleDailyEntryTab(status, carePlanId, 0, editDate);
          break;
        case 8:
          handleCarePlanQOLTab(status, carePlanId);
          break;
        case 9:
          handleGoTodeleteTab();
          break;
        default:
          break;
      }
      props.onClose();
    } catch (error) {
      // debounceShowNotification();
      consoleLog('Failed to mark notification as read', error);
    }
  };

  const handleDelete = async (_id) => {
    setState({ loading: true });
    const sendingData = { _id };
    try {
      await handleDeleteNotification(sendingData);
      if (props.data?.length <= 1) {
        props.onClose();
      }
      if (!props.isEndOfNotifications) {
        debounceFetchMore(1);
      }
    } catch (error) {
      debounceShowNotification();
      consoleLog('Failed to delete notification', error);
    }
    setState({ loading: false });
  };

  const getAttendeesName = (attendees = []) => {
    if (_.isEmpty(attendees)) return '';
    let attendeesName = '';
    _.forEach(attendees, (x, i) => {
      if (i === 0) {
        attendeesName += getFullName(x);
      } else {
        attendeesName += `, ${getFullName(x)}`;
      }
    });
    return attendeesName;
  };


  const notiItem = (x = {}, i = 0) => {
    const {
      title, createdAt, body, carePlan, type, report, _id,
    } = x || {};
    const isRead = x?.status === 'Read';
    const formatedTime = moment(createdAt).isValid() ? moment(createdAt).format('hh:mm A - MM/DD/YYYY') : '';
    const patientData = body ? JSON.parse(body) : {};
    const diff = patientData?.diff;
    const formatTitle = formatNotificaiotnTitle(title, type);
    const {
      performedBy, facilityInfo, date,
      user, patient, medications, isAuthorized, reason,
      appointment, oldAppointment, attendeesInfo, patientInfo, performedByInfo, isRecurring,
    } = patientData || {};
    const appointmentType = appointment?.appointmentType || undefined;
    const { isChangeTime, apppointmentTime } = checkChangeAppointmentTime(appointment, oldAppointment);
    const fullName = carePlan?.patientDemographic
      ? getFullName(carePlan?.patientDemographic) : carePlan?.patient ? getFullName(carePlan?.patient) : patientInfo ? getFullNameAPT(patientInfo) : '';
    const PerfomedName = performedBy ? getFullName(performedBy) : '';
    const performedByInfoName = performedByInfo ? getFullName(performedByInfo) : '';
    const isNursePerformed = performedByInfo?.roles?.[0] === 'Clinic Technician';
    const fullNameUser = user ? getFullName(user) : '';
    const dateString = moment(date).format('MM/DD/YYYY');
    const timeString = moment(date).format('hh:mm A');
    const patientName = getFullNameAPT(patient);
    const nonCCMPatientName = getFullNameAPT(patientInfo);
    const { friendlyId, status } = carePlan || {};
    const carePlanId = friendlyId;
    let content = '';
    let onClick;
    switch (type) {
      case UPDATED_CAREPLAN: {
        content = `Care plan of ${fullName} - ${zeroPad(carePlanId)} has been updated, please review changes.`;
        onClick = (e) => {
          handleMarkAsRead(_id, 1, { status, carePlanId: carePlan?._id, isRead }, e);
        };
        break;
      }
      case SENT_REPORT: {
        content = `New notification report of ${fullName} (ID: ${zeroPad(carePlanId)}).`;
        onClick = (e) => { // Mark As Read and Navigate to Report Details Page
          handleMarkAsRead(_id, 2, { report, isRead }, e);
        };
        break;
      }
      case APPOINTMENT: {
        content = `Please contact ${fullName} for the next follow-up schedule tomorrow.`;
        onClick = (e) => { // Mark As Read
          handleMarkAsRead(_id, 0, { isRead }, e);
        };
        break;
      }
      case START_CAREPLAN: {
        content = `Care plan of ${fullName} - ${zeroPad(carePlanId)} has been started. Please view the changes.`;
        onClick = (e) => {
          handleMarkAsRead(_id, 1, { status, carePlanId: carePlan?._id, isRead }, e);
        };
        break;
      }
      case PATIENT_COMPLETE_PROFILE: {
        content = `${fullName} (ID: ${zeroPad(carePlanId)}) has completed the Quality of life test.`;
        onClick = (e) => {
          handleMarkAsRead(_id, 8, { status, carePlanId: carePlan?._id, isRead }, e);
        };
        break;
      }
      case REPORT_STUDY: {
        content = `[Notification report] - Careplan ${zeroPad(carePlanId)}`;
        onClick = (e) => {
          handleMarkAsRead(_id, 1, { status, carePlanId: carePlan?._id, isRead }, e);
        };
        break;
      }
      case REQUEST_STUDY: {
        content = `A new heart study was prescribed for ${fullName} (care plan ${zeroPad(carePlanId)}).`;
        onClick = () => {
          handleMarkAsRead(_id, 3, { status, carePlanId: carePlan?._id, isRead });
        };
        break;
      }

      case DAILY_ENTRY: {
        content = `${fullName} (ID: ${zeroPad(carePlanId)}) has not input daily info for ${diff} days. Please review the patient’s daily entry for further action!`;
        onClick = () => {
          handleMarkAsRead(_id, 4, {
            status, carePlanId: carePlan?._id, isRead, diff, createdAt,
          });
        };
        break;
      }
      case UPDATE_BIOHEART_AUTHORIZED: {
        content = `${fullName} (ID: ${zeroPad(carePlanId)}) has ${isAuthorized ? 'authorized' : 'unauthorized'} access to Bioheart reports.`;
        onClick = () => {
          handleMarkAsRead(_id, 6, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }
      case UPDATE_BIOHEART_REPORT_STATUS: {
        const isError = reason === 'Error';
        content = isError ? `An error happened when generating a Bioheart report of patient ${fullName} (ID: ${zeroPad(carePlanId)}).`
          : `Failed to generate a Bioheart report of patient ${fullName} (ID: ${zeroPad(carePlanId)}) due to empty heart data.`;
        onClick = () => {
          handleMarkAsRead(_id, 6, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }
      case NURSE_ASSIGNMENT: {
        content = `${fullNameUser} has assigned the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}) to you.`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }
      case PHYSICIAN_ASSIGNMENT: {
        content = `${fullNameUser} has assigned the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}) to you.`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }

      case NURSE_REASSIGNMENT: {
        content = `${fullNameUser} has removed you from the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}).`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }

      case PHYSICIAN_REASSIGNMENT: {
        content = `${fullNameUser} has removed you from the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}).`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }

      case PATIENT_DELETED_ACCOUNT: {
        content = `Patient ${fullName || patientName} (ID: ${zeroPad(carePlanId)}) deleted account.`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff, isClinicCalendar: false, date, appointmentId: patientData?._id,
          });
        };
        break;
      }

      case PATIENT_RECOVER_ACCOUNT: {
        content = `Patient ${fullName || patientName} (ID: ${zeroPad(carePlanId)}) recovered account.`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff, isClinicCalendar: false, date, appointmentId: patientData?._id,
          });
        };
        break;
      }

      case DELETED_CARE_PLAN: {
        content = `${performedByInfoName} has deleted the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}).`;
        onClick = () => {
          handleMarkAsRead(_id, 9, { isRead });
        };
        break;
      }
      case RESTORE_CARE_PLAN: {
        content = `${performedByInfoName} has restored the care plan of ${fullName || patientName} (ID: ${zeroPad(carePlanId)}).`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead,
          });
        };
        break;
      }
      case CENCELED_APPOINTMENT: {
        content = `${PerfomedName} has canceled your${isRecurring ? ' recurring' : ''}${appointmentType === 'Virtual' ? ' virtual' : ' in-person'} appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}${` at ${facilityInfo?.name}`} on ${dateString} at ${timeString}.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, isClinicCalendar: false, date, appointmentId: patientData?._id,
          });
        };
        break;
      }
      case REMOVE_ATTENDEE_APPOINTMENT: {
        content = `${PerfomedName} has removed you from the appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, isClinicCalendar: true, date, appointmentId: patientData?._id,
          });
        };
        break;
      }
      case NEW_APPOINTMENT_ASSIGNEE: {
        content = `${PerfomedName} has scheduled an appointment for your patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, isClinicCalendar: true, date, appointmentId: patientData?._id,
          });
        };
        break;
      }

      case NEW_APPOINTMENT: {
        content = _.isEqual(performedBy, patientInfo) ? `Patient ${PerfomedName} has scheduled an appointment with you.`
          : `${PerfomedName} has assigned you to${appointmentType === 'Virtual' ? ' a virtual' : ' an'} appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}${appointmentType === 'Virtual' ? '' : ` at ${facilityInfo?.name}`} on ${dateString} at ${timeString}.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, date, appointmentId: patientData?._id,
          });
        };
        break;
      }
      case APPOINTMENT_FINISHED: {
        content = `${PerfomedName} has marked your appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}${appointmentType === 'Virtual' ? '' : ` at ${facilityInfo?.name}`} on ${dateString} at ${timeString} as done.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, date, appointmentId: patientData?._id,
          });
        };
        break;
      }

      case APPOINTMENT_OVERDUE: {
        content = `${PerfomedName} has marked your appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''}${appointmentType === 'Virtual' ? '' : ` at ${facilityInfo?.name}`} on ${dateString} at ${timeString} as overdue.`;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, date, appointmentId: patientData?._id,
          });
        };
        break;
      }

      case REACTIVE_CAREPLAN: {
        content = `Care plan ${zeroPad(carePlanId)} of patient ${fullName} has been reactivate by ${isNursePerformed ? 'Nurse' : 'Physician'} ${performedByInfoName}`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }

      case COMPLETED_CARE_PLAN: {
        content = `Care plan ${zeroPad(carePlanId)} of patient ${fullName} has been stopped since they deleted their account.`;
        onClick = () => {
          handleMarkAsRead(_id, 1, {
            status, carePlanId: carePlan?._id, isRead, diff,
          });
        };
        break;
      }

      case NEW_MEDICATION_ADDED: {
        const editDate = moment(date);
        const medicationList = getMedicationString(medications);
        content = `Patient ${fullName} (ID: ${zeroPad(carePlanId)}) has added ${medicationList}.`;
        onClick = () => {
          handleMarkAsRead(_id, 7, {
            status, carePlanId: carePlan?._id, isRead, diff, editDate,
          });
        };
        break;
      }

      case UPDATE_APPOINTMENT: {
        const title = `${PerfomedName} has updated your appointment with patient ${fullName || nonCCMPatientName}${carePlanId ? ` (ID: ${zeroPad(carePlanId)})` : ''} as follow:`;
        const desc1 = `${isChangeAppointment(appointment, oldAppointment, 'appointmentType') ? `\nAppointment type: ${appointment?.appointmentType === 'Virtual' ? ' Virtual.' : 'In-person.'}` : ''}`;
        const desc2 = `${isChangeTime ? `\nAppointment time: ${apppointmentTime}` : ''}`;
        const desc3 = `${isChangeAppointment(appointment, oldAppointment, 'attendees') ? `\nAttendees: ${getAttendeesName(attendeesInfo)}.` : ''}`;
        content = title + desc1 + desc2 + desc3;
        onClick = () => {
          handleMarkAsRead(_id, 5, {
            status, carePlanId: carePlan?._id, isRead, diff, date, appointmentId: patientData?._id,
          });
        };
        break;
      }
      default: {
        break;
      }
    }

    const onClickDelete = () => {
      handleDelete(_id);
    };

    return (
      <div key={i} className={classnames('noti-item-wrapper', i === props.data.length - 1 ? 'border-none' : '')}>
        <NotificationFilled className={classnames('noti-icon', isRead ? 'noti-icon-read' : '')} />

        <button
          className="noti-item-data"
          onClick={onClick}
        >
          <CustomButton
            className={classnames('noti-item-title', isRead ? 'noti-item-title-read' : '')}
            label={formatTitle}
          />
          <div className={classnames('noti-item-content', isRead ? 'noti-item-content-read' : '')}>
            <div className="noti-item-content-break-line">{content}</div>
          </div>
          <div className="noti-item-time">
            <span>{formatedTime}</span>
          </div>
        </button>

        <button
          disabled={state.loading}
          onClick={_.throttle(() => { onClickDelete(); },
            300,
            { leading: false, trailing: true })}
          className="noti-item-delete-btn"
        >
          <DeleteOutlined />
        </button>
      </div>
    );
  };

  return (
    <>
      <Drawer
        placement="right"
        width={400}
        onClose={props.onClose}
        visible={props.visible}
        closable={false}
        footer={null}
      >
        <div className="notification-center-wrapper">
          <ModalHeader
            title="Notifications"
            btnTitle="Clear all"
            btnClassName="notification-center-clear-all"
            className="clear-all-btn"
            onClick={toggleDeleteAll}
            isShowBtn={props.data?.length > 0}
          />

          <div className="notification-center-body">
            {_.map(props.data || [], (x, i) => notiItem(x, i))}
          </div>

          {
            state.isLoading
              ? <Spin /> : null
          }

          {
            props.isLoadingWholePage
              ? (
                <Spin className="notification-center-loading" />
              )
              : null
          }
        </div>
      </Drawer>


      <ConfirmationLayout
        toggleClick={toggleDeleteAll}
        type="DELETE_ALL"
        visible={state.isShowModal}
        onClick={onClickDeleteAll}
        isConfirming={state.isDeleteAllLoading}
      />
    </>
  );
};

NotificationCenter.propTypes = {
  visible: PropTypes.bool.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isEndOfNotifications: PropTypes.bool.isRequired,
  fetchMoreNotifications: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoadingWholePage: PropTypes.bool.isRequired,
  setPathRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  setPathRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);
