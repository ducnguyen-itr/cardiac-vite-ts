import { Typography } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';

import CustomAvatar from '../Avatar';

const { Text } = Typography;

const CareGiverTag = (props) => {
  const { data } = props;
  const {
    firstName, lastName, title, roles, photo,
  } = data;
  return (
    <div className="care-giver-tag fr">
      <CustomAvatar
        avatarLink={photo}
        size={40}
        firstName={firstName}
        lastName={lastName}
      />
      <div className="f-c-just-center ml16">
        <Text className="font-14" strong>{title}</Text>
        <Text className="font-12" type="secondary">{roles?.includes('Nurse') ? 'Nurse' : 'Physician'}</Text>
      </div>
    </div>
  );
};

CareGiverTag.defaultProps = {
  data: {},
};

CareGiverTag.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string),
    photo: PropTypes.string,
  }),
};

export default CareGiverTag;
