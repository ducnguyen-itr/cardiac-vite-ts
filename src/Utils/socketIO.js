import Auth from '@aws-amplify/auth';
import { io } from 'socket.io-client';
import CONFIG from '../Config';
import EMITTER_CONSTANTS from '../Constants/emitter';
import consoleLog from '../Helpers/consoleLog';
import emitter from './eventEmitter';


class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connectToServer = () => {
    if (!this.socket) {
      this.socket = io(CONFIG.SOCKET_URL, {
        forceNew: true,
        transports: ['websocket'],
      });
      this.socket.on('connect', this.connectListener);
    }
  }

  connectListener = async () => {
    try {
      const currentSession = await Auth.currentSession();
      const token = currentSession.accessToken.jwtToken;
      this.socket.emit('hello', token, () => {
        consoleLog('Hello');

        this.isConnected = true;

        this.socket.io.off('reconnect');
        this.socket.on('disconnect', this.disconnectListener);

        this.socket.on('NewCarePlan', this.newCarePlanListener);
        this.socket.on('CarePlanAssigneeChanged', this.carePlanAssigneeChangedListener);
        this.socket.on('CarePlanUpdated', this.carePlanUpdatedListener);
        this.socket.on('UpdatedReport', this.updatedReportListener);
        this.socket.on('Notification', this.notificationListener);

        this.socket.on('Timesheet', this.timesheetListener);
        this.socket.on('UpdatedBiofluxReport', this.updatedBiofluxReportListener);
        this.socket.on('ReportStudy', this.reportStudyListener);

        this.socket.on('Eventlog', this.eventlogListener);
        this.socket.on('Appointment', this.appointmentListener);
        this.socket.on('ApplicationUpdate', this.applicationUpdateListener);
        this.socket.on('ApplicationAdded', this.applicationUpdateListener);

        this.socket.on('deviceEvent', this.deviceEventListener);
        this.socket.on('lastSync', this.lastSyncListener);
        this.socket.on('studyEvent', this.studyEventListener);
        this.socket.on('ecgUploadProgress', this.ecgUploadProgressListener);
        this.socket.on('newEvaluationStrip', this.newEvaluationStripListener);
        this.socket.on('inbox', this.newInboxListener);
        this.socket.on('OnDemand', this.onDemandReportGenerated);
        this.socket.on('DeleteOnDemandReport', this.onDemandReportDeleted);
        this.socket.on('NewBulkCarePlan', this.onNewBulkCarePlan);
        this.socket.on('Monthly', this.onNewMonthlyReport);
        this.socket.on('NotificationReport', this.onNewNotificationReport);
        this.socket.on('NewTemplate', this.onNewTemplate);
        this.socket.on('TemplateUpdated', this.onTemplateUpdated);
        this.socket.on('TemplateDelete', this.onTemplateDelete);
        this.socket.on('CarePlanLinked', this.onCarePlanLinked);
        this.socket.on('UpdateBioheartReportStatus', this.onUpdateBioheartReportStatus);
        this.socket.on('UpdateBioheartAuthorized', this.onUpdateBioheartAuthorized);
        this.socket.on('BioheartReportLog', this.onUpdateBioheartReportLog);
        this.socket.on('BiofluxReportLog', this.onUpdateBiofluxReportLog);
        this.socket.on('markAsReadCarePlan', this.onMarkAsReadCarePlan);
        this.socket.on('BioheartExportReport', this.onBioheartExportReport);
        this.socket.on('UpdatedBioheartMonitor', this.onUpdatedBioheartMonitor);
        this.socket.on('PrescribeBiofluxStudy', this.onRequestStudy);
        this.socket.on('UpdatedAfibHistory', this.onUpdatedAfibHistory);
        this.socket.on('AddAfibHistory', this.onAddAfibHistory);
        this.socket.on('Calendar:NewCall', this.onNewCall);
        this.socket.on('Calendar:UpdateCall', this.onUpdateCall);
        this.socket.on('Calendar:RefreshCall', this.onRefreshCall);
        this.socket.on('Calendar:UpdateEvent', this.onUpdateEvent);
        this.socket.on('Calendar:FinishedEvent', this.onFinishedEvent);
        this.socket.on('Calendar:NewEvent', this.onNewEvent);
        this.socket.on('AccountDeletion', this.onAccountDeletion);
        this.socket.on('RecoverAccount', this.onRecoverAccount);
        this.socket.on('CarePlanDeleted', this.onCarePlanDeleted);
        this.socket.on('AddQoL', this.onAddQoL);
        this.socket.on('UpdatedQoL', this.onUpdatedQoL);
        this.socket.on('AddMedicalTestResult', this.onUAddMedicalTestResult);
        this.socket.on('UpdatedMedicalTestResult', this.onUpdatedMedicalTestResult);
        this.socket.on('CarePlanRestore', this.onCarePlanRestore);
        this.socket.on('NewAutoMessage', this.onAddAutoMessage);
        this.socket.on('AutoMessageUpdated', this.onUpdateAutoMessage);
        this.socket.on('AutoMessageDeleted', this.onDeleteAutoMessage);
        this.socket.on('NewTemplateMessage', this.onAddTemplateMessage);
        this.socket.on('TemplateMessageDeleted', this.onDeleteTemplateMessage);
        this.socket.on('UploadConsent', this.onUploadConsent);
        this.socket.on('SignCCMConsent', this.onSignCCMConsent);
        this.socket.on('UpdatedCCMConsent', this.onUpdatedCCMConsent);
        this.socket.on('AddDailyInfo', this.onAddDailyInfo);
        this.socket.on('UpdateDailyInfo', this.onUpdateDailyInfo);
        this.socket.on('AddMeasurement', this.onAddMeasurement);
        this.socket.on('UpdateMeasurement', this.onUpdateMeasurement);
        this.socket.on('DeletedMeasurement', this.onDeletedMeasurement);
        this.socket.on('NewTimeLog', this.onNewTimeLog);
        this.socket.on('TimeLogDeleted', this.onTimeLogDeleted);
        this.socket.on('TimeLogUpdated', this.onTimeLogUpdated);
        this.socket.on('AddMedication', this.onAddMedication);
        this.socket.on('UpdateMedication', this.onUpdateMedication);
        this.socket.on('ExternalReportAdded', this.onAddExternalReport);
        this.socket.on('ExternalReportDeleted', this.onDeleteExternalReport);
        this.socket.on('ExternalReportUpdated', this.onUpdateExternalReport);
        this.socket.on('Prescription', this.onPrescription);
        this.socket.on('MedicationDeleted', this.onMedicationDeleted);
        this.socket.on('NewBill', this.onNewBill);
        this.socket.on('BillUpdated', this.onBillUpdated);
        this.socket.on('DeleteAllTimeLog', this.onDeleteAllTimeLog);
        this.socket.on('MarkAsDoneTimeLog', this.onMarkAsDoneTimeLog);
        this.socket.on('Calendar:AppointmentSynced', this.onAppointmentSynced);
        this.socket.on('NewBaseline', this.onNewBaseline);
        this.socket.on('BaselineUpdated', this.onBaselineUpdated);
        this.socket.on('addDiagnosis', this.onAddDiagnosis);
        this.socket.on('diagnosisUpdated', this.onDiagnosisUpdated);
        this.socket.on('diagnosisDeleted', this.onDiagnosisDeleted);
        this.socket.on('PatientDemographicUpdated', this.onPatientDemographicUpdated);
        this.socket.on('AllergiesUpdated', this.onAllergiesUpdated);
        this.socket.on('NoteChanged', this.onNoteChanged);
        this.socket.on('DeviceInfoUpdated', this.onDeviceInfoUpdated);
      });
      emitter.emit(EMITTER_CONSTANTS.SOCKET_CONNECTED);
      consoleLog('Socket IO is connected');
    } catch (error) {
      consoleLog('Failed to connect: ', error);
    }
  }

  disconnectListener = async (error) => {
    consoleLog('disconnectListener', error);

    this.isConnected = false;

    this.socket.io.on('reconnect', this.reconnectListener);

    this.socket.off('connect');
    this.socket.off('disconnect');

    this.socket.off('NewCarePlan');
    this.socket.off('CarePlanAssigneeChanged');
    this.socket.off('UpdatedReport');
    this.socket.off('Notification');
    this.socket.off('Timesheet');
    this.socket.off('UpdatedBiofluxReport');
    this.socket.off('ReportStudy');
    this.socket.off('Eventlog');
    this.socket.off('Appointment');
    this.socket.off('ApplicationUpdate');
    this.socket.off('OnDemand');
    this.socket.off('AccountDeletion');
    this.socket.off('RecoverAccount');
    this.socket.off('CarePlanDeleted');

    try {
      const currentSession = await Auth.currentSession();
      const token = currentSession.accessToken.jwtToken;
      if (error && error.trim() === 'ping timeout' && !token) {
        this.disconnectSocket();
        this.socket = null;
      }
    } catch (error) {
      consoleLog('Failed to disconecet Socket: ', error);
    }
  }

  reconnectListener = () => {
    consoleLog('Socket IO is reconnected');
    this.socket.on('connect', this.connectListener);
    window.location.reload();
  }

  joinListener = (msg) => {
    consoleLog('joinListener', { msg });
  }

  leaveListener = (msg) => {
    consoleLog('leaveListener', { msg });
  }

  newCarePlanListener = (msg) => {
    consoleLog('newCarePlanListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.NEW_CARE_PLAN, msg);
  }

  carePlanAssigneeChangedListener = (msg) => {
    consoleLog('carePlanAssigneeChangedListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.CARE_PLAN_ASSIGNEE_CHANGED, msg);
  }

  carePlanUpdatedListener = (msg) => {
    consoleLog('carePlanUpdatedListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.CARE_PLAN_UPDATED, msg);
  }

  updatedReportListener = (msg) => {
    consoleLog('updatedReportListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.UPDATED_REPORT, msg);
  }

  notificationListener = (msg) => {
    consoleLog('notificationListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.NOTIFICATIONS, msg);
  }

  timesheetListener = (msg) => {
    consoleLog('timesheetListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.TIMESHEET, msg);
  }

  reportStudyListener = (msg) => {
    consoleLog('reportStudyListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.REPORT_STUDY, msg);
  }

  updatedBiofluxReportListener = (msg) => {
    consoleLog('updatedBiofluxReportListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.UPDATE_BIOFLUX_REPORT, msg);
  }

  eventlogListener = (msg) => {
    consoleLog('eventlogListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.EVENT_LOG, msg);
  }

  appointmentListener = (msg) => {
    consoleLog('appointmentListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.APPOINTMENT, msg);
  }

  applicationUpdateListener = (msg) => {
    consoleLog('applicationUpdateListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.APPLICATION_UPDATE, msg);
  }

  deviceEventListener = (msg) => {
    consoleLog('deviceEventListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.DEVICE_EVENT, msg);
  }

  lastSyncListener = (msg) => {
    consoleLog('lastSyncListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.LAST_SYNC, msg);
  }

  studyEventListener = (msg) => {
    consoleLog('studyEventListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.STUDY_EVENT, msg);
  }

  ecgUploadProgressListener = (msg) => {
    consoleLog('ecgUploadProgressListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.ECG_UPLOAD_PROGRESS, msg);
  }

  newEvaluationStripListener = (msg) => {
    consoleLog('newEvaluationStripListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.NEW_EVALUATION_STRIP, msg);
  }

  newInboxListener = (msg) => {
    consoleLog('newInboxListener', { msg });
    emitter.emit(EMITTER_CONSTANTS.INBOX, msg);
  }

  onDemandReportGenerated = (msg) => {
    consoleLog('onDemandReportGenerated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DEMAND_REPORT_GENERATED, msg);
  }

  onDemandReportDeleted = (msg) => {
    emitter.emit(EMITTER_CONSTANTS.ON_DEMAND_REPORT_DELETED, msg);
  }

  onNewBulkCarePlan = (msg) => {
    consoleLog('onNewBulkCarePlan', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_BULK_CARE_PLAN, msg);
  }

  onNewMonthlyReport = (msg) => {
    consoleLog('onNewMonthlyReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_MONTHLY_REPORT, msg);
  }

  onNewNotificationReport = (msg) => {
    consoleLog('onNewNotificationReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_NOTIFICATION_REPORT, msg);
  }

  onNewTemplate = (msg) => {
    consoleLog('onNewTemplate', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_TEMPLATE, msg);
  }

  onTemplateUpdated = (msg) => {
    consoleLog('onTemplateUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_TEMPLATE_UPDATED, msg);
  }

  onTemplateDelete = (msg) => {
    consoleLog('onTemplateDelete', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_TEMPLATE_DELETE, msg);
  }

  onCarePlanLinked = (msg) => {
    consoleLog('onCarePlanLinked', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_CARE_PLAN_LINKED, msg);
  }

  onUpdateBioheartReportStatus = (msg) => {
    consoleLog('onUpdateBioheartReportStatus', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_REPORT_STATUS, msg);
  }

  onUpdateBioheartAuthorized = (msg) => {
    consoleLog('onUpdateBioheartAuthorized', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_AUTHORIZED, msg);
  }

  onUpdateBioheartReportLog = (msg) => {
    consoleLog('BioheartReportLog', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_REPORT_LOG, msg);
  }

  onUpdateBiofluxReportLog = (msg) => {
    consoleLog('onUpdateBiofluxReportLog', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOFLUX_REPORT_LOG, msg);
  }

  onMarkAsReadCarePlan = (msg) => {
    consoleLog('onMarkAsReadCarePlan', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_MARK_AS_READ_CARE_PLAN, msg);
  }

  onBioheartExportReport = (msg) => {
    consoleLog('onBioheartExportReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_EXPORT_REPORT, msg);
  }

  onUpdatedBioheartMonitor = (msg) => {
    consoleLog('onUpdatedBioheartMonitor', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_MONITOR, msg);
  }

  onRequestStudy = (msg) => {
    consoleLog('onRequestStudy', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_REQUEST_STUDY, msg);
  }

  onUpdatedAfibHistory = (msg) => {
    consoleLog('onUpdatedAfibHistory', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_AFIB_HISTORY, msg);
  }

  onAddAfibHistory = (msg) => {
    consoleLog('onAddAfibHistory', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_AFIB_HISTORY, msg);
  }

  onNewCall = (msg) => {
    consoleLog('onNewCall', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_CALL, msg);
  }

  onUpdateCall = (msg) => {
    consoleLog('onUpdateCall', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_CALL, msg);
  }

  onRefreshCall = (msg) => {
    consoleLog('onRefreshCall', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_REFRESH_CALL, msg);
  }

  onUpdateEvent = (msg) => {
    consoleLog('onUpdateEvent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_EVENT, msg);
  }

  onFinishedEvent = (msg) => {
    consoleLog('onFinishedEvent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_FINISHED_EVENT, msg);
  }

  onNewEvent = (msg) => {
    consoleLog('onNewEvent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_EVENT, msg);
  }

  onAccountDeletion = (msg) => {
    consoleLog('onAccountDeletion', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ACCOUNT_DELETION, msg);
  }

  onRecoverAccount = (msg) => {
    consoleLog('onRecoverACcount', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_RECOVER_ACCOUNT, msg);
  }

  onCarePlanDeleted = (msg) => {
    consoleLog('onCarePlanDeleted', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_CARE_PLAN_DELETED, msg);
  }

  onAddQoL = (msg) => {
    consoleLog('onAddQoL', msg);
    emitter.emit(EMITTER_CONSTANTS.ADD_QOL, msg);
  }

  onUpdatedQoL = (msg) => {
    consoleLog('onUpdatedQoL', msg);
    emitter.emit(EMITTER_CONSTANTS.UPDATE_QOL, msg);
  }

  onUAddMedicalTestResult = (msg) => {
    consoleLog('onUAddMedicalTestResult', msg);
    emitter.emit(EMITTER_CONSTANTS.ADD_MEDICAL_TEST_RESULT, msg);
  }

  onUpdatedMedicalTestResult = (msg) => {
    consoleLog('onUpdatedMedicalTestResult', msg);
    emitter.emit(EMITTER_CONSTANTS.UPDATED_MEDICAL_TEST_RESULT, msg);
  }

  onUploadConsent = (msg) => {
    consoleLog('onUploadConsent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPLOAD_CONSENT, msg);
  }

  onSignCCMConsent = (msg) => {
    consoleLog('onSignCCMConsent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_SIGN_CCM_CONSENT, msg);
  }

  onUpdatedCCMConsent = (msg) => {
    consoleLog('onUpdatedCCMConsent', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATED_CCM_CONSENT, msg);
  }

  onAddDailyInfo = (msg) => {
    consoleLog('onAddDailyInfo', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_DAILY_INFO, msg);
  }

  onUpdateDailyInfo = (msg) => {
    consoleLog('onUpdateDailyInfo', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_DAILY_INFO, msg);
  }

  onAddMeasurement = (msg) => {
    consoleLog('onAddMeasurement', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_MEASUREMENT, msg);
  }

  onUpdateMeasurement = (msg) => {
    consoleLog('onAddMeasurement', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_MEASUREMENT, msg);
  }

  onTimeLogUpdated = (msg) => {
    consoleLog('onTimeLogUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_TIME_LOG_UPDATED, msg);
  }

  onTimeLogDeleted = (msg) => {
    consoleLog('onTimeLogDeleted', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_TIME_LOG_DELETED, msg);
  }

  onNewTimeLog = (msg) => {
    consoleLog('onNewTimeLog', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_TIME_LOG, msg);
  }

  onDeletedMeasurement = (msg) => {
    consoleLog('onDeletedMeasurement', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DELETE_MEASUREMENT, msg);
  }

  onAddMedication = (msg) => {
    consoleLog('onAddMedication', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_MEDICATION, msg);
  }

  onUpdateMedication = (msg) => {
    consoleLog('onUpdateMedication', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_MEDICATION, msg);
  }

  onAddExternalReport = (msg) => {
    consoleLog('onAddExternalReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_EXTERNAL_REPORT, msg);
  }

  onUpdateExternalReport = (msg) => {
    consoleLog('onUpdateExternalReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_UPDATE_EXTERNAL_REPORT, msg);
  }

  onDeleteExternalReport = (msg) => {
    consoleLog('onDeleteExternalReport', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DELETE_EXTERNAL_REPORT, msg);
  }

  onPrescription = (msg) => {
    consoleLog('onPrescription', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_PRESCRIPTION, msg);
  }

  onMedicationDeleted = (msg) => {
    consoleLog('onMedicationDeleted', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_MEDICATION_DELETED, msg);
  }

  onNewBill = (msg) => {
    consoleLog('onNewBill', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_BILL, msg);
  }

  onBillUpdated = (msg) => {
    consoleLog('onBillUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_BILL_UPDATED, msg);
  }

  onDeleteAllTimeLog = (msg) => {
    consoleLog('onDeleteAllTimeLog', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DELETE_ALL_TIME_LOG, msg);
  }

  onMarkAsDoneTimeLog = (msg) => {
    consoleLog('onMarkAsDoneTimeLog', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_MARK_AS_DONE_TIME_LOG, msg);
  }

  onAppointmentSynced = (msg) => {
    consoleLog('onAppointmentSynced', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_APPOINTMENT_SYNCED, msg);
  }

  onNewBaseline = (msg) => {
    consoleLog('onNewBaseline', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NEW_BASELINE, msg);
  }

  onBaselineUpdated = (msg) => {
    consoleLog('onBaselineUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_BASELINE_UPDATED, msg);
  }

  onAddDiagnosis = (msg) => {
    consoleLog('onAddDiagnosis', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ADD_DIAGNOSIS, msg);
  }

  onDiagnosisUpdated = (msg) => {
    consoleLog('onDiagnosisUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DIAGNOSIS_UPDATED, msg);
  }

  onDiagnosisDeleted = (msg) => {
    consoleLog('onDiagnosisDeleted', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DIAGNOSIS_DELETED, msg);
  }

  onPatientDemographicUpdated = (msg) => {
    consoleLog('onPatientDemographicUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_DIAGNOSIS_DELETED, msg);
  }

  onAllergiesUpdated = (msg) => {
    consoleLog('onAllergiesUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_ALLERGIES_UPDATED, msg);
  }

  onNoteChanged = (msg) => {
    consoleLog('onNoteChanged', msg);
    emitter.emit(EMITTER_CONSTANTS.ON_NOTE_CHANGED, msg);
  }

  onDeviceInfoUpdated = (msg) => {
    consoleLog('onDeviceInfoUpdated', msg);
    emitter.emit(EMITTER_CONSTANTS.DEVICE_INFO_UPDATED, msg);
  }

  onAddAutoMessage = (msg) => {
    consoleLog('onAddAutoMessage', msg);
    emitter.emit(EMITTER_CONSTANTS.NEW_AUTO_MESSAGE, msg);
  }

  onUpdateAutoMessage = (msg) => {
    consoleLog('onUpdateAutoMessage', msg);
    emitter.emit(EMITTER_CONSTANTS.AUTO_MESSAGE_UPDATED, msg);
  }

  onDeleteAutoMessage = (msg) => {
    consoleLog('onDeleteAutoMessage', msg);
    emitter.emit(EMITTER_CONSTANTS.AUTO_MESSAGE_DELETED, msg);
  }

  onAddTemplateMessage = (msg) => {
    consoleLog('onAddTemplateMessage', msg);
    emitter.emit(EMITTER_CONSTANTS.NEW_TEMPLATE_MESSAGE, msg);
  }

  onDeleteTemplateMessage = (msg) => {
    consoleLog('onDeleteTemplateMessage', msg);
    emitter.emit(EMITTER_CONSTANTS.TEMPLATE_MESSAGE_DELETED, msg);
  }

  onCarePlanRestore = (msg) => {
    consoleLog('onCarePlanRestore', msg);
    emitter.emit(EMITTER_CONSTANTS.CARE_PLAN_RESTORED, msg);
  }

  joinRoom = (id) => {
    this.intervalEmitJoinEvent('join', id);
  }

  intervalEmitJoinEvent = (status, id) => {
    if (this.isConnected) {
      this.socket.emit(status, id);
    } else {
      const interval = setInterval(async () => {
        if (this.isConnected) {
          this.socket.emit(status, id, this.joinListener);
          clearInterval(interval);
        }

        const currentSession = await Auth.currentSession();
        const token = currentSession.accessToken.jwtToken;
        if (!token) {
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  leaveRoom = (id) => {
    if (this.socket && this.isConnected) {
      consoleLog({ id });
      this.socket.emit('leave', id, this.leaveListener);
    }
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = null;
    this.isConnected = false;
    consoleLog('Socket IO is disconnected');
  }
}

const staticSocket = new SocketClient();

export default staticSocket;
