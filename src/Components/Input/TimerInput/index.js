import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useMergeState } from '../../../Helpers/customHooks';
import InputCT from '../inputCT';
import './style.scss';
import { getInitValue, getSecondsValue, getTimeString } from './helper';

function CustomTimeInput(props) {
  const [state, setState] = useMergeState({
    hourVal: '00',
    minVal: '00',
    secVal: '00',
  });

  const onChange = (name, value) => {
    const reg = /^([0-9:]+)$/;
    if (reg.test(value) || value === '') {
      if (name === 'hourVal') {
        if (parseFloat(value) > 23) {
          setState({ hourVal: '24', minVal: '00', secVal: '00' });
          return;
        }
        setState({ [name]: value });
        return;
      }
      if (name === 'minVal' || name === 'secVal') {
        if (parseFloat(state.hourVal) === 24) {
          setState({ [name]: '00' });
          return;
        }
        if (parseFloat(value) > 59) {
          setState({ [name]: '59' });
          return;
        }
        setState({ [name]: value });
        return;
      }
      setState({ [name]: value });
    }
  };

  const onBlur = (name) => {
    setState({ [name]: getTimeString(state?.[name]) });
    const seconds = getSecondsValue(state);
    props.onChange(props.name, seconds);
  };

  const onFocus = (name) => {
    const input = document.querySelector(`.timer-input${name ? `.${name}` : ''} > .ant-input`);
    if (input) {
      input.select();
    }
  };

  useEffect(() => {
    const initState = getInitValue(props.value);
    setState(initState);
  }, [props.value]);

  return (
    <div className={classnames('timer-input-wrapper', props.className)}>
      <InputCT
        name="hourVal"
        value={state.hourVal}
        onChange={onChange}
        className="timer-input hourVal"
        placeholder="00"
        onBlur={() => onBlur('hourVal')}
        onFocus={() => onFocus('hourVal')}
      />
      <div className="ml10 mr10">:</div>
      <InputCT
        name="minVal"
        value={state.minVal}
        onChange={onChange}
        className="timer-input minVal"
        placeholder="00"
        onBlur={() => onBlur('minVal')}
        onFocus={() => onFocus('minVal')}
      />
      <div className="ml10 mr10">:</div>
      <InputCT
        name="secVal"
        value={state.secVal}
        onChange={onChange}
        className="timer-input secVal"
        placeholder="00"
        onBlur={() => onBlur('secVal')}
        onFocus={() => onFocus('secVal')}
      />
    </div>
  );
}

CustomTimeInput.defaultProps = {
  name: '',
  className: '',
  onChange: () => { },
  value: 0,
};

CustomTimeInput.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.number,
};

export default CustomTimeInput;
