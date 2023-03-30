import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useMergeState } from '../../Helpers/customHooks';
import clockIcon from '../../Image/Pages/PatientDetails/stop-watch.svg';
import { formatCountDownV2 } from '../../Pages/PatientDetails/CarePlan/helper';
import CustomButton from '../Button/customButton';
import TimerModal from '../Modal/TimerModal';
import './style.scss';

const Timer = () => {
  const startTimeRef = useRef();
  const isUpdateManual = useRef();

  const [state, setState] = useMergeState({
    isShowTimerModal: false,
    timer: null,
    isCounting: false,
    duration: 0,
    status: 'unstarted',
  });

  const onToggleShowTimerModal = (e) => {
    e.stopPropagation();
    setState({ isShowTimerModal: !state.isShowTimerModal });
  };

  const onToggleTimerModal = (e) => {
    e.stopPropagation();
    setState({
      isShowTimerModal: !state.isShowTimerModal,
    });
    const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : {};
    if (state.status === 'unstarted') {
      startTimeRef.current = moment();
      setState({ isCounting: true, status: 'started' });
      _.assign(timerData, { startTime: moment(), timerStatus: 'started' });
      window.localStorage.timerData = JSON.stringify(timerData);
      return;
    }
    if (state.status === 'paused') {
      startTimeRef.current = moment();
      setState({ isCounting: true, status: 'started' });
      _.assign(timerData, { startTime: moment(), timerStatus: 'started' });
      window.localStorage.timerData = JSON.stringify(timerData);
      return;
    }
    if (state.status === 'started') {
      const duration = moment().diff(moment(startTimeRef.current), 'seconds');
      _.assign(timerData, { startTime: moment(), timerStatus: 'paused', duration: state.duration + duration });
      window.localStorage.timerData = JSON.stringify(timerData);
      setState({ duration: state.duration += duration });
      setState({ isCounting: false, status: 'paused' });
    }
  };

  const onDiscard = () => {
    setState({
      // isShowTimerModal: false,
      isCounting: false,
      timer: null,
      status: 'unstarted',
      duration: 0,
    });
    window.localStorage.removeItem('timerData');
  };

  const onUpdateStatus = (status) => {
    if (status === 'started') {
      const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : {};
      _.assign(timerData, { startTime: moment(), timerStatus: 'started' });
      window.localStorage.timerData = JSON.stringify(timerData);
      startTimeRef.current = moment();
      setState({ isCounting: true, status });
      return;
    }
    if (status === 'paused') {
      const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : {};
      const duration = moment().diff(moment(startTimeRef.current), 'seconds');
      _.assign(timerData, { startTime: null, timerStatus: 'paused', duration: state.duration + duration });
      window.localStorage.timerData = JSON.stringify(timerData);
      setState({ duration: state.duration += duration });
      setState({ isCounting: false, status });
    }
  };

  const onClickAddLog = (status) => {
    setState({
      isShowTimerModal: false,
      isCounting: false,
      timer: null,
      status,
      duration: 0,
    });
    window.localStorage.removeItem('timerData');
  };

  const onMutateUpdate = (secondTime) => {
    if (secondTime) {
      const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : {};
      if (state.status === 'unstarted') {
        window.localStorage.timerStatus = JSON.stringify('paused');
        _.assign(timerData, { timerStatus: 'paused' });
        setState({ status: 'paused' });
      }
      isUpdateManual.current = true;
      const newDuration = secondTime;
      _.assign(timerData, { startTime: moment(), duration: newDuration });
      window.localStorage.timerData = JSON.stringify(timerData);
      startTimeRef.current = moment();
      setState({ duration: newDuration, secondTime });
    }
  };

  const onStorageChange = () => {
    const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : null;
    const { startTime = undefined, duration = 0, timerStatus = 'unstarted' } = timerData || {};
    const timer = timerStatus === 'started' ? moment().diff(moment(startTime), 'seconds') + duration : duration;
    setState({
      timer: timer ? formatCountDownV2(timer) : null,
      isCounting: timerStatus === 'started',
      duration,
      status: timerStatus,
    });
    startTimeRef.current = startTime;
  };

  useEffect(() => {
    const timerData = localStorage.timerData ? JSON.parse(localStorage.timerData) : null;
    const { startTime = undefined, duration = 0, timerStatus = 'unstarted' } = timerData || {};
    const timer = timerStatus === 'started' ? moment().diff(moment(startTime), 'seconds') + duration : duration;
    setState({
      timer: timer ? formatCountDownV2(timer) : null,
      isCounting: timerStatus === 'started',
      duration,
      status: timerStatus,
    });
    startTimeRef.current = startTime;

    window.addEventListener('storage', onStorageChange, false);
  }, []);

  useEffect(() => {
    let handleCounting;
    if (isUpdateManual.current) {
      const duration = moment().diff(moment(startTimeRef.current), 'seconds') + state.duration;
      setState({ timer: formatCountDownV2(duration) });
      isUpdateManual.current = false;
    }
    if (state.isCounting) {
      handleCounting = setInterval(() => {
        const duration = moment().diff(moment(startTimeRef.current), 'seconds') + state.duration;
        setState({ timer: formatCountDownV2(duration) });
      }, 1000);
    }
    return () => {
      clearInterval(handleCounting);
    };
  }, [state.isCounting, state.duration]);

  return (
    <>
      {state.status === 'unstarted' ? (
        <CustomButton
          type="ghost"
          ghost
          className="clock-icon-button"
          onClick={e => onToggleShowTimerModal(e)}
          icon={<img src={clockIcon} alt="" />}
        />
      ) : (
        <button
          onClick={e => onToggleShowTimerModal(e)}
          className={classNames('show-timer-button', state.timer ? 'isStarted' : '')}
        >
          <button onClick={e => onToggleTimerModal(e)} className="show-timer-button-icon">
            {state.status === 'started' ? <PauseOutlined /> : <CaretRightOutlined />}
          </button>
          <div>{state.timer || '0:00:00'}</div>
        </button>
      )}

      <TimerModal
        onMinimize={onToggleShowTimerModal}
        onDiscard={onDiscard}
        visible={state.isShowTimerModal}
        isCounting={state.isCounting}
        timer={state.timer}
        status={state.status}
        onUpdateStatus={onUpdateStatus}
        onClickAddLog={onClickAddLog}
        onMutateUpdate={onMutateUpdate}
        duration={state.duration}
        startTime={startTimeRef.current}
      />
    </>
  );
};


export default Timer;
