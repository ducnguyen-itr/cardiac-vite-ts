import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getActivityChart } from './helper';

function ActiveMinuteChart(props) {
  return (
    <div className={classnames('bioheart-heart-rate-chart', props.className)}>
      {getActivityChart({
        data: props.data?.activity,
        labelFormatter: props.configChart?.labelFormatter,
        tickInterval: props.configChart?.tickInterval,
        type: props.configChart?.type,
        fromTime: props.configChart?.fromTime,
        toTime: props.configChart?.toTime,
      })}
    </div>
  );
}

ActiveMinuteChart.defaultProps = {
  className: '',
  data: {},
  configChart: {},
};

ActiveMinuteChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  configChart: PropTypes.shape(),
};

export default ActiveMinuteChart;
