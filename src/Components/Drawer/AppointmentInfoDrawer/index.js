import { ArrowRightOutlined, CloseOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import {
  Drawer, Space, Spin, Tabs, Typography,
} from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { TableNames } from '../../../Constants';
import EMITTER_CONSTANTS from '../../../Constants/emitter';
import consoleLog from '../../../Helpers/consoleLog';
import {
  useActions, useEmitter, useIntersectionObserver, useMergeState,
} from '../../../Helpers/customHooks';
import emptyIcon from '../../../Image/Pages/PatientDetails/empty-ct-group-4.svg';
import { setLeavePopRequest } from '../../../Redux/Actions/leavePopUp';
import { setPathRequest } from '../../../Redux/Actions/savePath';
import { getTabName, zeroPad } from '../../../Utils';
import CustomAvatar from '../../Avatar';
import CustomButton from '../../Button/customButton';
import { generateCaregiverInfo, getBasicAndContact, showGenderAndAge } from '../../PatientInfoDrawer/helper';
import DisplayCaregiver from '../../UI/displayCaregiver';
import DisplayData2 from '../../UI/displayData2';
import EmptyCT from '../../UI/emptyCT';
import ModalHeader from '../../UI/modalHeader';
import ImportedTag from '../../UI/importedTag';
import {
  getCCMPatientData, handleBottomClick, handleFetchAppointment, handleFetchCareplan,
  handleFetchPatientInfoByEvent, handleFetchUpcommingEvent,
} from './helper';
import AppointmentCard from './layout/appointmentCard';
import './style.scss';
import { PROGRAM_TYPE } from '../../../Constants/newPatientData';

const {
  Notification, Monthly,
} = TableNames;

function AppointmentInfoDrawer(props) {
  const upComingTimeRef = useRef();
  const history = useHistory();
  const params = useParams();
  const location = useLocation();
  const hyperName = getTabName(location?.pathname);
  const leavePopUp = useSelector(state => state.leavePopUp);
  const actions = useActions({ setLeavePopRequest, setPathRequest }, []);

  const [state, setState] = useMergeState({
    currentTab: '0',
    pastAppointment: [],
    upComingAppointment: {},
    patientInfo: {},
    isCCMPatient: false,
  });
  const fetchCarePlan = async () => {
    setState({ loading: true });
    try {
      const carePlan = await handleFetchCareplan(props.carePlanId);
      setState({ ...carePlan, isCCMPatient: false });
    } catch (error) {
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const fetchPatientInfoByEvent = async () => {
    setState({ loading: true });
    try {
      const patientInfo = await handleFetchPatientInfoByEvent(props.eventId);
      setState({ ...patientInfo, isCCMPatient: true });
    } catch (error) {
      consoleLog(error);
    }
    setState({ loading: false });
  };

  const fetchAppointment = async (isLoadMore = false) => {
    if (isLoadMore) {
      setState({ isLoadingMore: true });
    } else {
      setState({ loading: true });
    }

    try {
      if (isLoadMore) {
        const { pastAppointment, cursor, couldLoadMore } = await handleFetchAppointment(props.carePlanId, props.patientId,
          isLoadMore, state.pastAppointment, state.cursor);
        setState({
          pastAppointment,
          cursor,
          couldLoadMore,
        });
        setState({ loading: false, isLoadingMore: false });
        return;
      }
      const { pastAppointment, cursor, couldLoadMore } = await handleFetchAppointment(props.carePlanId, props.patientId,
        isLoadMore, state.pastAppointment, state.cursor);
      const { upComingAppointment, upComingTime } = await handleFetchUpcommingEvent(props.carePlanId, props.patientId);
      upComingTimeRef.current = upComingTime;
      setState({
        pastAppointment,
        cursor,
        couldLoadMore,
        upComingAppointment,
      });
    } catch (error) {
      consoleLog(error);
    }
    setState({ loading: false, isLoadingMore: false });
  };

  const onChangeTableTab = (activeKey) => {
    if (activeKey !== state.currentTab) {
      setState({ currentTab: activeKey });
    }
  };

  const propsName = props.name;
  const onClickBottomButton = (e) => {
    const pathName = handleBottomClick(
      propsName, state.patientInfo?._id, state.patientInfo.status,
      params?.reportId, state.patientInfo?.physician?._id, state.patientInfo?.nurse?._id,
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
    if (!_.isEmpty(props.patientFilter)) {
      if (['new-md', 'new-registered', 'new-assigned'].includes(propsName)) {
        actions.setPathRequest({
          redirecFilter:
            { ...props.savedPage, newPatientFilter: props.patientFilter, activeNewTab: props.patientActiveNewTab },
        });
      }
      if (propsName === 'active') {
        actions.setPathRequest({ redirecFilter: { ...props.savedPage, activePatientFilter: props.patientFilter } });
      }
      if (propsName === 'inactive') {
        actions.setPathRequest({ redirecFilter: { ...props.savedPage, inactivePatientFilter: props.patientFilter } });
      }
    }
    history.push(pathName);
  };

  const onGoDetailClick = (_id) => {
    window.open(`${`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`}/appointments/${_id}`);
  };

  const handleOnNewEventListener = ({ patient }) => {
    if (props.visible && patient === props.patientId) {
      fetchAppointment();
    }
  };

  const handleLoadMore = () => {
    if (state.couldLoadMore) {
      fetchAppointment(true);
    }
  };

  const onListenCarePlanDeleted = (msg) => {
    const { carePlan } = msg || {};
    if (props.carePlanId === carePlan) {
      fetchCarePlan();
    }
  };
  const onRestoreCarePlanListener = (msg) => {
    const { carePlan } = msg || {};
    if (props.carePlanId === carePlan) {
      const patientInfoClone = _.clone(state.patientInfo);
      _.assign(patientInfoClone, { deletedDate: null });
      setState({ patientInfo: patientInfoClone });
      fetchAppointment();
    }
  };

  useIntersectionObserver(state.lastElement, handleLoadMore, () => { }, [state.pastAppointment, state.cursor]);


  useEffect(() => {
    if (!_.isEmpty(state.pastAppointment)) {
      const rowElements = document.querySelectorAll('.past-appointment-card-show');
      setState({ lastElement: rowElements[rowElements.length - 1] });
    }
  }, [state.pastAppointment, state.isLoadingMore, state.currentTab]);

  useEffect(() => {
    if (props.visible) {
      setState({ currentTab: '0' });
      if (props.carePlanId) {
        fetchCarePlan();
      } else if (props.eventId) {
        fetchPatientInfoByEvent();
      } else {
        setState({ patientInfo: props.patientData, isCCMPatient: true });
      }
      if (props.carePlanId || props.patientId) {
        fetchAppointment();
      }
    }
  }, [props.carePlanId, props.visible, props.patientData, props.eventId, props.patientId]);

  useEffect(() => {
    if (props.carePlanId || props.patientId) {
      const appointmentInterval = setInterval(() => {
        if (upComingTimeRef.current && moment().diff(moment(upComingTimeRef.current)) > 0) {
          fetchAppointment();
          upComingTimeRef.current = undefined;
        }
      }, 60000);

      return () => {
        clearInterval(appointmentInterval);
      };
    }
  }, [props.patientId, props.carePlanId]);

  useEmitter(EMITTER_CONSTANTS.ON_NEW_EVENT, handleOnNewEventListener,
    [
      state.followUpSelectedDate,
      state.scheduleSelectedDate,
      state.followUpsData,
      state.schedulesData,
    ]);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_EVENT, handleOnNewEventListener,
    [
      state.followUpSelectedDate,
      state.scheduleSelectedDate,
      state.followUpsData,
      state.schedulesData,
    ]);

  useEmitter(EMITTER_CONSTANTS.ON_CARE_PLAN_DELETED, onListenCarePlanDeleted, [state]);
  useEmitter(EMITTER_CONSTANTS.CARE_PLAN_RESTORED, onRestoreCarePlanListener, [state]);

  const showFooterButon = () => (
    <div className="patient-info-drawer-footer">
      <CustomButton
        ghost
        type="primary"
        className="f1-cen"
        onClick={onClickBottomButton}
        icon={<ArrowRightOutlined className="ml4" />}
        label="Go to patient details"
        isReverse
      />
    </div>
  );


  const showInfoTitle = () => (
    <div className="patient-info-title">
      <div className="patient-info-title-row">
        <Typography.Title level={4}>
          {`${state.patientInfo?.firstName || ''} ${state.patientInfo?.lastName || ''}`}
        </Typography.Title>
        {state.patientInfo?.isAthena && (
          <ImportedTag />
        )}
      </div>
      <div className="patient-info-title-row">
        {state.patientInfo?.programType && <div className="patient-info-title-plan-type">{`Plan type: ${state.patientInfo?.programType === PROGRAM_TYPE.CCM_RPM ? 'CCM & RPM' : state.patientInfo?.programType}`}</div>}
        {state.patientInfo?.carePlanId && (
          <div className="patient-info-title-care-plan">
            {state.patientInfo?.carePlanId ? `Careplan ID: ${zeroPad(state.patientInfo?.carePlanId)}` : ''}
          </div>
        )}
      </div>
      <div className="patient-info-title-row patient-info-title-age">
        {showGenderAndAge(state.patientInfo)}
      </div>
    </div>
  );

  const { basicInfo, contactInfo } = state.isCCMPatient
    ? getCCMPatientData(state.patientInfo) : getBasicAndContact(state.patientInfo, true);

  const showPatientInfo = () => (
    <div className="patient-info-body">
      {state.patientInfo?.willDeletedAt && (
        <div className="deleted-notice">
          <ExclamationCircleFilled className="deleted-notice-icon" />
          <div className="deleted-notice-content">
            {`The patient has deleted their account since ${moment(state.patientInfo?.willDeletedAt).subtract(30, 'd').format('MM/DD/YYYY')}`}
          </div>
        </div>
      )}
      <div>
        <CustomAvatar
          avatarLink={state.patientInfo?.photo}
          size={80}
          firstName={state.patientInfo?.firstName}
          lastName={state.patientInfo?.lastName}
        />

        {showInfoTitle()}

        <>
          <DisplayData2
            title="Basic information"
            data={basicInfo}
            isStrip
            className="mt16"
            leftWidth={4.5}
          />

          <DisplayData2
            title="Contact"
            data={contactInfo}
            className="mt16"
            isStrip
            leftWidth={4.5}
          />
        </>

        {!state.isCCMPatient && (
          <>
            <div className="registered-clinic">
              <span>Preferred contact method</span>
            </div>
            <div className="mt8">
              <span>
                {state.patientInfo?.contactMethod
                  ? (state.patientInfo?.contactMethod === 'Both' ? 'Email and SMS' : state.patientInfo?.contactMethod)
                  : '--'}
              </span>
            </div>
          </>
        )}
        {!state.isCCMPatient && (
          <>
            <div className="registered-clinic">
              <span>Registered clinic</span>
            </div>
            <div className="mt8">
              <span>{state.patientInfo?.facilityName}</span>
            </div>
          </>
        )}
        {!state.isCCMPatient && (
          <DisplayCaregiver
            className="mt16"
            isDetails={false}
            caregiverInfo={generateCaregiverInfo(state.patientInfo)}
            name={hyperName}
          />
        )}
      </div>

      {!state.isCCMPatient && !state.patientInfo?.deletedDate && showFooterButon()}
    </div>
  );

  const showAppointmentInfo = () => (
    <div className="appointment-info-show">
      {!_.isEmpty(state.upComingAppointment) ? (
        <div>
          <div className="appointment-info-show-title">Upcoming appointment</div>
          <AppointmentCard
            onGoDetailClick={onGoDetailClick}
            isActive
            className="mt12"
            data={state.upComingAppointment}
          />
        </div>
      ) : (
        <div>
          <div className="appointment-info-show-title">Upcoming appointment</div>
          <div className="mt12 mb24 no-appointment-text">There are currently no upcoming appointments</div>
        </div>
      )}
      {!_.isEmpty(state.pastAppointment) ? (
        <div>
          <div className={classnames('appointment-info-show-title',
            !_.isEmpty(state.upComingAppointment) ? 'mt24' : '')}
          >
            Past appointments
          </div>
          {_.map(state.pastAppointment, (x, i) => (
            <AppointmentCard
              onGoDetailClick={onGoDetailClick}
              key={i}
              className="mt12 past-appointment-card-show"
              data={x}
            />
          ))}
          {state.isLoadingMore && (<div className="mt24 mb24"><Spin size="middle" /></div>)}
        </div>
      ) : (
        <div>
          <div className={classnames('appointment-info-show-title',
            !_.isEmpty(state.upComingAppointment) ? 'mt24' : '')}
          >
            Past appointments
          </div>
          <div className="mt12 mb24 no-appointment-text">There are currently no past appointments</div>
        </div>
      )}
    </div>
  );

  const showEmpty = () => (
    <EmptyCT
      className="empty-appointment"
      emptyIcon={emptyIcon}
      description="There are currently no appointments"
    />
  );

  return (
    <Drawer
      width={450}
      placement="right"
      className="appointment-info-drawer"
      title=""
      onClose={props.onClose}
      visible={props.visible}
    >
      {state.loading && (
        <Space className="loading-space" size="middle">
          <Spin size="large" />
        </Space>
      )}
      <div className="appointment-info-drawer-header">
        <CustomButton
          className="appointment-info-drawer-header-close-btn"
          onClick={props.onClose}
          icon={<CloseOutlined />}
        />
        {state.patientInfo?.deletedDate ? (
          <div>
            <ModalHeader
              className="patient-info-drawer-header"
              title={props.patientName}
              onClick={props.onClose}
            />
            {showPatientInfo()}
          </div>
        ) : (
          <Tabs
            activeKey={state.currentTab}
            onChange={onChangeTableTab}
            defaultActiveKey="0"
          >
            <Tabs.TabPane tab={<span className="tab-header">{props.patientName}</span>} key="0">
              {showPatientInfo()}
            </Tabs.TabPane>

            <Tabs.TabPane tab={<span className="tab-header">Appointments</span>} key="1">
              {_.isEmpty(state.upComingAppointment)
                && _.isEmpty(state.pastAppointment) ? showEmpty() : showAppointmentInfo()}
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>

    </Drawer>
  );
}

AppointmentInfoDrawer.defaultProps = {
  carePlanId: '',
  patientId: '',
  eventId: '',
  visible: false,
  onClose: () => { },
  patientName: '',
  patientData: {},
  name: '',
  patientActiveNewTab: '',
  patientFilter: {},
  savedPage: {},
};

AppointmentInfoDrawer.propTypes = {
  carePlanId: PropTypes.string,
  patientId: PropTypes.string,
  eventId: PropTypes.string,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  patientName: PropTypes.string,
  patientData: PropTypes.shape(),
  name: PropTypes.string,
  patientActiveNewTab: PropTypes.string,
  patientFilter: PropTypes.shape(),
  savedPage: PropTypes.shape(),
};

export default AppointmentInfoDrawer;
