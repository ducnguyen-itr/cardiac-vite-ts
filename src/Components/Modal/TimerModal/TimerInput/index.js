import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMergeState } from '../../../../Helpers/customHooks';
import InputCT from '../../../Input/inputCT';
import './style.scss';
import { formatTimerValue } from '../helper';
import CustomButton from '../../../Button/customButton';

function TimerInput(props) {
  const [state, setState] = useMergeState({
    isInput: false,
    newTimer: props.timer || '0:00:00',
    isFocus: false,
    lastTimer: '',
  });


  const onTimerClick = () => {
    setState({ isInput: true, isFocus: true, lastTimer: props.timer });
    const input = document.getElementById(props.name ? props.name : 'timer-input-id-2');
    if (input) {
      input.focus();
      input.select();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { isValid, secondTime } = formatTimerValue(state.newTimer);
    if (isValid && state.lastTimer !== state.newTimer) {
      props.onUpdateTimer(secondTime);
    }
    setState({ isInput: false, newTimer: props.timer, isFocus: false });
  };


  const onBlurTimer = () => {
    const { isValid, secondTime } = formatTimerValue(state.newTimer);
    if (isValid && state.lastTimer !== state.newTimer) {
      props.onUpdateTimer(secondTime);
    }
    setState({ isInput: false, newTimer: props.timer, isFocus: false });
  };


  const onTimerChange = (name, value) => {
    const reg = /^([0-9:]+)$/;
    if (reg.test(value) || value === '') {
      setState({ newTimer: value });
    }
  };
  useEffect(() => {
    if (!state.isFocus) {
      setState({ newTimer: props.timer || '0:00:00' });
    }
  }, [props.timer]);
  return (
    <div className="timer-input-container">
      <form className={!state.isInput ? 'posisition-abs' : ''} onSubmit={onSubmit}>
        <InputCT
          inputId={props.name ? props.name : 'timer-input-id-2'}
          className="timer-input"
          // type="NUMBER"
          placeholder={props.timer || '0:00:00'}
          onBlur={onBlurTimer}
          onChange={onTimerChange}
          value={state.newTimer}
        />
      </form>

      {!state.isInput && (
        <button
          onClick={onTimerClick}
          className="runner-time"
        >
          {props.timer || '0:00:00'}
        </button>
      )}
    </div>
  );
}

TimerInput.defaultProps = {
  name: '',
  timer: '',
  onUpdateTimer: () => { },
};

TimerInput.propTypes = {
  name: PropTypes.string,
  timer: PropTypes.string,
  onUpdateTimer: PropTypes.func,
};

export default TimerInput;
