import {
  BarChartOutlined,
  CalendarOutlined, CaretDownOutlined,
  CaretUpOutlined, DollarOutlined, HeartOutlined, IdcardOutlined,
  MessageOutlined, QuestionCircleOutlined, SolutionOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import { connect, useSelector } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import EMITTER_CONSTANTS from '../../Constants/emitter';
import auth from '../../Helpers/auth';
import { useActions, useEmitter, useMergeState } from '../../Helpers/customHooks';
import biocareLogo from '../../Image/Components/SideMenu/biocare-logo.svg';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import {
  fetchAllCountRequest, fetchBioheartReportCountRequest, fetchNewCareplanCountRequest,
  fetchNewMonthlyReportCountRequest, fetchNotificationsCountRequest, fetchStudyNotificationsCountRequest,
} from '../../Redux/Actions/notificationCounts';
import { deletePathRequest } from '../../Redux/Actions/savePath';
import { isTheSameObj, toggleArr } from '../../Utils';

const { SubMenu } = Menu;

const SideBar = (props) => {
  const history = useHistory();
  const facilityRef = useRef(undefined);
  const notificationCounts = useSelector(state => state.notificationCounts);
  const leavePopUp = useSelector(state => state.leavePopUp);
  const [state, setState] = useMergeState({
    pathname: '',
    openArr: ['/patients', '/reports', '/heartmonitor', '/messages'],
  });

  const actions = useActions({
    setLeavePopRequest,
    fetchAllCountRequest,
    fetchStudyNotificationsCountRequest,
    fetchNotificationsCountRequest,
    fetchNewMonthlyReportCountRequest,
    fetchNewCareplanCountRequest,
    fetchBioheartReportCountRequest,
  }, []);

  const location = useLocation();
  const { openArr } = state;

  useEffect(() => {
    const pathname = location.pathname.split('/').slice(0, 3).join('/');
    setState({ pathname });
  }, [location.pathname]);

  useEffect(() => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchAllCountRequest({ sendingData: { facilityId } });
  }, []);

  const handleUpdatedReportListener = async () => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchStudyNotificationsCountRequest({ sendingData: { facilityId } });
  };

  const handleUpdatedNotificationListener = async () => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchNotificationsCountRequest({ sendingData: { facilityId } });
    actions.fetchNewMonthlyReportCountRequest({ sendingData: { facilityId } });
  };

  const handleNewCarePlanListener = () => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchNewCareplanCountRequest({ sendingData: { facilityId } });
  };

  const handleNewMonthlyReportListener = () => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchNewMonthlyReportCountRequest({ sendingData: { facilityId } });
  };

  const handleUpdateBioheartReportListener = () => {
    const facilityId = props.facility?.value || undefined;
    actions.fetchBioheartReportCountRequest({ sendingData: { facilityId } });
  };

  useEffect(() => {
    if (facilityRef.current === props.facility?.value) return;
    facilityRef.current = props.facility?.value;
    actions.fetchAllCountRequest({ sendingData: { facilityId: props.facility?.value || undefined } });
  }, [props.facility]);

  useEmitter(EMITTER_CONSTANTS.UPDATED_REPORT, handleUpdatedNotificationListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.INBOX, handleUpdatedReportListener, [props.facility?.value]);

  useEmitter(auth.isNurse() ? EMITTER_CONSTANTS.NEW_CARE_PLAN : undefined, handleNewCarePlanListener, [props.facility?.value]);

  useEmitter(auth.isNurse() ? EMITTER_CONSTANTS.ON_NEW_BULK_CARE_PLAN : undefined, handleNewCarePlanListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.CARE_PLAN_ASSIGNEE_CHANGED, handleNewCarePlanListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.CARE_PLAN_UPDATED, handleNewCarePlanListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.ON_NEW_MONTHLY_REPORT, handleNewMonthlyReportListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.ON_NEW_NOTIFICATION_REPORT, handleUpdatedNotificationListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_REPORT_STATUS, handleUpdateBioheartReportListener, [props.facility?.value]);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_EXPORT_REPORT, handleUpdateBioheartReportListener, [props.facility?.value]);

  useEmitter(EMITTER_CONSTANTS.ON_MARK_AS_READ_CARE_PLAN, handleNewCarePlanListener, [props.facility?.value]);

  const onTitleClick = ({ key }) => {
    const newArr = toggleArr(key, openArr);
    if (isTheSameObj(newArr, openArr)) {
      return;
    }
    setState({ openArr: newArr });
  };

  const onClickKey = () => {
    if (leavePopUp?.isUnsaved) {
      return;
    }
    props.deletePathRequest();
  };
  const onClickNavLink = (link, e) => {
    if (leavePopUp.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        func: () => history.push(link),
      });
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    history.push(link);
  };

  const getIcon = (name) => {
    switch (name) {
      case 'Dashboard':
        return <BarChartOutlined className="side-bar-item-icon" />;
      case 'Calendar':
        return <CalendarOutlined className="side-bar-item-icon" />;
      case 'Heart monitor':
        return <HeartOutlined className="side-bar-item-icon" />;
      case 'Patients':
        return <IdcardOutlined className="side-bar-item-icon" />;
      case 'Reports':
        return <SolutionOutlined className="side-bar-item-icon" />;
      case 'Messages':
        return <MessageOutlined className="side-bar-item-icon" />;
      case 'Support':
        return <QuestionCircleOutlined className="side-bar-item-icon" />;
      case 'Billing':
        return <DollarOutlined className="side-bar-item-icon" />;
      default:
        return null;
    }
  };

  const newCarePlanCount = useMemo(() => _.reduce(notificationCounts?.newCarePlanCount, (sum, value, key) => sum + value, 0), [
    notificationCounts?.newCarePlanCount]);
  const bioheartReportCount = useMemo(() => _.reduce(notificationCounts?.bioheartReportCount, (sum, value, key) => sum + value, 0), [
    notificationCounts?.bioheartReportCount]);
  const monthlyNotificationCount = useMemo(() => _.reduce(notificationCounts?.monthlyNotificationCount, (sum, value, key) => sum + value, 0), [
    notificationCounts?.monthlyNotificationCount]);

  const getCountNumber = (subName, name) => {
    switch (subName) {
      case 'New':
        return (
          <div>
            {newCarePlanCount > 0 && (
              <div className="menu-item-badge-number">
                {newCarePlanCount > 99
                  ? '99+'
                  : newCarePlanCount}
              </div>
            )}
          </div>
        );
      case 'Notification':
        return name === 'Reports'
          ? (
            <div>
              {notificationCounts?.notificationCount > 0 && (
                <div className="menu-item-badge-number">
                  {notificationCounts?.notificationCount > 99
                    ? '99+'
                    : notificationCounts?.notificationCount}
                </div>
              )}
            </div>
          ) : (
            <div>
              {notificationCounts?.studyNotificationCount > 0 && (
                <div className="menu-item-badge-number">
                  {notificationCounts?.studyNotificationCount > 99
                    ? '99+'
                    : notificationCounts?.studyNotificationCount}
                </div>
              )}
            </div>
          );
      case 'Notifications':
        return name === 'Reports'
          ? (
            <div>
              {notificationCounts?.notificationCount > 0 && (
                <div className="menu-item-badge-number">
                  {notificationCounts?.notificationCount > 99
                    ? '99+'
                    : notificationCounts?.notificationCount}
                </div>
              )}
            </div>
          ) : (
            <div>
              {notificationCounts?.studyNotificationCount > 0 && (
                <div className="menu-item-badge-number">
                  {notificationCounts?.studyNotificationCount > 99
                    ? '99+'
                    : notificationCounts?.studyNotificationCount}
                </div>
              )}
            </div>
          );
      case 'Monthly':
        return (
          <div>
            {monthlyNotificationCount > 0 && (
              <div className="menu-item-badge-number">
                {monthlyNotificationCount > 99
                  ? '99+'
                  : monthlyNotificationCount}
              </div>
            )}
          </div>
        );
      case 'Bioheart':
        return (
          <div>
            {bioheartReportCount > 0 && (
              <div className="menu-item-badge-number">
                {bioheartReportCount > 99
                  ? '99+'
                  : bioheartReportCount}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const getMainMenuNumber = (menuName) => {
    switch (menuName) {
      case 'Messages':
        return (
          <div>
            {notificationCounts?.unreadMessagesCount > 0 && (
              <div className="menu-item-badge-number">
                {notificationCounts?.unreadMessagesCount > 99
                  ? '99+'
                  : notificationCounts?.unreadMessagesCount}
              </div>
            )}
          </div>
        );
      default:
        return <></>;
    }
  };

  const { menu } = props;

  return (
    <div className="side-bar-main">

      <div className="side-bar-logo">
        <img src={biocareLogo} alt="biocare-logo" />
      </div>

      <Menu mode="inline" defaultOpenKeys={openArr} selectedKeys={[state.pathname]}>
        {_.map(menu, item => (item.sub ? (
          <SubMenu
            className="side-bar-submenu"
            key={item.link}
            onTitleClick={onTitleClick}
            onClick={onClickKey}
            title={(
              <div className={classnames('fr-sb', 'pos-re', 'side-bar-submenu-item')}>
                <div>
                  {getIcon(item.name)}
                  <span className="side-bar-item-text">{item.name}</span>
                </div>
                <div className="side-bar-item-caret">
                  {openArr.includes(item.link) ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </div>
              </div>
            )}
          >
            {_.map(item.sub, d => (
              <Menu.Item className="ant-menu-title-sub-content" key={d.link}>
                <NavLink key={d.link} to={d.link} onClick={e => onClickNavLink(d.link, e)}>
                  {d.name}
                </NavLink>
                {getCountNumber(d.name, item.name)}
              </Menu.Item>
            ))}
          </SubMenu>
        ) : (
          <Menu.Item key={item.link} className={classnames('side-bar-menu', state.pathname?.includes(item.link) ? 'ant-menu-item-selected' : '')}>
            <NavLink key={item.link} to={item.link} onClick={e => onClickNavLink(item.link, e)}>
              <div className="left">
                {getIcon(item.name)}
                <span className="side-bar-item-text">{item.name}</span>
              </div>
              {getMainMenuNumber(item.name)}
            </NavLink>
          </Menu.Item>
        )))}
      </Menu>
      {/* <MessageSubcription /> */}
      {/* <MessageActionSubcription /> */}
    </div>
  );
};

SideBar.defaultProps = {
  menu: [],
};
SideBar.propTypes = {
  menu: PropTypes.arrayOf(PropTypes.shape()),
  deletePathRequest: PropTypes.func.isRequired,
  facility: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  facility: state.facility,
});

const mapDispatchToProps = {
  deletePathRequest,
};
export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
