import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import CustomAvatar from '../Avatar';

const PreviewVideo = forwardRef((props, ref) => (
  <div
    className={classnames('preview-video',
      props.className,
      !props.enabled && 'hidden')}
  >
    <video
      className="preview-video__video"
      ref={ref}
    >
      <track kind="captions" srcLang="en" label="english_captions" />
    </video>
    { props.cameraDisabled && (
      <div className="preview-video__avatar">
        <CustomAvatar
          avatarLink={props.componentName?.photo || ''}
          firstName={props.componentName?.firstName || ''}
          lastName={props.componentName?.lastName || ''}
          size={40}
        />
      </div>
    )}
  </div>
));

PreviewVideo.defaultProps = {
  className: '',
  cameraDisabled: false,
  enabled: false,
  componentName: {
    firstName: '',
    lastName: '',
    fullName: '',
  },
};

PreviewVideo.propTypes = {
  className: PropTypes.string,
  cameraDisabled: PropTypes.bool,
  enabled: PropTypes.bool,
  componentName: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    fullName: PropTypes.string,
  }),
};

export default PreviewVideo;
