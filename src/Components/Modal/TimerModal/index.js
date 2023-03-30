import {
  CaretRightOutlined, DeleteOutlined, DownOutlined, MinusCircleFilled, PauseOutlined, PlusOutlined, UpOutlined,
} from '@ant-design/icons';
import { Modal, Space, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import auth from '../../../Helpers/auth';
import consoleLog from '../../../Helpers/consoleLog';
import { useMergeState } from '../../../Helpers/customHooks';
import { getParticipantData, handleFetchingUserData } from '../../../Pages/PatientDetails/TimeTrackingSuperbill/TimeTrackingDetail/helper';

import { showFailedMsg, showSuccessMsg } from '../../../Utils/showNotification';
import CustomButton from '../../Button/customButton';
import DebounceSelect from '../../Input/debounceSelect';
import InputCT from '../../Input/inputCT';
import SelectCT from '../../Input/selectCT';
import SelectCTV2 from '../../Input/selectCTV2';
import {
  fetchPatientData, handleOnAddTimeLog, isDisabledAddLog,
} from './helper';
import './style.scss';
import TimerInput from './TimerInput';

function TimerModal(props) {
  const draggleRef = useRef();
  const facilityIdRef = useRef();
  const activityCode = useRef(auth.getTimeSheetKey());
  const userData = useRef([]);
  const [isShowMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginData = auth.getLoginData();

  const [state, setState] = useMergeState({
    participants: [{
      value: auth.userId(),
      label: loginData?.fullName ? `${loginData?.fullName} (You)` : '',
    }],
    selectedPatient: {},
    activity: null,
    // billable: false,
    notes: '',
  });
  const [searchState, setSearchState] = useMergeState({
    isSearched: false,
    shouldLoadMore: true,
    searchOption: {},
  });
  const {
    participants,
  } = state;

  const { visible } = props;
  const [dragState, setDragState] = useMergeState({
    disabled: true,
    bounds: {
      left: 0, top: 0, bottom: 0, right: 0,
    },
  });


  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setDragState({
      bounds: {
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      },
    });
  };

  const fetchingUserData = async (patientData) => {
    const { facilityId } = patientData || {};
    userData.current = await handleFetchingUserData({
      facilityId: facilityId || undefined,
    });
  };

  const fetchPatientOptions = async (value, isLoadMore = false, lastOptions = []) => {
    try {
      const { data, searchOption, shouldLoadMore } = await fetchPatientData(value, isLoadMore, lastOptions, searchState.searchOption);
      setSearchState({ isSearched: true, searchOption, shouldLoadMore });
      return data;
    } catch (error) {
      consoleLog(error);
      return [];
    }
  };

  const toggleShowMore = () => {
    setShowMore(prev => !prev);
  };

  const onChange = (name, value) => {
    if (name === 'selectedPatient') {
      setState({ [name]: value.option });
    } else {
      setState({ [name]: value });
    }
  };

  // const onChangeSwith = (value) => {
  //   setState({ billable: value });
  // };

  const onParticipantChange = (name, value, i) => {
    const objValue = { value: value?.value, label: value?.label };
    participants[i + 1] = _.cloneDeep(objValue);
    setState({ participants: _.cloneDeep(participants) });
  };

  const resetState = () => {
    setState({
      participants: [{
        value: auth.userId(),
        label: loginData?.fullName ? `${loginData?.fullName} (You)` : '',
      }],
      selectedPatient: {},
      activity: null,
      // billable: false,
      notes: '',
    });
  };

  const onClickAddMore = () => {
    participants.push(undefined);
    setState({ participants });
  };

  const onClickStart = () => {
    props.onUpdateStatus('started');
  };

  const onClickPause = () => {
    props.onUpdateStatus('paused');
  };

  const onClickResume = () => {
    props.onUpdateStatus('started');
  };

  const onAddLog = async () => {
    setLoading(true);
    const timer = props.startTime && props.status !== 'paused'
      ? moment().diff(moment(props.startTime), 'seconds') + props.duration : props.duration;
    if (parseInt(timer, 10) > 86400) {
      showFailedMsg('Maximum duration allowed for each time log is 24 hours.');
      setLoading(false);
      return;
    }
    try {
      onClickPause();
      await handleOnAddTimeLog(state, activityCode.current, timer);
      resetState();
      showSuccessMsg('Successfully added the time log');
      window.localStorage.removeItem('timerState');
      props.onClickAddLog('unstarted');
    } catch (error) {
      showFailedMsg('Failed to add the time log');
      consoleLog(error);
    }
    setLoading(false);
  };

  const onDiscard = () => {
    setState({
      participants: [{
        value: auth.userId(),
        label: loginData?.fullName ? `${loginData?.fullName} (You)` : '',
      }],
      selectedPatient: {},
      activity: null,
      notes: '',
    });
    props.onDiscard();
    window.localStorage.removeItem('timerState');
  };

  const isShowDiscard = () => {
    if (props.timer) return true;
    if (!_.isEmpty(state.selectedPatient) || state.activity || state.notes) return true;
    if (state.participants?.length > 1) return true;
    return false;
  };

  useEffect(() => {
    if (!_.isEmpty(state.selectedPatient) && state.selectedPatient.facilityId !== facilityIdRef.current) {
      facilityIdRef.current = state.selectedPatient.facilityId;
      fetchingUserData(state.selectedPatient);
    }
  }, [state.selectedPatient]);

  const onStorageChange = () => {
    const timerState = localStorage.timerState ? JSON.parse(localStorage.timerState) : {
      participants: [{
        value: auth.userId(),
        label: loginData?.fullName ? `${loginData?.fullName} (You)` : '',
      }],
      selectedPatient: {},
      activity: null,
      notes: '',
    };
    setState(timerState);
  };

  useEffect(() => {
    onStorageChange();
    window.addEventListener('storage', onStorageChange, false);
  }, []);

  useEffect(() => {
    window.localStorage.timerState = JSON.stringify(state);
  }, [state]);

  const showParticipantItem = (x, i) => (
    <div className="add-participan-item fr mt8" key={i}>
      <SelectCTV2
        name="participants"
        placeholder="Select a nurse/physician"
        data={getParticipantData(userData.current, participants)}
        value={x}
        onChange={(name, value) => onParticipantChange(name, value, i)}
        showSearch
        isObject
      />

      <CustomButton
        onClick={() => {
          _.remove(participants, (y, index) => index === i + 1);
          setState({ participants });
        }}
        className="icon-btn-ct ml8"
        icon={<DeleteOutlined />}
      />
    </div>
  );
  const disabledAddMore = () => {
    if (participants.includes(undefined)) {
      return true;
    }
    if (_.isEmpty(state.selectedPatient)) {
      return true;
    }
    return false;
  };

  const renderShowMore = () => (
    <div>
      <InputCT
        name="notes"
        className="mt12"
        title="Notes (optional)"
        type="TEXTAREA"
        value={state.notes}
        onChange={onChange}
        placeholder="Notes..."
      />

      <InputCT
        disabled
        title="Participant"
        value={participants[0]?.label}
        className="mt12"
      />

      {
        _.map(participants.slice(1), (x, i) => showParticipantItem(x, i))
      }

      <CustomButton
        disabled={disabledAddMore()}
        type="link"
        className="add-participan-btn"
        onClick={onClickAddMore}
        icon={<PlusOutlined className="mr4" />}
        label="Add participant"
      />
    </div>
  );

  const renderFooter = () => {
    switch (props.status) {
      case 'unstarted':
        return (
          <CustomButton
            icon={<CaretRightOutlined />}
            className="start-button mt16 mb8"
            type="primary"
            onClick={onClickStart}
            label="Start"
          />
        );
      case 'started':
        return (
          <div className="started-button-containt mt16 mb8">
            <CustomButton
              onClick={onClickPause}
              icon={<PauseOutlined />}
              ghost
              type="primary"
              label="Pause"
            />
            <CustomButton
              onClick={onAddLog}
              disabled={isDisabledAddLog(state, props.timer)}
              icon={<PlusOutlined />}
              type="primary"
              label="Add log"
            />
          </div>
        );

      case 'paused':
        return (
          <div className="started-button-containt mt16 mb8">
            <CustomButton
              onClick={onClickResume}
              icon={<CaretRightOutlined />}
              ghost
              type="primary"
              label="Resume"
            />
            <CustomButton
              onClick={onAddLog}
              disabled={isDisabledAddLog(state, props.timer)}
              icon={<PlusOutlined />}
              type="primary"
              label="Add log"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderMainView = () => (
    <div className="timer-modal-content">
      <DebounceSelect
        title="Patient"
        name="selectedPatient"
        placeholder="Search and select"
        fetchOptions={fetchPatientOptions}
        onChange={onChange}
        notFoundContent={searchState?.isSearched ? <div>No results</div> : null}
        value={state.selectedPatient?.fullName}
        shouldLoadMore={searchState?.shouldLoadMore}
      />
      <SelectCT
        title="Activity"
        placeholder="Select activity"
        className="mt12"
        name="activity"
        value={state.activity}
        onChange={onChange}
        data={_.sortBy(_.map(activityCode.current, x => x.value))}
      />

      <TimerInput
        timer={props.timer}
        onUpdateTimer={props.onMutateUpdate}
      />

      {isShowMore ? (
        <button onClick={toggleShowMore} className="show-more-btn">
          <div className="show-more-btn-title">
            Show less
          </div>
          <UpOutlined />
        </button>
      ) : (
        <button onClick={toggleShowMore} className="show-more-btn">
          <div className="show-more-btn-title">
            Show more
          </div>
          <DownOutlined />
        </button>
      )}
      {isShowMore && renderShowMore()}
      {renderFooter()}
    </div>
  );

  return (
    <div>
      <Modal
        className="timer-modal-wrapper"
        width={252}
        title={(
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (dragState.disabled) {
                setDragState({
                  disabled: false,
                });
              }
            }}
            onMouseOut={() => {
              setDragState({
                disabled: true,
              });
            }}
            onFocus={() => { }}
            onBlur={() => { }}
          >
            <div className="timer-modal-custom-header">
              <CustomButton
                onClick={props.onMinimize}
                className="minimize-btn"
                shape="circle"
                icon={<MinusCircleFilled />}
              />
              {isShowDiscard() && <CustomButton onClick={onDiscard} danger className="discard-btn" label="Discard" />}
            </div>
          </div>
        )}
        mask={false}
        visible={visible}
        onCancel={props.onMinimize}
        maskClosable={false}
        modalRender={modal => (
          <Draggable
            disabled={dragState.disabled}
            bounds={dragState.bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        {
          loading && (
            <Space className="loading-space" size="middle">
              <Spin size="large" />
            </Space>
          )
        }
        {renderMainView()}
      </Modal>
    </div>
  );
}

TimerModal.defaultProps = {
  visible: false,
  onMinimize: () => { },
  onDiscard: () => { },
  onUpdateStatus: () => { },
  onClickAddLog: () => { },
  onMutateUpdate: () => { },
  timer: '0:00:00',
  status: '',
  startTime: '',
  duration: 0,
};

TimerModal.propTypes = {
  visible: PropTypes.bool,
  onMinimize: PropTypes.func,
  onDiscard: PropTypes.func,
  timer: PropTypes.string,
  onUpdateStatus: PropTypes.func,
  onClickAddLog: PropTypes.func,
  onMutateUpdate: PropTypes.func,
  status: PropTypes.string,
  startTime: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  duration: PropTypes.number,
};

export default TimerModal;
