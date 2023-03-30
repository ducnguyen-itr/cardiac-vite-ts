import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Slider, Switch } from 'antd';
import './style.scss';
import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import _ from 'lodash';
import CustomButton from '../Button/customButton';
import { useUpdateEffect } from '../../Helpers/customHooks';
import { formatCountDownMMSS } from '../../Utils';

function CustomVideoPlayer(props) {
  const videoRef = useRef(null);
  const reloadAffterError = useRef(false);
  const durationRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoTime, setVideoTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const videoHandler = (control) => {
    if (control === 'play') {
      videoRef.current.play();
      setPlaying(true);
      const vid = document.getElementById('video1');
      setCurrentTime(videoRef.current?.currentTime);
      setProgress((videoRef.current?.currentTime / videoTime) * 100);
      durationRef.current = videoRef.current?.currentTime;
      setVideoTime(vid.duration);
    } else if (control === 'pause') {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const onCLickVideo = () => {
    videoHandler(playing ? 'pause' : 'play');
  };

  const onErrorVideo = () => {
    reloadAffterError.current = true;
    props.onErrorVideo();
  };

  const onChangeProgress = (value) => {
    const newVideoTime = videoTime * value / 100;
    setCurrentTime(newVideoTime);
    setProgress(value);

    _.assign(videoRef.current, { currentTime: newVideoTime });
    durationRef.current = newVideoTime;
  };

  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentTime(videoRef.current?.currentTime);
      setProgress((durationRef.current / videoTime) * 100);
      durationRef.current = videoRef.current?.currentTime;
      if (videoRef.current?.currentTime === videoTime) {
        setPlaying(false);
        clearInterval(videoInterval);
      }
    }, 1000);

    return () => {
      clearInterval(videoInterval);
    };
  }, [playing, videoRef.current?.currentTime]);

  useUpdateEffect(() => {
    if (props.url && durationRef.current && reloadAffterError.current) {
      setCurrentTime(durationRef.current);
      setProgress((durationRef.current / videoTime) * 100);
      _.assign(videoRef.current, { currentTime: durationRef.current });
      videoRef.current.play();
      reloadAffterError.current = false;
    }
  }, [props.url]);

  // const loadeddata = (e) => {
  //   const vid = document.getElementById('video1');
  //   setVideoTime(vid.duration);
  // };

  return (
    <div className="custom-video-player">
      <video
        id="video1"
        ref={videoRef}
        className="video"
        src={props.url}
        onClick={onCLickVideo}
        onError={onErrorVideo}
        // onloadedmetadata={loadeddata}
      >
        <track kind="captions" {...props} />
      </video>

      <div className="controls-ontainer">
        <div className="button-controls">
          <CustomButton
            className="play-button"
            onClick={() => { videoHandler(playing ? 'pause' : 'play'); }}
            icon={playing ? <PauseOutlined /> : <CaretRightOutlined />}
          />
        </div>
        <div className="time-controls">
          <div className="controls-time">
            {`${Math.floor(currentTime / 60)
            }:${
              (`0${Math.floor(currentTime % 60)}`).slice(-2)}`}
          </div>
          <div className="progress-bar-container">
            <Slider tipFormatter={value => formatCountDownMMSS(videoTime * value / 100)} step={0.01} value={progress} onChange={onChangeProgress} />
          </div>
          <div className="controls-time">
            {`${Math.floor(videoTime / 60)
            }:${
              (`0${Math.floor(videoTime % 60)}`).slice(-2)}`}
          </div>
        </div>
      </div>
    </div>
  );
}
CustomVideoPlayer.defaultProps = {
  url: '',
  onErrorVideo: () => {},
};

CustomVideoPlayer.propTypes = {
  /** Video url */
  url: PropTypes.string,
  /** video error event */
  onErrorVideo: PropTypes.func,
};

export default CustomVideoPlayer;
