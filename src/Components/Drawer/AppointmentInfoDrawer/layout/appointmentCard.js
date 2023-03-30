import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import classNames from 'classnames';
import editIcon from '../../../../Image/Pages/PatientDetails/move-to-detail-ic.svg';
import CustomButton from '../../../Button/customButton';

function AppointmentCard(props) {
  return (
    <div className={classNames('appointment-card', props.className, props.isActive ? ' active' : '')}>
      <div className="appointment-card-date">
        <div>{props.data?.dateFormatted || '--'}</div>
        <CustomButton onClick={() => props.onGoDetailClick(props.data?._id)} className="go-detail-btn" icon={<img src={editIcon} alt="" />} />
      </div>
      <div className="appointment-card-row">
        <div className="appointment-card-col">Attendees</div>
        <div className="appointment-card-col">{props.data?.attenddeeFormat || '--'}</div>
      </div>
      <div className="appointment-card-row">
        <div className="appointment-card-col">Appointment type</div>
        <div className="appointment-card-col">{props.data?.appointmentType || '--'}</div>
      </div>
      {props.data?.appointmentType === 'In-person' && (
        <div className="appointment-card-row">
          <div className="appointment-card-col">Clinic</div>
          <div className="appointment-card-col">{props.data?.facilityName || '--'}</div>
        </div>
      )}
    </div>
  );
}

AppointmentCard.defaultProps = {
  data: {},
  className: '',
  isActive: false,
  onGoDetailClick: () => {},
};

AppointmentCard.propTypes = {
  data: PropTypes.shape(),
  isActive: PropTypes.bool,
  className: PropTypes.string,
  onGoDetailClick: PropTypes.func,
};

export default AppointmentCard;
