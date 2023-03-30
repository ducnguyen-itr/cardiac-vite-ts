import { HeartOutlined, HistoryOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import toggleLeftIcon from '../../../Image/Components/VideoCall/toggle-left-icon.svg';
import toggleRightIcon from '../../../Image/Components/VideoCall/toggle-right-icon.svg';
import VitalForm from '../../../Pages/Appointments/ApointmentDetails/Layout/VitalForm';
import CustomButton from '../../Button/customButton';
import AppointmentInfo from './Layout/AppointmentInfo';
import AppointmentHistory from './Layout/History';
import './style.scss';

function VideoCallSideTab(props) {
  const [current, setCurrent] = useState('Info');
  const [isCollapse, setCollapse] = useState(false);
  const [data, setData] = useState({ info: {}, vital: {} });

  const onClickMenu = ({ key }) => {
    setCurrent(key);
  };

  const toggleCollapse = () => {
    setCollapse(prev => !prev);
  };

  useEffect(async () => {
    // const data = await handleFetchInitialData(props.data?.);
    // setData({...props.data, ...data});
  }, [props.data]);

  return (
    <div className={classnames('video-call-side-tab', isCollapse ? 'close-sidebar' : 'open-sidebar')}>
      <Menu selectedKeys={current} className="video-call-side-tab-menu">
        <Menu.Item onClick={onClickMenu} key="Vitals" className="side-bar-menu">
          <HeartOutlined />
          {!isCollapse && <span>Vitals</span>}
        </Menu.Item>
        <Menu.Item onClick={onClickMenu} key="History" className="side-bar-menu">
          <HistoryOutlined />
          {!isCollapse && <span>History</span>}

        </Menu.Item>
        <Menu.Item onClick={onClickMenu} key="Info" className="side-bar-menu">
          <InfoCircleOutlined />
          {!isCollapse && <span>Info</span>}
        </Menu.Item>
        <CustomButton
          type="text"
          onClick={toggleCollapse}
          className="collapse-btn"
          icon={isCollapse ? <img src={toggleLeftIcon} alt="" /> : <img src={toggleRightIcon} alt="" />}
        />
      </Menu>
      <div className="video-call-side-tab-content">
        <div className={classnames('vitals-container', current !== 'Vitals' ? 'display-none' : '')}>
          <VitalForm appointmentStatus={props.appointmentStatus} isCalling data={props?.data?.vital} eventId={props?.data?._id} />
        </div>
        <div className={classnames(current !== 'History' ? 'display-none' : '')}>
          <AppointmentHistory
            patientId={props?.data?.info?.patient?._id}
          />
        </div>
        <div className={classnames(current !== 'Info' ? 'display-none' : '')}>
          <AppointmentInfo data={props?.data?.info} />
        </div>
      </div>
    </div>
  );
}


VideoCallSideTab.defaultProps = {
  appointmentStatus: '',
};

VideoCallSideTab.propTypes = {
  // appointmentId: PropTypes.string.isRequired,
  data: PropTypes.shape().isRequired,
  appointmentStatus: PropTypes.string,
};

export default VideoCallSideTab;
