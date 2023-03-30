/* eslint-disable consistent-return */
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { REPORT_TIME_TYPE_ENUM, SPAN_DATA_INTERVAL_ENUM, TICK_INTERVAL_CHART_ENUM } from '../Constants/chart';
import { TICK_INTERVAL_ENUM } from '../Constants/overview';

if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

const MAX_WIDTH_TIME_TOOLTIP_FONTSIZE_18 = 80;

export const spanActivityDataOverview = (currentDate, data) => {
  const result = [];
  let curDate = moment(currentDate).startOf('day').valueOf();
  const interval30min = 1800000;
  let dataIndex = 0;
  for (let i = 0; i < 48; i += 1) {
    if (data[dataIndex]?.time === curDate) {
      result.push({ x: curDate, y: data[dataIndex].duration / 60, name: moment(curDate).format('hh:mm A') });
      dataIndex += 1;
    } else {
      result.push({ x: curDate, y: null, name: moment(curDate).format('hh:mm A') });
    }
    curDate += interval30min;
  }
  return result;
};

const getIntervalAndRangeData = ({ type = REPORT_TIME_TYPE_ENUM.DAY, currentDate = moment() }) => {
  switch (type) {
    case REPORT_TIME_TYPE_ENUM.YEAR:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_MONTH,
        range: 12,
      };
    case REPORT_TIME_TYPE_ENUM.MONTH:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_DAY,
        range: moment(currentDate).daysInMonth(),
      };
    case REPORT_TIME_TYPE_ENUM.WEEK:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.SIX_HOURS,
        range: 28,
      };
    case REPORT_TIME_TYPE_ENUM.DAY:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.THIRDTY_MINUTES,
        range: 48,
      };
    default:
      return {
        interval: SPAN_DATA_INTERVAL_ENUM.ONE_MINUTE,
        range: 60,
      };
  }
};

export const getLabelFormatterAndTickInterval = (type) => {
  switch (type) {
    case REPORT_TIME_TYPE_ENUM.YEAR:
      return {
        labelFormatter: 'MMM',
        tickInterval: TICK_INTERVAL_CHART_ENUM.YEAR,
      };
    case REPORT_TIME_TYPE_ENUM.MONTH:
      return {
        labelFormatter: 'D',
        tickInterval: TICK_INTERVAL_CHART_ENUM.MONTH,
      };
    case REPORT_TIME_TYPE_ENUM.WEEK:
      return {
        labelFormatter: 'ddd',
        tickInterval: TICK_INTERVAL_CHART_ENUM.WEEK,
      };
    case REPORT_TIME_TYPE_ENUM.DAY:
      return {
        labelFormatter: 'h A',
        tickInterval: TICK_INTERVAL_CHART_ENUM.DAY,
      };
    default:
      return {
        labelFormatter: 'h:mm A',
        tickInterval: TICK_INTERVAL_CHART_ENUM.HOUR,
      };
  }
};

const getXAxisValue = ({
  type = REPORT_TIME_TYPE_ENUM.DAY,
  date = moment().valueOf(),
  interval = 1800000,
  isHeartRateChart = false,
}) => {
  if (type === REPORT_TIME_TYPE_ENUM.DAY && !isHeartRateChart) {
    return date;
  }
  if ((type === REPORT_TIME_TYPE_ENUM.DAY || type === REPORT_TIME_TYPE_ENUM.HOUR) && isHeartRateChart) {
    return date;
  }
  if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
    const daysInMonth = moment(date).daysInMonth();
    return moment(date).add(Number.parseInt(daysInMonth / 2, 10), 'd').valueOf();
  }
  return date + interval / 2;
};

