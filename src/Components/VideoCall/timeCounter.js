import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { useMergeState } from '../../Helpers/customHooks';


export const getTiming = (diff, isH = false) => {
  if (isH) {
    if (moment.utc(diff).format('HH') === '00') {
      return moment.utc(diff).format('mm:ss');
    }
    return moment.utc(diff).format('HH:mm:ss');
  }
  return moment.utc(diff).format('mm:ss');
};


const TimeCounter = (props) => {
  const timeRef = useRef(moment());
  const [state, setState] = useMergeState({
    timer: moment().valueOf() - moment(timeRef.current).valueOf(),
  });
  const { className, isHidden } = props;

  useEffect(() => {
    if (isHidden) {
      props.getTimeCounter(state.timer);
    }
  }, [state.timer]);

  useEffect(() => {
    const handleCounting = setInterval(() => {
      setState({ timer: moment().valueOf() - moment(timeRef.current).valueOf() });
    }, 1000);
    return () => {
      clearInterval(handleCounting);
    };
  }, []);
  const { timer } = state;

  return (
    <div className={classnames('count-timer', className, isHidden ? 'dis-none' : '')}>
      <span>
        {getTiming(timer, true)}
      </span>
    </div>
  );
};
TimeCounter.defaultProps = {
  className: '',
  isHidden: false,
  getTimeCounter: () => {},
};
TimeCounter.propTypes = {
  className: PropTypes.string,
  isHidden: PropTypes.bool,
  getTimeCounter: PropTypes.func,
};

export default TimeCounter;
