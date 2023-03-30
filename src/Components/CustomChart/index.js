import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import highchartsDumbbell from 'highcharts/modules/dumbbell';
import OnPoint from 'highcharts/modules/series-on-point';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}
highchartsDumbbell(Highcharts);
OnPoint(Highcharts);
function CustomChart(props) {
  const { data } = props;
  let yAxisMinMax = { min: 16, max: 26 };
  const hasData = _.find(data, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const options = {
    chart: {
      type: 'line',
      height: 200,
      inverted: false,
      // marginRight: 15,
    },
    title: {
      text: null,
    },
    series: props.series,
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      crosshair: true,
      labels: {
        align: 'left',
      },
      showLastLabel: false,
      showFirstLabel: true,
      endOnTick: true,
    },
    yAxis: [{
      opposite: false,
      title: null,
      gridLineDashStyle: 'solid',
      gridLineColor: '#E8E8E8',
      gridLineWidth: 1,
      ...yAxisMinMax,
    }],
    plotOptions: {
      scatter: {
        marker: {
          radius: 2,
        },
      },
    },
    tooltip: {
      borderRadius: 24,
      backgroundColor: '#F0F2F5',
      borderWidth: 0,
      shape: 'square',
    },
    legend: {
      enabled: false,

    },
    time: {
      useUTC: false,
    },
    ...props.options,
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      immutable
    />
  );
}

CustomChart.defaultProps = {
  data: [],
  series: [],
  options: {},
};

CustomChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()),
  series: PropTypes.arrayOf(PropTypes.shape()),
  options: PropTypes.shape(),
};

export default CustomChart;