export const spanActivityDataByType = ({ type = REPORT_TIME_TYPE_ENUM.DAY, currentDate = moment(), data = [] }) => {
  const result = [{ x: currentDate, y: null }];
  let curDate = moment(currentDate).startOf(type).valueOf();
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({ type, interval, date: curDate });
    if (data[dataIndex]?.time === curDate) {
      result.push({ x, y: data[dataIndex].value / 60 });
      dataIndex += 1;
    } else {
      result.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return result;
};

// after all we should calculate the Break ranges of Heart Rate

export const spanHeartRateDataByType = ({
  type = REPORT_TIME_TYPE_ENUM.HOUR,
  currentDate = moment(),
  data = { mins: [], maxs: [], avgs: [] },
}) => {
  const ranges = [];
  const averages = [];
  let curDate = moment(currentDate).startOf(type).valueOf();
  if (type !== REPORT_TIME_TYPE_ENUM.HOUR) {
    ranges.push({
      x: curDate, low: null, high: null,
    });
    averages.push({
      x: curDate, y: null,
    });
  }
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({
      type, interval, date: curDate, isHeartRateChart: true,
    });
    if (data.mins[dataIndex]?.time === curDate) {
      ranges.push({ x, low: data.mins[dataIndex].value, high: data.maxs[dataIndex].value });
      averages.push({ x, y: data.avgs[dataIndex].value });
      dataIndex += 1;
    } else {
      ranges.push({ x, low: null, high: null });
      averages.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return { ranges, averages };
};

export const spanHeartRateVariabilityDataByType = ({
  type = REPORT_TIME_TYPE_ENUM.DAY,
  currentDate = moment(),
  data = { vars: [] },
}) => {
  const hrvs = [];
  let curDate = moment(currentDate).startOf(type).valueOf();
  hrvs.push({
    x: curDate, y: null,
  });
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({
      type, interval, date: curDate, isHeartRateChart: true,
    });
    if (data.vars[dataIndex]?.time === curDate) {
      hrvs.push({ x, y: data.vars[dataIndex].value });
      dataIndex += 1;
    } else {
      hrvs.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return { hrvs };
};

export const spanRestingHeartRateDataByType = ({
  type = REPORT_TIME_TYPE_ENUM.DAY,
  currentDate = moment(),
  data = { avgs: [] },
}) => {
  const avgs = [];
  let curDate = moment(currentDate).startOf(type).valueOf();
  avgs.push({
    x: curDate, y: null,
  });
  const { interval, range } = getIntervalAndRangeData({ type, currentDate });
  let dataIndex = 0;
  for (let i = 0; i < range; i += 1) {
    const x = getXAxisValue({
      type, interval, date: curDate, isHeartRateChart: true,
    });
    if (data.avgs[dataIndex]?.time === curDate) {
      avgs.push({ x, y: data.avgs[dataIndex].value });
      dataIndex += 1;
    } else {
      avgs.push({ x, y: null });
    }
    if (type === REPORT_TIME_TYPE_ENUM.YEAR) {
      curDate = moment(curDate).add(1, 'month').startOf('month').valueOf();
    } else {
      curDate += interval;
    }
  }
  return { avgs };
};

export const spanHeartRateDataByWeekForSummary = (currentDate, data) => {
  const ranges = [];
  const averages = [];
  let curDate = moment(currentDate).startOf('week').valueOf();
  ranges.push({
    x: curDate, low: null, high: null, name: moment(curDate).format('hh:mm A'),
  });
  averages.push({
    x: curDate, y: null,
  });
  const interval1d = TICK_INTERVAL_ENUM.DAY;
  let dataIndex = 0;
  for (let i = 0; i < 7; i += 1) {
    if (data.mins[dataIndex]?.time === curDate) {
      // result.push([curDate, data[dataIndex].duration / 60]);
      ranges.push({
        x: curDate, low: data.mins[dataIndex].value, high: data.maxs[dataIndex].value, name: moment(curDate).format('DD-MM'),
      });
      averages.push({
        x: curDate, y: data.avgs[dataIndex].value,
      });
      dataIndex += 1;
    } else {
      // result.push([curDate, 0]);
      ranges.push({
        x: curDate, low: null, high: null, name: moment(curDate).format('DD-MM'),
      });
      averages.push({
        x: curDate, y: null,
      });
    }
    curDate += interval1d;
  }
  return { ranges, averages };
};

const findShortDashRange = (data, countNullStrategies = 3) => {
  if (!data || data.length === 0) {
    return {
      shortDashRanges: [],
    };
  }
  let countNull = 0;
  const shortDashRanges = [];
  for (let index = 0; index < data.length; index += 1) {
    if (!data[index].y) {
      countNull += 1;
    } else {
      if (countNull <= countNullStrategies && countNull > 0) {
        shortDashRanges.push({
          from: (index - countNull - 1) > 0 ? data[index - countNull - 1] : data[0],
          to: data[index],
        });
      }
      countNull = 0;
    }
  }
  return {
    shortDashRanges: _.filter(shortDashRanges, item => item.from.y && item.to.y),
  };
};

const findPointsChart = (data) => {
  if (!data || data.length === 0) {
    return {
      points: [],
    };
  }
  const points = _.cloneDeep(data);
  for (let index = 0; index < data.length; index += 1) {
    if (index > 0 && index < data.length - 1 && (!data[index - 1].y && data[index].y && !data[index + 1].y)) {
      points[index] = data[index];
    } else if (index === 0 && data[index].y && !data[index + 1].y) {
      points[index] = data[index];
    } else if (index === data.length - 1 && data[index].y && !data[index - 1].y) {
      points[index] = data[index];
    } else {
      points[index].y = null;
    }
  }
  return {
    points,
  };
};

const isLastPoint = (data, type) => {
  switch (type) {
    case 'Day':
      return moment(data).format('DD MM YYYY') === moment().format('DD MM YYYY');
    case 'Week':
      return moment(data).endOf('week').format('DD MM YYYY') === moment().endOf('week').format('DD MM YYYY');
    case 'Month':
      return moment(data).format('MM YYYY') === moment().format('MM YYYY');
    case 'Year':
      return moment(data).year() === moment().year();
    default:
      return moment(data).format('DD MM YYYY HH') === moment().format('DD MM YYYY HH');
  }
};

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

// export const getActivityChart = (data, isShowTooltip = true) => {
//   const options = {
//     chart: {
//       type: 'column',
//       height: 180,
//     },
//     title: {
//       text: null,
//     },
//     series: [
//       {
//         name: 'Active minutes',
//         data,
//       }],
//     credits: {
//       enabled: false,
//     },
//     plotOptions: {
//       series: {
//         pointWidth: 8,
//         minPointLength: 2,
//       },
//       column: {
//         color: '#6399E0',
//         states: {
//           hover: {
//             color: '#6399E0',
//           },
//         },
//       },
//     },
//     xAxis: {
//       type: 'datetime',
//       gridLineDashStyle: 'longdash',
//       gridLineWidth: 1,
//       labels: {
//         formatter(value) {
//           return moment(value.value).format('h A');
//         },
//       },
//       showLastLabel: false,
//       showFirstLabel: true,
//       endOnTick: true,
//       tickInterval: 4 * 3600 * 1000,
//     },
//     yAxis: {
//       opposite: true,
//       title: null,
//       gridLineDashStyle: 'longdash',
//       gridLineWidth: 1,
//     },
//     tooltip: {
//       enabled: isShowTooltip,
//       crosshairs: isShowTooltip,
//     },
//     legend: {
//       enabled: false,
//     },
//     time: {
//       useUTC: false,
//     },
//   };
//   return (
//     <HighchartsReact
//       oneToOne
//       highcharts={Highcharts}
//       options={options}
//     />
//   );
// };

export const getActivityChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true,
}) => {
  let yAxisMinMax = { min: 0, max: 150 };
  const hasData = _.find(data, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const options = {
    chart: {
      type: 'column',
      spacingTop: 32,
      height: 180,
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
      tickPositioner: () => {
        if (type === 'Month') {
          // cause I unshift the start of day, and add 0.5 day to each of after data.
          const ticks = _.filter(data.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
          const ticksX = _.map(ticks, tick => tick.x - TICK_INTERVAL_ENUM.DAY / 2);
          ticksX.push(data[data.length - 1].x + TICK_INTERVAL_ENUM.DAY / 2);
          return ticksX;
        }
      },
    },
    yAxis: {
      opposite: true,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
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
            return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro">${this.y} bpm | ${this.points[0].y} ↑ | ${this.points[1].y} ↓ at ${moment(this.x).format('mmm')}</div>`;
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

export const getHourHRChart = (data) => {
  let yAxisMinMax = { min: 0, max: 150 };
  const hasData = _.find(data, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const series = [
    {
      type: 'scatter',
      name: 'Heart Rate',
      data,
      color: '#EF2641',
    }];

  const options = {
    chart: {
      type: 'scatter',
      spacingTop: 32,
      marginRight: 62,
      height: 180,
    },
    // events: {
    //   beforePrint() {
    //     this.destroy();
    //   },
    // },
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
      crosshair: true,
      labels: {
        align: 'left',
        formatter(value) {
          return moment(value.value).format('h:mm A');
        },
      },
      showLastLabel: false,
      showFirstLabel: true,
      endOnTick: true,
      tickInterval: 15 * 60 * 1000,
    },
    yAxis: {
      // padding: 32,
      opposite: true,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 1,
      ...yAxisMinMax,
    },
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
        return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro"><span style="color: #EF2641">${this.y} bpm</span> at <span style="color: #696A6B"></span>${moment(this.x).format('h:mm A')}</div>`;
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

const getInterval = (delta) => {
  if (delta === 0) return 1;
  if (delta > 0 && delta < 10) return 3;
  if (delta >= 10 && delta < 40) return 5;
  return 10;
};

const getMarginRange = (delta, interval, i) => {
  let rate;
  if (i % 5 === 0) {
    rate = 0.5;
  } else {
    rate = 0.3;
  }
  return {
    margin: ((1 - rate) * delta) / 2,
    length: rate * delta,
  };
};

export const getHourHRSmallChart = (data) => {
  const theFirstPointHaveData = data.find(element => element.y);
  let min = theFirstPointHaveData?.y;
  let max = theFirstPointHaveData?.y;
  let chart;
  let oldLine;
  let timeTooltip;
  let yAxisMinMax = { min: 0, max: 100 };

  const series = [
    {
      type: 'scatter',
      name: 'Heart Rate',
      data,
      color: '#EF2641',
      zIndex: 2,
      // enableMouseTracking: false,
      opacity: 1,
      states: {
        inactive: {
          opacity: 1,
        },
      },
      point: {
        // events: {
        //   click() {
        //     if (oldLine) {
        //       oldLine.destroy();
        //     }
        //     if (timeTooltip) {
        //       timeTooltip.destroy();
        //     }
        //     oldLine = chart.renderer.rect(this.plotX + chart.plotLeft - 1, chart.plotTop, 2, chart.plotSizeY).attr({
        //       fill: '#89C15D',
        //     }).add();
        //     timeTooltip = chart.renderer.label(
        //       `${moment(this.x).format('H:mm A')}`,
        //       (chart.plotSizeX - this.plotX) < MAX_WIDTH_TIME_TOOLTIP_FONTSIZE_18 / 2 ? this.plotX - MAX_WIDTH_TIME_TOOLTIP_FONTSIZE_18 / 4 : this.plotX - 1,

        //       chart.plotTop - 32,
        //     )
        //       .css({
        //         color: '#474748',
        //         fontSize: '18px',
        //         fontWeight: '500',
        //         fontFamily: 'Cera Pro',
        //       })
        //       .attr({
        //         fill: 'transparent',
        //       }).add();
        //   },
        // },
      },
    }];

  for (let i = 0; i < data.length; i += 1) {
    if (data[i].y && data[i].y > max) {
      max = data[i].y;
    }
    if (data[i].y && data[i].y < min) {
      min = data[i].y;
    }
  }

  const delta = max - min;
  const interval = getInterval(delta);

  if (min && max) {
    min -= interval;
    max += interval;
  } else {
    min = 0;
    max = 100;
  }

  const newDelta = max - min;

  yAxisMinMax = { min, max };

  for (let i = 0; i < data.length; i += 1) {
    series.push({
      type: 'scatter',
      data: [[data[i].x, min + getMarginRange(newDelta, interval, i).margin],
      [data[i].x, min + getMarginRange(newDelta, interval, i).margin + getMarginRange(newDelta, interval, i).length]],
      color: i % 5 === 0 ? '#D2D4D6' : '#E6E9EB',
      dashStyle: 'shortdash',
      lineWidth: 1,
      linkedTo: 'main',
      enableMouseTracking: false,
      opacity: 1,
      zIndex: 1,
      states: {
        hover: {
          enabled: false,
        },
        inactive: {
          enabled: true,
          animation: {
            duration: 0,
          },
          opacity: 1,
        },
      },
      marker: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
    });
  }

  const options = {
    chart: {
      type: 'scatter',
      margin: 32,
      height: 140,
      backgroundColor: '#F5F7FA',
      borderWidth: 2,
      borderColor: '#E6E9EB',
      borderRadius: 4,
      style: {
        fontFamily: 'Cera Pro',
      },
      events: {
        load() {
          chart = this;
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
      gridLineDashStyle: 'solid',
      gridLineWidth: 1,
      gridLineColor: '#A0A1A3',
      lineWidth: 0,
      color: 'black',
      labels: {
        align: 'center',
        formatter(value) {
          return `<div style="font-size: 16px; font-weight: 500; font-family: Cera Pro"><span style="color: #696A6B"></span>${moment(value.value).format('h:mm')}</div>`;
        },
      },
      showLastLabel: true,
      showFirstLabel: true,
      endOnTick: true,
      minorTickLength: 0,
      tickPositions: [data[0].x, data[data.length / 2].x, data[data.length - 1].x],
      tickLength: 0,
      tickInterval: 30 * 60 * 1000,
    },
    yAxis: {
      opposite: true,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 0,
      lineWidth: 1,
      minorGridLineWidth: 0,
      labels: {
        enabled: false,
      },
      minorTickLength: 0,
      tickLength: 0,
      tickPositions: [min, max],
      ...yAxisMinMax,
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 2,
        },
      },
    },
    tooltip: {
      animation: false,
      borderRadius: 24,
      backgroundColor: 'transparent',
      borderWidth: 'none',
      enabled: false,
      shape: 'square',
      followPointer: false,
      positioner(labelWidth, labelHeight, point) {
        return {
          x: point.plotX,
          y: 0,
        };
      },
      formatter() {
        // this of highchart
        return `<div style="font-size: 18px; font-weight: 500; font-family: Cera Pro"><span style="color: #474748"></span>${moment(this.x).format('h:mm A')}</div>`;
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

export const getHourHRSmallIntervalChart = (data, threshold) => {
  // should span data function by duration 10m.

  const theFirstPointHaveData = data.find(element => element.y);
  let min = theFirstPointHaveData?.y;
  let max = theFirstPointHaveData?.y;
  let chart;
  let oldLine;
  let timeTooltip;
  let yAxisMinMax = { min: 0, max: 100 };
  // add a threshold chart 7.8
  const thresholdChartData = data.map(element => [element.x, threshold]);
  const series = [
    {
      type: 'scatter',
      name: 'Heart Rate',
      data,
      color: '#EF2641',
      zIndex: 2,
      // enableMouseTracking: false,
      opacity: 1,
      states: {
        inactive: {
          opacity: 1,
        },
      },
      point: {
        // events: {
        //   click() {
        //     if (oldLine) {
        //       oldLine.destroy();
        //     }
        //     if (timeTooltip) {
        //       timeTooltip.destroy();
        //     }
        //     oldLine = chart.renderer.rect(this.plotX + chart.plotLeft - 1, chart.plotTop, 2, chart.plotSizeY).attr({
        //       fill: '#89C15D',
        //     }).add();
        //     timeTooltip = chart.renderer.label(
        //       `${moment(this.x).format('H:mm A')}`,
        //       (chart.plotSizeX - this.plotX) < MAX_WIDTH_TIME_TOOLTIP_FONTSIZE_18 / 2 ? this.plotX - MAX_WIDTH_TIME_TOOLTIP_FONTSIZE_18 / 4 : this.plotX - 1,

        //       chart.plotTop - 32,
        //     )
        //       .css({
        //         color: '#474748',
        //         fontSize: '18px',
        //         fontWeight: '500',
        //         fontFamily: 'Cera Pro',
        //       })
        //       .attr({
        //         fill: 'transparent',
        //       }).add();
        //   },
        // },
      },
    }];

  // draw threshold line
  series.push({
    type: 'line',
    name: 'Heart Rate',
    data: thresholdChartData,
    color: '#EF2641',
    dashStyle: 'shortdash',
    events: {
      afterAnimate() {
        chart.renderer.label(
          `${threshold} bpm`,
          chart.plotSizeX - 40,
          this.points[0].plotY + 10,
        )
          .css({
            color: '#EF2641',
            fontSize: '16',
            fontWeight: '500',
            fontFamily: 'Cera Pro',
          })
          .attr({
            fill: 'transparent',
          }).add();
      },
    },
    states: {
      hover: {
        enabled: false,
      },
      inactive: {
        enabled: true,
        animation: {
          duration: 0,
        },
        opacity: 1,
      },
    },
    marker: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  });
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].y && data[i].y > max) {
      max = data[i].y;
    }
    if (data[i].y && data[i].y < min) {
      min = data[i].y;
    }
  }

  const delta = max - min;
  const interval = getInterval(delta);

  if (min && max) {
    min -= interval;
    max += interval;
  } else {
    min = 0;
    max = 100;
  }

  // re-evaluation if threshold out range of the min-max

  if (threshold > max) {
    max = threshold;
  }
  if (threshold < min) {
    min = threshold;
  }

  const newInterval = getInterval(max - min);

  if (min && max) {
    min -= newInterval;
    max += newInterval;
  } else {
    min = 0;
    max = 100;
  }

  const newDelta = max - min;

  yAxisMinMax = { min, max };

  for (let i = 0; i < data.length; i += 1) {
    series.push({
      type: 'scatter',
      data: [[data[i].x, min + getMarginRange(newDelta, interval, i).margin],
      [data[i].x, min + getMarginRange(newDelta, interval, i).margin + getMarginRange(newDelta, interval, i).length]],
      color: i % 5 === 0 ? '#D2D4D6' : '#E6E9EB',
      dashStyle: 'shortdash',
      lineWidth: 1,
      linkedTo: 'main',
      enableMouseTracking: false,
      opacity: 1,
      zIndex: 1,
      states: {
        hover: {
          enabled: false,
        },
        inactive: {
          enabled: true,
          animation: {
            duration: 0,
          },
          opacity: 1,
        },
      },
      marker: {
        enabled: false,
      },
      tooltip: {
        enabled: false,
      },
    });
  }

  const options = {
    chart: {
      type: 'scatter',
      margin: 32,
      height: 140,
      backgroundColor: '#F5F7FA',
      borderWidth: 2,
      borderColor: '#E6E9EB',
      borderRadius: 4,
      style: {
        fontFamily: 'Cera Pro',
      },
      events: {
        load() {
          chart = this;
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
      gridLineDashStyle: 'solid',
      gridLineWidth: 1,
      gridLineColor: '#A0A1A3',
      lineWidth: 0,
      color: 'black',
      // crosshair: {
      //   enabled: false,
      //   color: '#89C15D',
      //   width: 2,
      // },
      labels: {
        align: 'center',
        formatter(value) {
          // return moment(value.value).format('h:mm A');
          return `<div style="font-size: 16px; font-weight: 500; font-family: Cera Pro"><span style="color: #696A6B"></span>${moment(value.value).format('h:mm')}</div>`;
        },
      },
      showLastLabel: true,
      showFirstLabel: true,
      endOnTick: true,
      minorTickLength: 0,
      tickPositions: [data[0].x, data[30].x, data[data.length - 1].x],
      tickLength: 0,
      tickInterval: 30 * 60 * 1000,
    },
    yAxis: {
      // padding: 32,
      opposite: true,
      title: null,
      gridLineDashStyle: 'longdash',
      gridLineWidth: 0,
      lineWidth: 1,
      minorGridLineWidth: 0,
      labels: {
        enabled: false,
      },
      minorTickLength: 0,
      tickLength: 0,
      tickPositions: [min, max],
      ...yAxisMinMax,
    },
    plotOptions: {
      scatter: {
        marker: {
          radius: 2,
        },
      },
    },
    tooltip: {
      // outside: true,
      animation: false,
      borderRadius: 24,
      backgroundColor: 'transparent',
      borderWidth: 'none',
      enabled: false,
      shape: 'square',
      followPointer: false,
      positioner(labelWidth, labelHeight, point) {
        return {
          x: point.plotX,
          y: 0,
        };
      },
      formatter() {
        // this of highchart
        return `<div style="font-size: 18px; font-weight: 500; font-family: Cera Pro"><span style="color: #474748"></span>${moment(this.x).format('h:mm A')}</div>`;
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

export const getHeartRateChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true,
}) => {
  data.averages = data.averages.map(element => ({
    x: element.x,
    y: element.y ? Math.round(element.y) : null,
  }));
  let yAxisMinMax = { min: 0, max: 150 };
  const hasData = _.find(data?.averages, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const { shortDashRanges } = findShortDashRange(_.clone(data.averages), type === 'Month' ? 1 : type === 'Year' ? 0 : 4);
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
      pointStart: data?.averages[1]?.x,
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

  // const lastData = _.findLast(data.averages, (item) => item.y);
  // if (lastData && isLastPoint(lastData.x, type)) {
  //   series.push({
  //     type: 'scatter',
  //     name: 'Heart Rate',
  //     data: [lastData],
  //     zIndex: 1,
  //     color: '#EF2641',
  //     marker: {
  //       width: 8,
  //       symbol: 'circle',
  //       radius: 4,
  //       lineColor: '#EF2641',
  //       fillColor: 'white',
  //       lineWidth: 1,
  //     },
  //   });
  // }

  const options = {
    chart: {
      spacingTop: isShowTooltip ? 32 : null,
      height: 180,
      events: {
        render() {
          const chart = this;
          // clear before shortdash
          // if (chart?.myLineLength > 0) {
          //   for (let index = 0; index < chart.myLineLength; index += 1) {
          //     if (!_.isEmpty(chart[`myLine${index}`])) {
          //       chart[`myLine${index}`].destroy();
          //     }
          //   }
          // }
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
      max: undefined,
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
      tickPositioner: () => {
        if (type === 'Month') {
          // cause I unshift the start of day, and add 0.5 day to each of after data.
          const ticks = _.filter(data.averages.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
          const ticksX = _.map(ticks, tick => tick.x - TICK_INTERVAL_ENUM.DAY / 2);
          ticksX.push(data.averages[data.averages.length - 1].x + TICK_INTERVAL_ENUM.DAY / 2);
          return ticksX;
        }
      },
    },
    yAxis: {
      opposite: true,
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
            return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro">${this.y} bpm | ${this.points[0].y} ↑ | ${this.points[1].y} ↓ at ${moment(this.x).format('mmm')}</div>`;
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

export const getHeartRateVariabilityChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true,
}) => {
  data.hrvs = data.hrvs.map(element => ({
    x: element.x,
    y: element.y ? Math.round(element.y) : null,
  }));
  let yAxisMinMax = { min: 0, max: 150 };
  const hasData = _.find(data?.hrvs, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const series = [
    {
      type: 'line',
      name: 'Heart Rate Variability',
      data: data.hrvs,
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
      pointStart: data.hrvs[1].x,
      connectNulls: true,
    },
  ];
  const options = {
    chart: {
      spacingTop: isShowTooltip ? 32 : null,
      height: 180,
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
      max: undefined,
      labels: {
        formatter(value) {
          if (type === 'Week') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          if (type === 'Month' && value.value === data.hrvs[data.hrvs.length - 1].x) {
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
      tickPositioner: () => {
        if (type === 'Month') {
          // cause I unshift the start of day, and add 0.5 day to each of after data.
          const ticks = _.filter(data.hrvs.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
          const ticksX = _.map(ticks, tick => tick.x - TICK_INTERVAL_ENUM.DAY / 2);
          ticksX.push(data.hrvs[data.hrvs.length - 1].x + TICK_INTERVAL_ENUM.DAY / 2);
          return ticksX;
        }
      },
    },
    yAxis: {
      opposite: true,
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
        const heartRateVar = `<span style="color: #EF2641">${this?.y} ms</span>`;
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
            return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro">${this.y} ms | ${this.points[0].y} ↑ | ${this.points[1].y} ↓ at ${moment(this.x).format('mmm')}</div>`;
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

export const getRestingHeartRateChart = ({
  data = [], labelFormatter = 'h A', tickInterval = 4 * 3600 * 1000,
  type = 'Day', isShowTooltip = true,
}) => {
  data.avgs = data.avgs.map(element => ({
    x: element.x,
    y: element.y ? Math.round(element.y) : null,
  }));
  let yAxisMinMax = { min: 0, max: 150 };
  const hasData = _.find(data?.hrvs, item => item.y);
  if (hasData) {
    yAxisMinMax = {};
  }
  const series = [
    {
      type: 'line',
      name: 'Heart Rate Variability',
      data: data.avgs,
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
      pointStart: data.avgs[1].x,
      connectNulls: true,
    },
  ];
  const options = {
    chart: {
      spacingTop: isShowTooltip ? 32 : null,
      height: 180,
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
      max: undefined,
      labels: {
        formatter(value) {
          if (type === 'Week') {
            return moment(value.value).format(labelFormatter).toUpperCase();
          }
          if (type === 'Month' && value.value === data.avgs[data.avgs.length - 1].x) {
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
      tickPositioner: () => {
        if (type === 'Month') {
          // cause I unshift the start of day, and add 0.5 day to each of after data.
          const ticks = _.filter(data.avgs.filter((x, i) => i !== 0), (x, i) => i % 7 === 0);
          const ticksX = _.map(ticks, tick => tick.x - TICK_INTERVAL_ENUM.DAY / 2);
          ticksX.push(data.avgs[data.avgs.length - 1].x + TICK_INTERVAL_ENUM.DAY / 2);
          return ticksX;
        }
      },
    },
    yAxis: {
      opposite: true,
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
            return `<div style="font-size: 14px; font-weight: 500; font-family: Cera Pro">${this.y} ms | ${this.points[0].y} ↑ | ${this.points[1].y} ↓ at ${moment(this.x).format('mmm')}</div>`;
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

export const getEmptyActivityChart = () => {
  const data = spanActivityDataByType({
    data: [],
    currentDate: moment(),
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(REPORT_TIME_TYPE_ENUM.DAY);
  return getActivityChart({
    data,
    labelFormatter,
    tickInterval,
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
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

export const getEmptyHeartRateVariabilityChart = () => {
  const data = spanHeartRateVariabilityDataByType({
    data: { vars: [] },
    currentDate: moment(),
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(REPORT_TIME_TYPE_ENUM.DAY);
  return getHeartRateVariabilityChart({
    data,
    labelFormatter,
    tickInterval,
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
};

export const getEmptyRestingHeartRateChart = () => {
  const data = spanRestingHeartRateDataByType({
    data: { avgs: [] },
    currentDate: moment(),
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
  const { labelFormatter, tickInterval } = getLabelFormatterAndTickInterval(REPORT_TIME_TYPE_ENUM.DAY);
  return getRestingHeartRateChart({
    data,
    labelFormatter,
    tickInterval,
    type: REPORT_TIME_TYPE_ENUM.DAY,
  });
};
