import { CloseOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { zeroPad } from '../../Utils';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import './style.scss';

function PatientInfoCard(props) {
  const {
    firstName, lastName, photo, email, carePlanFid, fullName,
  } = props.patientInfo;
  return (
    <div className={classnames('patient-info-card', props.className)}>
      <div className="patient-info-card-header">
        <div className="left-header">
          <CustomAvatar
            avatarLink={photo}
            firstName={firstName}
            lastName={lastName}
            size={32}
          />
          <div className="name-content">
            <div>{fullName}</div>
            <div className="email">{`${email} | Care plan ${zeroPad(carePlanFid)}`}</div>
          </div>
        </div>
        {props.isSearchPatient && <CustomButton onClick={props.onRemove} className="delete-btn" icon={<CloseOutlined />} />}

      </div>
      <div className="patient-info-card-body">
        {_.map(props.data, (x, i) => (
          <div className="patient-info-card-body-item" key={i}>
            <div className="info-title">{x.title}</div>
            <div className="info-data">{x.data}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

PatientInfoCard.defaultProps = {
  data: [],
  patientInfo: {},
  className: '',
  onRemove: () => {},
  isSearchPatient: false,
};
PatientInfoCard.propTypes = {
  data: PropTypes.arrayOf(),
  patientInfo: PropTypes.shape(),
  className: PropTypes.string,
  onRemove: PropTypes.func,
  isSearchPatient: PropTypes.bool,
};

export default PatientInfoCard;
