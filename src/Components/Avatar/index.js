import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import classnames from 'classnames';
import { getBackgroundAvatar, getFirstLetterName, getSizeText } from './helper';
import './style.scss';

const CustomAvatar = (props) => {
  const [error, setError] = useState(false);
  const bgClassName = getBackgroundAvatar(props.firstName);
  const sizeClassName = getSizeText(props.size);

  const onError = (e) => {
    if (e.type === 'error') {
      setError(true);
    }
  };

  return (
    <div className={classnames('avatar-ct-wrapper', props.className)}>
      {
        props.avatarLink && !error ? (
          <img
            className={classnames('avatar-ct-link', `avatar-ct-${sizeClassName}`)}
            src={props.avatarLink || ''}
            alt="Avatar"
            onError={onError}
          />
        ) : (
          <Avatar size={props.size} className={classnames('avatar-ct', bgClassName, sizeClassName)}>
            {getFirstLetterName(props.firstName, props.lastName)}
          </Avatar>
        )
      }
    </div>
  );
};

CustomAvatar.defaultProps = {
  className: '',
  firstName: '',
  lastName: '',
  size: 32,
  avatarLink: undefined,
};

CustomAvatar.propTypes = {
  /** Classname of avatar */
  className: PropTypes.string,
  /** First name of avatar */
  firstName: PropTypes.string,
  /** Last name of avatar */
  lastName: PropTypes.string,
  /** Size of avatar */
  size: PropTypes.oneOf([22, 24, 28, 32, 40, 52, 80, 100, 128]),
  /** The address of the image or base64 format for an image avatar (highest priority) */
  avatarLink: PropTypes.string,
};

export default CustomAvatar;
