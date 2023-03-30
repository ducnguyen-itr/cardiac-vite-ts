import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomAvatar from '../Avatar';


const PatientAppointmentInfo = (props) => {
  const {
    className, firstName, lastName, genderAge, photo,
  } = props;
  return (
    <div className={classnames('patient-appointment-info', className)}>
      <CustomAvatar
        avatarLink={photo}
        size={32}
        firstName={firstName}
        lastName={lastName}
      />
      <div className="ml12">
        <div className="patient-appointment-info-name">
          <span>{`${firstName} ${lastName}`}</span>
        </div>
        <div className="patient-appointment-info-gender-age">
          <span>{genderAge}</span>
        </div>
      </div>
    </div>
  );
};
PatientAppointmentInfo.defaultProps = {
  className: '',
  firstName: '',
  lastName: '',
  genderAge: '',
  photo: '',
};
PatientAppointmentInfo.propTypes = {
  className: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  genderAge: PropTypes.string,
  photo: PropTypes.string,
};

export default PatientAppointmentInfo;
