import { ControlledMenu, MenuItem, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { useMergeState } from '../../Helpers/customHooks';
import arrowIc from '../../Image/Components/VideoCall/arrow.svg';
import callIc from '../../Image/Components/VideoCall/call.svg';
import checkIc from '../../Image/Components/VideoCall/check.svg';
import exitFullScreenIc from '../../Image/Components/VideoCall/exitFullScreen.svg';
import fullScreenIc from '../../Image/Components/VideoCall/fullScreen.svg';
import micIc from '../../Image/Components/VideoCall/mic.svg';
import moreIc from '../../Image/Components/VideoCall/more.svg';
import offMicIc from '../../Image/Components/VideoCall/offMic.svg';
import offVideoIc from '../../Image/Components/VideoCall/offVideo.svg';
import videoIc from '../../Image/Components/VideoCall/video.svg';
import IconButton from '../Button/iconButton';

const VideoCallTool = (props) => {
  const moreButtonRef = useRef(null);
  const [state, setState] = useMergeState({
    isMoreActionOpen: false,
  });

  const onMoreActionClick = useCallback(() => {
    setState({ isMoreActionOpen: true });
  }, []);

  const subMenuLabel = useCallback(() => (
    <div className="sub-menu-label">
      <span>Switch camera</span>
      <img src={arrowIc} alt="Arrow icon" />
    </div>
  ), []);

  const cameraItems = useCallback(() => (
    _.map(props.cameraDevices, x => (
      <MenuItem
        key={x.value}
        value={x.value}
        onClick={() => props.onCameraChanged(x)}
      >
        <div className="camera-selected-label">
          <span>{x.label}</span>
          {x.value === props.cameraDeviceSelected?.value && (
            <img src={checkIc} alt="Check icon" />
          )}
        </div>
      </MenuItem>
    ))
  ));

  return (
    <div className={classnames('video-call-tool', props.className)}>
      <ControlledMenu
        anchorRef={moreButtonRef}
        isOpen={state.isMoreActionOpen}
        onClose={() => setState({ isMoreActionOpen: false })}
      >
        {/* <MenuItem
          value="Invite"
          onClick={() => props.onInviteClick()}
        >
          Invite...
        </MenuItem> */}
        <SubMenu label={subMenuLabel()}>
          {cameraItems()}
        </SubMenu>
      </ControlledMenu>
      <IconButton
        ref={moreButtonRef}
        iconComponent={(<img src={moreIc} alt="More icon" />)}
        onClick={_.throttle(() => { onMoreActionClick(); },
          props.throttleTimeClick,
          { leading: false, trailing: true })
        }
      />
      <IconButton
        className="ml24"
        iconComponent={(
          <img
            src={props.isFullScreen ? exitFullScreenIc : fullScreenIc}
            alt="Full screen icon"
          />
        )}
        onClick={_.throttle(() => { props.onModeScreenChanged(!props.isFullScreen); },
          props.throttleTimeClick,
          { leading: false, trailing: true })
        }
      />
      <IconButton
        className="ml24"
        // disabled={props.isDisabledMicrophone}
        iconComponent={(
          <img
            src={props.micDisabled || props.isDisabledMicrophone ? offMicIc : micIc}
            alt="Mic icon"
          />
        )}
        onClick={_.throttle(() => { props.onMicroStateChanged(!props.micDisabled); },
          props.throttleTimeClick,
          { leading: false, trailing: true })
        }
      />
      <IconButton
        className="ml24"
        // disabled={props.isDisabledCamera}
        iconComponent={(
          <img
            src={props.cameraDisabled || props.isDisabledCamera ? offVideoIc : videoIc}
            alt="Video icon"
          />
        )}
        onClick={_.throttle(() => { props.onCameraStateChanged(!props.cameraDisabled); },
          props.throttleTimeClick,
          { leading: false, trailing: true })
        }
      />
      <IconButton
        className="ml48 --end-call"
        iconComponent={(<img src={callIc} alt="Call icon" />)}
        onClick={_.throttle(() => { props.onEndCallClick(); },
          props.throttleTimeClick,
          { leading: false, trailing: true })
        }
      />
    </div>
  );
};

VideoCallTool.defaultProps = {
  className: '',
  throttleTimeClick: 500,
  micDisabled: false,
  cameraDisabled: false,
  isFullScreen: false,
  cameraDevices: [],
  cameraDeviceSelected: undefined,
  onCameraChanged: () => {},
  // onInviteClick: () => {},
  onModeScreenChanged: () => {},
  onMicroStateChanged: () => {},
  onCameraStateChanged: () => {},
  onEndCallClick: () => {},
  isDisabledMicrophone: false,
  isDisabledCamera: false,
};

VideoCallTool.propTypes = {
  className: PropTypes.string,
  throttleTimeClick: PropTypes.number,
  micDisabled: PropTypes.bool,
  cameraDisabled: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  cameraDevices: PropTypes.arrayOf(PropTypes.shape()),
  cameraDeviceSelected: PropTypes.shape(),
  onCameraChanged: PropTypes.func,
  // onInviteClick: PropTypes.func,
  onModeScreenChanged: PropTypes.func,
  onMicroStateChanged: PropTypes.func,
  onCameraStateChanged: PropTypes.func,
  onEndCallClick: PropTypes.func,
  isDisabledMicrophone: PropTypes.bool,
  isDisabledCamera: PropTypes.bool,
};

export default VideoCallTool;
