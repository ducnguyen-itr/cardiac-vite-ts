
import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import moment from 'moment';
import _ from 'lodash';
import { REPORT_TIME_TYPE_ENUM } from '../../../Constants/chart';
import { getLabelFormatterAndTickInterval, spanRestingHeartRateDataByType } from '../helper';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

export const getRestingHeartLineChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true,
  fromTime, toTime,
}) => {
  const formatData = (data?.avgs || []).map(element => ({
    x: element.x,
    y: element.y ? Math.floor(element.y) : null,
  }));
  let yAxisMinMax = { min: 0, max: 150, tickAmount: 5 };
  const hasData = _.find(data?.avgs, item => item.y);
  if (hasData) {
    yAxisMinMax = { tickAmount: 5 };
  }
  const series = [
    {
      type: 'line',
      name: 'Heart Rate Variability',
      data: formatData,
      zIndex: 1,
      marker: {
        enabled: true,
        lineWidth: 1,
        fillColor: 'white',
        width: 1,
        lineColor: '#EF2641',
        states: {
          hover: {
            enabled: isShowTooltip,
          },
        },
      },
      color: '#EF2641',
      pointStart: formatData[1]?.x,
      connectNulls: true,
    },
  ];
  const options = {
    chart: {
      spacingTop: isShowTooltip ? 32 : null,
      height: 200,
    },
    title: {
      text: null,
    },
    series,
    credits: {
      enabled: false,
    },
    xAxis: {
      type: 'datetime',
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      // max: undefined,
      labels: {
        formatter(value) {
          if (type === 'Week') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          if (type === 'Month' && value.value === formatData[formatData.length - 1].x) {
            return '';
          }
          if (type === 'Year') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          return moment(value.value).format(labelFormatter);
        },
        align: 'left',
      },
      showFirstLabel: true,
      showLastLabel: false,
      endOnTick: true,
      tickInterval,
      min: fromTime,
      max: toTime,
      // tickPositioner: () => {
      //   if (type === 'Month') {
      //     // cause I unshift the start of day, and add 0.5 day to each of after data.
      //     const ticks = _.filter(data.avgs.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
      //     const ticksX = _.map(ticks, tick => tick.x - 86400000 / 2);
      //     ticksX.push(data.avgs[data.avgs.length - 1].x + 86400000 / 2);
      //     return ticksX;
      //   }
      // },
    },
    yAxis: {
      opposite: false,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      ...yAxisMinMax,
    },
    tooltip: {
      enabled: isShowTooltip,
      crosshairs: isShowTooltip,
      borderRadius: 24,
      backgroundColor: '#F0F2F5',
      borderWidth: 0,
      shape: 'square',
      shared: true,
      positioner(labelWidth, labelHeight, point) {
        return {
          x: point.plotX >= labelWidth / 2 && !(labelWidth / 2 > (this.chart.chartWidth - point.plotX))
            ? point.plotX - labelWidth / 2 : labelWidth / 2 > (this.chart.chartWidth - point.plotX) ? this.chart.chartWidth - labelWidth - 0.05 * this.chart.chartWidth
              : 0,
          y: 0,
        };
      },
      formatter() {
        // this of highchart
        // const isIsolatePoint = data.ranges.find((value) => value.x === this.x);
        // const lowValue = `<span style="color: #EF2641">${isIsolatePoint.low} &darr;</span>`;
        // const highValue = `<span style="color: #EF2641">${isIsolatePoint.high} &uarr;</span>`;
        const heartRateVar = `<span style="color: #EF2641">${this?.y} bpm</span>`;
        let dateFormatter = '';
        switch (type) {
          case 'Day':
            dateFormatter = `<span style="color: #696A6B">at ${moment(this.x).subtract(15, 'm').format('h:mm A')} - ${moment(this.x).add(15, 'm').format('h:mm A')}</span>`;
            break;
          case 'Week':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).format('MMM D')}</span>`;
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
        return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro; color: #D2D4D6">${heartRateVar} ${dateFormatter}</div>`;
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
      highcharts={Highcharts}
      options={options}
      immutable
    />
  );
};

export const getEmptyHeartRateLineChart = () => {
  const data = spanRestingHeartRateDataByType({
    data: { avgs: [] },
    currentDate: moment(),
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(REPORT_TIME_TYPE_ENUM.DAY);
  return getRestingHeartLineChart({
    data,
    labelFormatter,
    tickInterval,
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
};
