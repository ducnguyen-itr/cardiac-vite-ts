import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import {
  CalendarOutlined, EditFilled, RetweetOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import CustomButton from '../../../Button/customButton';


function EventHeader(props) {
  const {
    eventTime, eventDay, isRecurring, recurringText,
  } = props.data || {};
  return (
    <div className={classnames('event-header', props.className)}>
      <div className="event-header-left">
        <div className="event-header-left-event-time-container">
          <p className="event-header-left-event-time">{eventTime}</p>
          {props.isShowEditBtn && (
            <CustomButton
              icon={<EditFilled />}
              className="event-header-edit-btn"
              onClick={props.onClickEdit}
            />
          )}
        </div>

        <div className="event-header-left-event-info">
          <CalendarOutlined className="mr6" />
          <p>{eventDay}</p>
          {isRecurring && (
            <Divider className="mr15 ml15" type="vertical" />
          )}
          {isRecurring && (
            <div className="repeat-container">
              <div className="icon-container">
                <RetweetOutlined />
              </div>
              <p>{recurringText}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

EventHeader.defaultProps = {
  className: '',
  data: {},
  isShowEditBtn: true,
  onClickEdit: () => { },
};


EventHeader.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  isShowEditBtn: PropTypes.bool,
  onClickEdit: PropTypes.func,
};
export default EventHeader;
