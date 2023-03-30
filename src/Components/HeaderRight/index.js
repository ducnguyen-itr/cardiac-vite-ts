import {
  BellOutlined, LogoutOutlined, UserOutlined,
} from '@ant-design/icons';
import Auth from '@aws-amplify/auth';
import {
  Badge, Button, Drawer, Dropdown, Menu, PageHeader,
} from 'antd';
import 'antd/dist/antd.css';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import fetchUser from '../../Apollo/Functions/Fetch/fetchUser';
import CONFIG from '../../Config';
import { NOTIFICATION_CENTER_SOCKET_TYPES } from '../../Constants';
import EMITTER_CONSTANTS from '../../Constants/emitter';
import { ALL_CLINIC } from '../../Constants/newPatientData';
import { getFullFacilities } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import {
  useActions, useEmitter, useMergeState, useUpdateEffect,
} from '../../Helpers/customHooks';
import { setFacilityRequest } from '../../Redux/Actions/facility';
import { pushHistory } from '../../Redux/Actions/histories';
import { setLeavePopRequest } from '../../Redux/Actions/leavePopUp';
import { logoutRequest } from '../../Redux/Actions/login';
import {
  deleteAllNotificationRequest, fetchNotificationRequest, fetchNotificationsRequest, updateNotificationsRequest,
} from '../../Redux/Actions/notifications';
import { updateUnreadNotificationCount } from '../../Redux/Actions/unreadNotificationCount';
import CustomAvatar from '../Avatar';
import SelectCT from '../Input/selectCT';
import Profile from '../Profile/profile';
import NotificationCenter from './Layout/notificationCenter';
import './style.scss';

