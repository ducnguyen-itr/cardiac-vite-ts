import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { getHeartRateChart } from './helper';

function HeartRateRangeChart(props) {
  return (
    <div className={classnames('bioheart-heart-rate-chart', props.className)}>
      {getHeartRateChart({
        data: props.data,
        labelFormatter: props.configChart?.labelFormatter,
        tickInterval: props.configChart?.tickInterval,
        type: props.configChart?.type,
        fromTime: props.configChart.fromTime,
        toTime: props.configChart.toTime,
      })}
    </div>
  );
}
HeartRateRangeChart.defaultProps = {
  className: '',
  data: {},
  configChart: {},
};

HeartRateRangeChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  configChart: PropTypes.shape(),
};

export default HeartRateRangeChart;
