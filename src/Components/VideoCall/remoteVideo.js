/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import disabledCamIc from '../../Image/Components/VideoCall/gray-off-video.svg';

import { getFullName } from '../../Helpers';
import CustomAvatar from '../Avatar';

const RemoteVideo = forwardRef((props, ref) => (
  <div
    className={classnames('remote-video',
      props.isFull ? '--full-avatar' : '--small-avatar',
      props.className,
      !props.enabled && 'hidden')}
    onClick={() => props.onChooseViewRemoteElement(props.attendeeId)}
  >
    <video
      className={classnames('remote-video__video', props.isPatient ? 'object-fit-cover' : '')}
      ref={ref}
    >
      <track kind="captions" srcLang="en" label="english_captions" />
    </video>
    {!props.isFull && (
      <div className="remote-video__name">
        {props.isMe ? 'You' : props.componentName?.fullName || ''}
      </div>
    )}
    { props.cameraDisabled && (
      <div className={classnames('remote-video__avatar', 'midle-ct')}>
        <CustomAvatar
          className="small-cricle"
          avatarLink={props.componentName?.photo || ''}
          firstName={props.componentName?.firstName || ''}
          lastName={props.componentName?.lastName || ''}
          size={props.isFull ? 80 : 32}
        />
        {
          props.isFull && (
            <div className="remote-video__avatar__info">
              <div className="remote-video__avatar__info__name">
                <span>{getFullName(props.componentName)}</span>
              </div>
              {/* <TimeCounter className="remote-video__avatar__info__time" /> */}
              {/* <div className="remote-video__avatar__info__time">
                <span>{getTiming(props.timer, true)}</span>
              </div> */}
              <img
                src={disabledCamIc}
                alt="Disabled cam"
                className="remote-video__avatar__info__video"
              />
              {/* <div className=''>

              <img
                src={disabledMicIc}
                alt="Disabled cam"
                className="remote-video__avatar__info__mic"
                />
                </div> */}
            </div>
          )
        }
      </div>
    )}
  </div>
));

RemoteVideo.defaultProps = {
  className: '',
  isFull: false,
  isMe: false,
  cameraDisabled: false,
  enabled: false,
  isPatient: false,
  componentName: {
    firstName: '',
    lastName: '',
    fullName: '',
  },
  attendeeId: '',
  onChooseViewRemoteElement: () => { },
  // timer: 0,
};

RemoteVideo.propTypes = {
  className: PropTypes.string,
  isFull: PropTypes.bool,
  isMe: PropTypes.bool,
  cameraDisabled: PropTypes.bool,
  enabled: PropTypes.bool,
  isPatient: PropTypes.bool,
  componentName: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
  }),
  attendeeId: PropTypes.string,
  onChooseViewRemoteElement: PropTypes.func,
  // timer: PropTypes.number,
};

export default RemoteVideo;
