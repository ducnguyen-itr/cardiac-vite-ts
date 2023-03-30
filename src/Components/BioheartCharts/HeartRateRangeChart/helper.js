import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import moment from 'moment';
import _ from 'lodash';
import {
  findPointsChart, findShortDashRange, getLabelFormatterAndTickInterval, spanHeartRateDataByType,
} from '../helper';
import { REPORT_TIME_TYPE_ENUM } from '../../../Constants/chart';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

export const getHeartRateChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true, fromTime, toTime,
}) => {
  data.averages = data.averages.map(element => ({
    x: element.x,
    y: element.y ? Math.floor(element.y) : null,
  }));
  let yAxisMinMax = { min: 0, max: 150, tickAmount: 5 };
  const hasData = _.find(data?.averages, item => item.y);
  if (hasData) {
    yAxisMinMax = { tickAmount: 5 };
  }
  const { shortDashRanges } = findShortDashRange(_.clone(data.averages), type === 'Month' ? 1 : type === 'Year' ? 0 : type === 'Day' ? 3 : 4);
  const { points } = findPointsChart(_.clone(data.averages));
  const series = [
    {
      type: 'spline',
      name: 'Heart Rate',
      data: data.averages,
      zIndex: 1,
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
      color: '#EF2641',
      pointStart: data?.averages[0]?.x,
    },
    {
      type: 'areasplinerange',
      name: 'Range',
      data: data.ranges,
      lineWidth: 0,
      linkedTo: ':previous',
      color: '#EF2641',
      fillOpacity: 0.1,
      zIndex: 0,
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false,
          },
        },
      },
    },
    {
      name: 'Heart Rate',
      data: points,
      zIndex: 1,
      color: '#EF2641',
      marker: {
        symbol: 'circle',
        radius: 2,
        lineColor: '#EF2641',
        lineWidth: 2,
      },

    },
  ];

  const options = {
    chart: {
      spacingTop: isShowTooltip ? 32 : null,
      height: 200,
      events: {
        render() {
          const chart = this;
          // clear before shortdash
          if (chart?.myLineLength > 0) {
            for (let index = 0; index < chart.myLineLength; index += 1) {
              if (!_.isEmpty(chart[`myLine${index}`])) {
                chart[`myLine${index}`].destroy();
              }
            }
          }
          // draw new shortdash
          chart.myLineLength = shortDashRanges.length;
          shortDashRanges.forEach((range, i) => {
            const startX = chart.xAxis[0].toPixels(range.from.x);
            const startY = chart.yAxis[0].toPixels(range.from.y);
            const endX = chart.xAxis[0].toPixels(range.to.x);
            const endY = chart.yAxis[0].toPixels(range.to.y);
            chart[`myLine${i}`] = chart.renderer.path(['M', startX, startY, 'L', endX, endY])
              .attr({
                'stroke-width': 2,
                stroke: '#FFADB8',
                dashstyle: 'ShortDash',
              })
              .add();
          });
        },
      },
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
          if (type === 'Month' && value.value === data.averages[data.averages.length - 1].x) {
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
      //     const ticks = _.filter(data.averages.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
      //     const ticksX = _.map(ticks, tick => tick.x - 86400000 / 2);
      //     ticksX.push(data.averages[data.averages.length - 1].x + 86400000 / 2);
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
        const isIsolatePoint = data.ranges.find(value => value.x === this.x);
        const lowValue = `<span style="color: #EF2641">${isIsolatePoint.low} &darr;</span>`;
        const highValue = `<span style="color: #EF2641">${isIsolatePoint.high} &uarr;</span>`;
        const averageValue = `<span style="color: #EF2641">${this?.y} bpm</span>`;
        let dateFormatter = '';
        switch (type) {
          case 'Day':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).subtract(15, 'm').format('h:mm A')} - ${moment(this.x).add(15, 'm').format('h:mm A')}</span>`;
            break;
          case 'Week':
            dateFormatter = `<span style="color: #696A6B">${moment(this.x).subtract(3, 'h').format('h A')} - ${moment(this.x).add(3, 'h').format('h A')}, ${moment(this.x).format('MMM D')}</span>`;
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
        return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro; color: #D2D4D6">${averageValue} | ${lowValue} | ${highValue} ${dateFormatter}</div>`;
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


export const getEmptyHeartRateChart = (timeType = REPORT_TIME_TYPE_ENUM.HOUR) => {
  const data = spanHeartRateDataByType({
    data: { mins: [], maxs: [], avgs: [] },
    currentDate: moment(),
    type: timeType,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(timeType);
  return getHeartRateChart({
    data,
    labelFormatter,
    tickInterval,
    type: timeType,
  });
};
