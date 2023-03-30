import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import moment from 'moment';
import _ from 'lodash';
import {
  getLabelFormatterAndTickInterval, spanActivityDataByType,
} from '../helper';
import { REPORT_TIME_TYPE_ENUM } from '../../../Constants/chart';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}


const getPointWidthActiveMinutesActivityChart = (type) => {
  switch (type) {
    case 'Day':
      return 8;
    case 'Week':
      return 18;
    case 'Month':
      return 13;
    case 'Year':
      return 37;
    default:
      return 8;
  }
};

export const getActivityChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true, fromTime,
  toTime,
}) => {
  let yAxisMinMax = { min: 0, max: 150, tickAmount: 5 };
  const hasData = _.find(data, item => item.y);
  if (hasData) {
    yAxisMinMax = { tickAmount: 5 };
  }
  const options = {
    chart: {
      type: 'column',
      spacingTop: 32,
      height: 200,
    },
    title: {
      text: null,
    },
    series: [
      {
        name: 'Active minutes',
        data,
      }],
    credits: {
      enabled: false,
    },
    plotOptions: {
      series: {
        pointWidth: getPointWidthActiveMinutesActivityChart(type),
        minPointLength: 2,
      },
      column: {
        color: '#6399E0',
        states: {
          hover: {
            color: '#6399E0',
          },
        },
      },
    },
    xAxis: {
      type: 'datetime',
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      labels: {
        formatter(value) {
          if (type === 'Week') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          if (type === 'Month' && value.value === data[data.length - 1].x) {
            return '';
          }
          if (type === 'Year') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          return moment(value.value).format(labelFormatter);
        },
        align: 'left',
      },
      showLastLabel: false,
      showFirstLabel: true,
      endOnTick: true,
      tickInterval,
      // tickPositioner: () => {
      //   if (type === 'Month') {
      //     // cause I unshift the start of day, and add 0.5 day to each of after data.
      //     const ticks = _.filter(data.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
      //     const ticksX = _.map(ticks, tick => tick.x - 86400000 / 2);
      //     ticksX.push(data[data.length - 1].x + 86400000 / 2);
      //     return ticksX;
      //   }
      // },
    },
    yAxis: {
      opposite: false,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      tickAmount: 4,
      ...yAxisMinMax,
    },
    tooltip: {
      enabled: isShowTooltip,
      crosshairs: isShowTooltip ? { zIndex: 3 } : false,
      borderRadius: 24,
      backgroundColor: '#F0F2F5',
      borderWidth: 0,
      shape: 'square',
      shared: true,
      positioner(labelWidth, labelHeight, point) {
        return {
          x: point.plotX >= labelWidth / 2 && !(labelWidth / 2 > (this.chart.chartWidth - point.plotX))
            ? point.plotX - labelWidth / 2 : labelWidth / 2 > (this.chart.chartWidth - point.plotX) ? this.chart.chartWidth - labelWidth - 0.08 * this.chart.chartWidth
              : 0,
          y: 0,
        };
      },
      formatter() {
        // this of highchart
        const value = `<span style="color: #EF2641">${this.y} ${this.y > 1 ? 'mins' : 'min'}</span>`;
        let dateFormatter = '';
        switch (type) {
          case 'Day':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).subtract(15, 'm').format('h:mm A')} - ${moment(this.x).add(15, 'm').format('h:mm A')}</span>`;
            break;
          case 'Week':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).subtract(3, 'h').format('h A')} - ${moment(this.x).add(3, 'h').format('h A')}</span>`;
            break;
          case 'Month':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).format('MMM D')}</span>`;
            break;
          case 'Year':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).format('MMM')}</span>`;
            break;
          default:
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).format('MMM D')}</span>`;
            break;
        }
        return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro; color: #D2D4D6">${value} | ${dateFormatter}</div>`;
      },
    },
    legend: {
      enabled: false,
    },
    time: {
      useUTC: false,
    },
  };
  return (
    <HighchartsReact
      immutable
      highcharts={Highcharts}
      options={options}
    />
  );
};


export const getEmptyActiveMinuteChart = () => {
  const data = spanActivityDataByType({
    data: [],
    currentDate: moment(),
    type: REPORT_TIME_TYPE_ENUM.HOUR,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(REPORT_TIME_TYPE_ENUM.DAY);
  return getActivityChart({
    data,
    labelFormatter,
    tickInterval,
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
};
