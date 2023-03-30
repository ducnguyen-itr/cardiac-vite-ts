import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { zeroPad } from '../../../Utils';
import CustomAvatar from '../../Avatar';
import PatientTypeTag from '../../PatientTypeTag';


const PatientAppointmentInfo = (props) => {
  const {
    className, data,
  } = props;
  const {
    firstName, lastName, genderAge, photo, role, isCCM, isRPM, carePlanFid,
  } = data || {};
  return (
    <div className={classnames('patient-appointment-info', className)}>
      <CustomAvatar
        avatarLink={photo}
        size={32}
        firstName={firstName}
        lastName={lastName}
      />
      <div className="f-start-cen">
        <div className="ml12">
          <div className="patient-appointment-info-name f-start-cen">
            <span>{`${firstName} ${lastName}`}</span>
            {isCCM && <PatientTypeTag className="ml10" title="CCM" isShow isCCM />}
            {isRPM && <PatientTypeTag className="ml10" title="RPM" isShow />}
          </div>
          <div className="patient-appointment-info-gender-age">
            {carePlanFid ? <span>{`Care plan ID: ${zeroPad(carePlanFid)}`}</span> : <span>{genderAge || role}</span>}
          </div>
        </div>

      </div>

    </div>
  );
};
PatientAppointmentInfo.defaultProps = {
  className: '',
  data: {},
};
PatientAppointmentInfo.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
};

export default PatientAppointmentInfo;
