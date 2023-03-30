import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TYPE_CHART_ENUM } from '../../Constants/chart';
import ActiveMinuteChart from './ActiveMinuteChart';
import './style.scss';
import HeartRateRangeChart from './HeartRateRangeChart';
import HeartRateLineChart from './HeartRateLineChart';
import WrapperChartHeader from '../WrapperChartHeader';

function BiohaertChart(props) {
  const renderChart = (type, data) => {
    switch (type) {
      case TYPE_CHART_ENUM.COLUMN:
        return <ActiveMinuteChart data={data} configChart={props.configChart} />;
      case TYPE_CHART_ENUM.LINE:
        return <HeartRateLineChart data={data} configChart={props.configChart} />;
      case TYPE_CHART_ENUM.LINE_RANGE:
        return <HeartRateRangeChart data={data} configChart={props.configChart} />;
      default:
        return null;
    }
  };
  return (
    <div className={classnames('bioheart-chart-wrapper', props.className)}>
      {TYPE_CHART_ENUM.COLUMN === props.typeChart ? (
        <WrapperChartHeader
          title={props.title}
          totalActive={props.data?.totalActive || '--'}
        />
      )
        : (
          <WrapperChartHeader
            title={props.title}
            min={props.data?.avgMinMax?.min || '--'}
            max={props.data?.avgMinMax?.max || '--'}
            avg={props.data?.avgMinMax?.avg || '--'}
          />
        )}

      <div className="chart-container">
        {renderChart(props.typeChart, props.data)}
      </div>
    </div>
  );
}

BiohaertChart.defaultProps = {
  className: '',
  title: '',
  typeChart: TYPE_CHART_ENUM.LINE,
  data: {},
  configChart: {},
};

BiohaertChart.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  typeChart: PropTypes.oneOf([TYPE_CHART_ENUM.COLUMN, TYPE_CHART_ENUM.LINE, TYPE_CHART_ENUM.LINE_RANGE]),
  data: PropTypes.shape(),
  configChart: {},
};

export default BiohaertChart;
