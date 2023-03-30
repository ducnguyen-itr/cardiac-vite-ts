import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import Modal from 'antd/lib/modal/Modal';
import {
  Button, Dropdown, Menu, Space, Spin,
} from 'antd';
import { CloseOutlined, DashOutlined, UserOutlined } from '@ant-design/icons';
import _ from 'lodash';
import CustomAvatar from '../../Avatar';
import MessageItem from '../../../Pages/Messages/MessageChatView/MessageItem';
import MessageInput from '../../MessageInput';
import { useIntersectionObserver, useUpdateEffect } from '../../../Helpers/customHooks';

const patientInfoFake = {
  firstName: 'duc',
  lastName: 'duc',
  fullName: 'duc duc',
};

const tempData = [
  {
    isMe: false,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (Physician)',
    },
    time: '10:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
    ],
  },
  {
    isMe: true,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (You)',
    },
    time: '11:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
      {
        msg: 'Sed hendrerit scelerisque sem, sit amet sodales diam mollis in.',
      },
    ],
  },
  {
    isMe: false,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (Physician)',
    },
    time: '10:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
    ],
  },
  {
    isMe: true,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (You)',
    },
    time: '11:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
      {
        msg: 'Sed hendrerit scelerisque sem, sit amet sodales diam mollis in.',
      },
    ],
  },
  {
    isMe: false,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (Physician)',
    },
    time: '10:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
    ],
  },
  {
    isMe: true,
    info: {
      firstName: 'Duc',
      lastName: 'Nguyen',
      fullName: 'Duc Nguyen (You)',
    },
    time: '11:00 AM',
    messages: [
      {
        msg: 'Donec vel massa eu quam convallis vestibulum. Ut at iaculis dolor. Suspendisse id erat vel ante facilisis finibus.',
      },
      {
        msg: 'Sed hendrerit scelerisque sem, sit amet sodales diam mollis in.',
      },
    ],
  },
];

function MessageBarModal(props) {
  const bodyRef = useRef();
  const height = useRef();
  const dropDownMenu = useRef([
    {
      value: 'Open chat',
    },
    {
      value: 'Set auto message',
    },
  ]);

  const [topElement, setTopElement] = useState();
  const [data, setData] = useState(tempData);
  const [loading, setLoading] = useState(false);
  const onClickCancel = () => {};
  const handleMenuClick = (e) => {
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.message-item');
    setTopElement(elements[1]);
  }, []);

  useUpdateEffect(() => {
    const elements = document.querySelectorAll('.message-item');
    setTopElement(elements[1]);
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current?.scrollHeight - height.current;
    }
    height.current = bodyRef.current?.scrollHeight;
  }, [data]);

  useLayoutEffect(() => {
    height.current = bodyRef.current?.scrollHeight;
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current?.scrollHeight;
    }
  }, []);

  const handleLoadMore = async () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setData(data => [...tempData.slice(4), ...data]);
      setLoading(false);
    }, 1000);
  };

  useIntersectionObserver(topElement, handleLoadMore, () => {}, [data, loading]);

  const menu = (
    <Menu onClick={handleMenuClick} className="message-drop-down-menu">
      {_.map(dropDownMenu.current, (x, i) => (
        <Menu.Item key={x.value} value={x.value}>
          {x.value}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <Modal
      visible={props.visible}
      width={360}
      mask={false}
      className="message-modal-wrapper"
      // getContainer={() => document.querySelector('container-messsage-modal')}
      title={(
        <div className="message-modal-custom-header">
          <div className="mess-avt-content">
            <CustomAvatar
              firstName={props.patientInfo?.firstName}
              lastName={props.patientInfo?.lastName}
              size={24}
            />
            <div className="main-name">{props.patientInfo?.fullName}</div>
          </div>
          <div className="fcen">
            <Dropdown trigger="click" overlay={menu} placement="bottomLeft">
              <DashOutlined />
            </Dropdown>
            <Button onClick={props.onClose} className="clone-btn" icon={<CloseOutlined />} />
          </div>
        </div>
      )}
      onCancel={onClickCancel}
    >
      <div className="message-chat-view-bar">
        <div className="message-chat-view-body" ref={bodyRef}>
          {loading && (
          <div className="message-loading">
            <Space className="" size="middle">
              <Spin size="large" />
            </Space>
          </div>
          )}
          {_.map(data, (item, i) => (
            <MessageItem
              key={i}
              isMe={item.isMe}
              info={item.info}
              time={item.time}
              messages={item.messages}
            />
          ))}

        </div>

        <div className="message-input-container-bar">
          {/* <div className="scroll-to-btm">
          <Button onClick={onClickScrollToBtm} shape="circle" icon={<ArrowDownOutlined />} />
        </div> */}
          <MessageInput />
        </div>
        <div className="message-chat-footer" />
      </div>
    </Modal>
  );
}

MessageBarModal.defaultProps = {
  visible: false,
  patientInfo: patientInfoFake,
  onClose: () => {},
};
MessageBarModal.propTypes = {
  visible: PropTypes.bool,
  patientInfo: PropTypes.shape(),
  onClose: PropTypes.func,
};

export default MessageBarModal;