const HeaderRight = (props) => {
  const userIdRef = useRef(auth.userId());
  const facilities = getFullFacilities();
  const leavePopUp = useSelector(state => state.leavePopUp);
  const actions = useActions({ setLeavePopRequest, pushHistory }, []);
  const history = useHistory();
  const [state, setState] = useMergeState({
    isNotiOpen: false,
    isOpenProfile: false,
    isLoading: false,

    selectedFacility: _.isEmpty(props.facility) && facilities.length > 1 ? facilities[0] : props.facility, // undefined,
    facilitiesData: facilities,
  });

  useEffect(() => {
    if (state.isLoading || props.unreadNotificationCount === 0) {
      setState({ isLoading: false });
    }
  }, [props.unreadNotificationCount, props.notifications]);

  const { title, isBack, onBack } = props;
  const { facilitiesData, selectedFacility } = state;

  const onChangeFacility = (key, label) => {
    const item = _.find(facilitiesData || [], x => x.label === label);
    props.setFacilityRequest(item?.label === ALL_CLINIC ? undefined : item);
    auth.setSelectedFacility(item?.label === ALL_CLINIC ? undefined : item);
    setState({ selectedFacility: item });
  };

  const getUserData = async () => {
    try {
      const data = await fetchUser();
      const facilities = auth.getFacilities();
      if (!_.isEqual(facilities, data.facilities)) {
        auth.setFacilities(data.facilities);
      }
    } catch (error) {
      consoleLog(error);
    }
  };

  useLayoutEffect(() => {
    // get userdata after reload
    getUserData();
  }, []);

  useUpdateEffect(() => {
    const userId = auth.userId();
    if (userIdRef.current !== userId) {
      userIdRef.current = userId;
      window.location.reload();
    }
  }, [auth.userId()]);

  const {
    fullName, firstName, lastName, // dob, gender, email,
  } = auth.getLoginData() || {};

  const onClickSignOut = async () => {
    if (leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        func: async () => {
          if (auth.isLoginBioflux()) {
            window.open(CONFIG.LINK_LOGOUT_AWS);
            await Auth.signOut(true);
            props.logoutRequest();
          } else {
            props.logoutRequest();
            history.push('/login');
          }
        },
      });
      return;
    }
    if (auth.isLoginBioflux()) {
      window.open(CONFIG.LINK_LOGOUT_AWS);
      await Auth.signOut(true);
      props.logoutRequest();
    } else {
      props.logoutRequest();
      history.push('/login');
    }
  };

  const toggleNotiModal = () => {
    setState({ isNotiOpen: !state.isNotiOpen });
  };

  const toggleProfileDrawer = () => {
    if (leavePopUp?.isUnsaved) {
      actions.setLeavePopRequest({
        isShowLeaveModal: true,
        func: () => {
          if (history.location.pathname === '/myprofile') return;
          actions.pushHistory(history.location.pathname);
          history.push('/myprofile');
        },
      });
      return;
    }

    if (history.location.pathname === '/myprofile') return;
    actions.pushHistory(history.location.pathname);
    history.push('/myprofile');
  };

  const fetchMoreNotifications = (limit = 5) => {
    props.fetchNotificationsRequest({
      sendingData: {
        filter: {
          type: undefined,
          cursor: _.last(props.notifications)?._id,
          sortOrder: 'desc',
          sortField: '_id',
        },
        limit,
      },
      isLoadMore: true,
    });
  };

  const handleNotificationsListener = async ({ _id, type }) => {
    setState({ isLoading: true });
    switch (type) {
      case NOTIFICATION_CENTER_SOCKET_TYPES.DELETE_ALL: {
        props.deleteAllNotificationRequest();
        props.updateUnreadNotificationCount(0);
        break;
      }
      case NOTIFICATION_CENTER_SOCKET_TYPES.MASK_AS_READ: {
        props.updateNotificationsRequest({ _id, type });
        break;
      }
      case NOTIFICATION_CENTER_SOCKET_TYPES.DELETE: {
        props.updateNotificationsRequest({ _id, type });
        break;
      }
      case NOTIFICATION_CENTER_SOCKET_TYPES.ADD: {
        props.fetchNotificationRequest({
          sendingData: {
            _id,
          },
        });
        setState({ isLoading: false });
        break;
      }
      default: {
        props.fetchNotificationsRequest({
          sendingData: {
            filter: {
              type: undefined,
              cursor: undefined,
              sortOrder: 'desc',
              sortField: '_id',
            },
            limit: props.notifications.length,
          },
          isLoadMore: false,
        });
        break;
      }
    }
  };

  useEmitter(EMITTER_CONSTANTS.NOTIFICATIONS, handleNotificationsListener, [
    state.notifications,
  ]);

  const menu = (
    <Menu>
      <Menu.Item key="1" className="fitems-center" onClick={toggleProfileDrawer}>
        <UserOutlined />
        Your profile
      </Menu.Item>
      <Menu.Item key="2" className="fitems-center" onClick={onClickSignOut}>
        <LogoutOutlined />
        Sign out
      </Menu.Item>
    </Menu>
  );


  return (
    <div className="header-main header-right">
      <Drawer
        placement="right"
        width={400}
        onClose={toggleProfileDrawer}
        visible={state.isOpenProfile}
        closable={false}
        footer={null}
        destroyOnClose
      >
        <Profile onClose={toggleProfileDrawer} />
      </Drawer>

      <PageHeader
        className={`header-navigation-left${isBack ? '' : '-noic'}`}
        onBack={onBack || history.goBack}
        title={title}
      />

      <div className="header-right flex-row__ic__je">

        {facilitiesData.length > 2 && (
          <SelectCT
            className="select-facility"
            name="selectedFacility"
            placeholder="Select..."
            data={facilitiesData}
            value={selectedFacility}
            onChange={onChangeFacility}
            isObject
          />
        )}

        {/* <Timer /> */}

        <Button type="ghost" ghost className="header-notifi-button" onClick={toggleNotiModal}>
          <Badge count={props.unreadNotificationCount > 0 ? props.unreadNotificationCount : 0} size="small">
            <BellOutlined className="header-bell-icon" />
          </Badge>
        </Button>

        <Dropdown
          overlayClassName="header-dropdown-menu"
          className="header-menu"
          overlay={menu}
          trigger={['click']}
        >
          <div className="header-menu-main">
            <CustomAvatar
              avatarLink={auth.getAvatar()}
              className="mr16"
              firstName={firstName}
              lastName={lastName}
              size={32}
            />
            {/* <Typography.Text strong>
              {fullName}
              <CaretDownOutlined size={8} className="header-arrow-icon ml-1" />
            </Typography.Text> */}
          </div>
        </Dropdown>
      </div>

      <NotificationCenter
        fetchMoreNotifications={fetchMoreNotifications}
        data={props.notifications}
        onClose={toggleNotiModal}
        visible={state.isNotiOpen}
        isEndOfNotifications={props.isEndOfNotifications}
        isLoadingWholePage={state.isLoading}
      />

    </div>
  );
};

HeaderRight.defaultProps = {
  title: '',
  isBack: false,
  onBack: () => { },
};

HeaderRight.propTypes = {
  title: PropTypes.string,
  isBack: PropTypes.bool,
  onBack: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  unreadNotificationCount: PropTypes.number.isRequired,
  isEndOfNotifications: PropTypes.bool.isRequired,
  fetchNotificationsRequest: PropTypes.func.isRequired,
  fetchNotificationRequest: PropTypes.func.isRequired,
  deleteAllNotificationRequest: PropTypes.func.isRequired,
  updateNotificationsRequest: PropTypes.func.isRequired,
  logoutRequest: PropTypes.func.isRequired,
  updateUnreadNotificationCount: PropTypes.func.isRequired,
  setFacilityRequest: PropTypes.func.isRequired,
  facility: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  notifications: state.notifications,
  unreadNotificationCount: state.unreadNotificationCount,
  isEndOfNotifications: state.isEndOfNotifications,
  facility: state.facility,
});

const mapDispatchToProps = {
  fetchNotificationsRequest,
  fetchNotificationRequest,
  deleteAllNotificationRequest,
  updateNotificationsRequest,
  logoutRequest,
  updateUnreadNotificationCount,
  setFacilityRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderRight);
