import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getRestingHeartLineChart } from './helper';


function HeartRateLineChart(props) {
  return (
    <div className={classnames('bioheart-heart-rate-chart', props.className)}>

      {getRestingHeartLineChart({
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
HeartRateLineChart.defaultProps = {
  className: '',
  data: {},
  configChart: {},
};

HeartRateLineChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  configChart: PropTypes.shape(),
};

export default HeartRateLineChart;
