import _ from 'lodash';
import { convertCelsiustoFahrenheit, parseImperialWeight } from '.';
import { CHART_TYPE_ENUM, MULTIPLE_RECORD_MODE, VIEW_MODE_VALUE } from '../Constants/overview';

const formatNumber = (number, fix = 1) => {
  if (_.isNaN(number) || _.isNil(number)) {
    return null;
  }
  return parseFloat(number.toFixed(fix));
};

const showData = (value, unit, suffix) => (_.isNil(value) || _.isNaN(value)
  ? '--' : `${value} ${unit}${suffix && value > 1 ? suffix : ''}`);

const showSubValData = (value, subVal, unit, suffix) => (_.isNil(value) || _.isNaN(value)
  ? '--' : `${value}/${subVal} ${unit}${suffix && value > 0 ? suffix : ''}`);

const showBmiWeightData = (bmi, weight) => (_.isNil(weight) || _.isNaN(weight)
  ? '--' : `${weight || '--'} lb - ${bmi || '--'}`);

export const getTimeData = (hours) => {
  if (_.isNil(hours) || _.isNaN(hours)) return '--';
  const hour = Math.trunc(hours / 1);
  const min = (hours - hour) * 60;
  const time = `${`00${hour}`.slice(-2)} hr ${`00${(min).toFixed(0)}`.slice(-2)}`;
  return time;
};
const getAvg = (data, fix = 1) => {
  if (_.isEmpty(data)) return null;
  const count = _.sumBy(data, 'count');
  const total = _.sumBy(data, 'sum');
  const avg = count ? formatNumber((total / count), fix) : null;
  return avg;
};
export const getMinMaxAvgConfig = (input) => {
  const {
    data, mode, unit, typeChart,
    systolicData,
    diastolicData,
    suffix,
    weightData, bmiData, minBmiData,
    maxData, minData, isActivity,
    isBodyTemprate, isMedication, isOxigen,
  } = input || {};
  const config = { min: '', max: '', avg: '' };
  if (!MULTIPLE_RECORD_MODE.includes(mode) && !isMedication) {
    if (typeChart === CHART_TYPE_ENUM.WEIGHT_BMI) {
      const minBmi = _.minBy(minBmiData, 'y')?.y;
      const maxBmi = _.maxBy(bmiData, 'y')?.y;


      const avgBmi = getAvg(bmiData);

      const minWeight = _.minBy(weightData, 'low')?.low;
      const maxWeight = _.maxBy(weightData, 'high')?.high;
      const avgWeight = getAvg(weightData);
      const lbAvgWeight = avgWeight ? parseImperialWeight(avgWeight).toFixed(1) : null;
      return {
        min: showBmiWeightData(minBmi, minWeight, unit),
        max: showBmiWeightData(maxBmi, maxWeight, unit),
        avg: showBmiWeightData(avgBmi, lbAvgWeight, unit),
      };
    }

    if (typeChart === CHART_TYPE_ENUM.BLOOD_PRESSURE) {
      const minSystolic = _.minBy(systolicData, 'low')?.low;
      const maxSystolic = _.maxBy(systolicData, 'high')?.high;
      const avgSystolic = getAvg(systolicData, 0);

      const minDiastolic = _.minBy(diastolicData, 'low')?.low;
      const maxDiastolic = _.maxBy(diastolicData, 'high')?.high;
      const avgDiastolic = getAvg(diastolicData, 0);
      return {
        min: showSubValData(minSystolic, minDiastolic, unit),
        max: showSubValData(maxSystolic, maxDiastolic, unit),
        avg: showSubValData(avgSystolic, avgDiastolic, unit),
      };
    }

    if (typeChart === CHART_TYPE_ENUM.LINE) {
      if (isOxigen) {
        const min = _.minBy(data, 'low')?.low;
        const max = _.maxBy(data, 'high')?.high;
        const countData = _.sumBy(data, 'count');
        const totalData = _.sumBy(data, 'sum');
        const avg = countData ? formatNumber(totalData / countData) : null;
        return {
          min: showData(min, unit, suffix),
          max: showData(max, unit, suffix),
          avg: showData(avg, unit, suffix),
        };
      }
      const min = _.minBy(minData, 'y')?.y;
      const max = _.maxBy(maxData, 'y')?.y;
      let avg;
      if (isActivity) {
        avg = formatNumber(formatNumber(_.meanBy(maxData, 'y')));
      } else {
        const countData = _.sumBy(_.filter(maxData, x => !_.isNil(x.count)), 'count');
        const totalData = _.sumBy(_.filter(maxData, x => !_.isNil(x.sum)), 'sum');
        if (isBodyTemprate) {
          avg = countData ? convertCelsiustoFahrenheit(totalData / countData).toFixed(1) : null;
        } else {
          avg = countData ? formatNumber(totalData / countData) : null;
        }
      }

      return {
        min: showData(min, unit, suffix),
        max: showData(max, unit, suffix),
        avg: showData(avg, unit, suffix),
      };
    }
  }

  if (typeChart === CHART_TYPE_ENUM.LINE) {
    const min = _.minBy(data, 'y')?.y;
    const max = _.maxBy(data, 'y')?.y;
    const avg = formatNumber(_.meanBy(_.filter(data, x => !_.isNil(x.y)), 'y'));
    _.assign(config, {
      min: showData(min, unit, suffix),
      max: showData(max, unit, suffix),
      avg: showData(avg, unit, suffix),
    });
  }

  if (typeChart === CHART_TYPE_ENUM.SLEEP_HOUR) {
    const min = _.minBy(data, 'y')?.y;
    const max = _.maxBy(data, 'y')?.y;
    const avg = _.meanBy(data, 'y');
    _.assign(config, {
      min: getTimeData(min),
      max: getTimeData(max),
      avg: getTimeData(avg),
      sleepHours: getTimeData(max),
    });
  }

  if (typeChart === CHART_TYPE_ENUM.BLOOD_PRESSURE) {
    const minSystolic = _.minBy(systolicData, 'y')?.y;
    const maxSystolic = _.maxBy(systolicData, 'y')?.y;
    const avgSystolic = formatNumber(_.meanBy(systolicData, 'y'), 0);

    const minDiastolic = _.minBy(diastolicData, 'y')?.y;
    const maxDiastolic = _.maxBy(diastolicData, 'y')?.y;
    const avgDiastolic = formatNumber(_.meanBy(diastolicData, 'y'), 0);
    _.assign(config, {
      min: showSubValData(minSystolic, minDiastolic, unit),
      max: showSubValData(maxSystolic, maxDiastolic, unit),
      avg: showSubValData(avgSystolic, avgDiastolic, unit),
    });
  }

  if (typeChart === CHART_TYPE_ENUM.WEIGHT_BMI) {
    const minBmi = _.minBy(bmiData, 'y')?.y;
    const maxBmi = _.maxBy(bmiData, 'y')?.y;
    const avgBmi = formatNumber(_.meanBy(bmiData, 'y'));

    const minWeight = _.minBy(weightData, 'y')?.y;
    const maxWeight = _.maxBy(weightData, 'y')?.y;
    const avgWeight = formatNumber(_.meanBy(weightData, 'y'));
    _.assign(config, {
      min: showBmiWeightData(minBmi, minWeight, unit),
      max: showBmiWeightData(maxBmi, maxWeight, unit),
      avg: showBmiWeightData(avgBmi, avgWeight, unit),
    });
  }

  return config;
};
