import { Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import CustomAvatar from '../Avatar';
import './style.scss';

const { Text } = Typography;

const HealthcareTag = (props) => {
  const { data } = props;
  const {
    firstName, lastName, title, roles, photo,
  } = data;
  return (
    <div className="healthcare-tag">
      <CustomAvatar
        avatarLink={photo}
        size={22}
        firstName={firstName}
        lastName={lastName}
      />
      <Text className="font-14 healthcare-tag-text" type="secondary">{`${title} ${roles?.includes('Nurse') ? '(Nurse)' : '(Physician)'}`}</Text>
    </div>
  );
};

HealthcareTag.defaultProps = {
  data: {},
};

HealthcareTag.propTypes = {
  /** Data of component */
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    photo: PropTypes.string,
  }),
};

export default HealthcareTag;
