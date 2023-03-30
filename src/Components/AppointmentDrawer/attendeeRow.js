import { Checkbox } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import auth from '../../Helpers/auth';
import CustomAvatar from '../Avatar';

const AttendeeRow = (props) => {
  const { className, data } = props;

  const {
    firstName, lastName, isCheck, role, _id, photo, disabled,
  } = data;

  const onChange = (e) => {
    props.onClick(_id, e.target.checked);
  };

  return (
    <div className={classnames('attendee-row',
      isCheck ? 'attendee-row-active' : '', className)}
    >
      <div className="attendee-row-main">
        <div className="attendee-row-wrapper">
          <CustomAvatar
            avatarLink={photo}
            firstName={firstName}
            lastName={lastName}
            size={32}
          />
          <div className="ml12">
            <div className="b">
              {`${firstName} ${lastName}${_id === auth.userId() ? ' (You)' : ''}`}
            </div>
            <div className="attendee-row-role">
              {role}
            </div>
          </div>
        </div>

        <Checkbox checked={isCheck} onChange={onChange} disabled={disabled} />

      </div>

      {
        disabled && (
          <div className="attendee-row-disabled-text">
            <span>Not available at the selected time</span>
          </div>
        )
      }


    </div>
  );
};
AttendeeRow.defaultProps = {
  className: '',
  data: {},
  onClick: () => { },
};
AttendeeRow.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  onClick: PropTypes.func,
};

export default AttendeeRow;
