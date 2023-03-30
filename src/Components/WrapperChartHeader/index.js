/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const WrapperChartHeader = (props) => {
  const {
    title, min, max, avg, sleepHours, avgSleep, sleepingHrs, totalActive,
  } = props || {};

  return (
    <div className="wrapper-chart-header">
      <div className="wrapper-chart-header-title">{title}</div>
      <div className="wrapper-chart-header-info">
        {min && (
          <div className="wrapper-chart-header-info-item">
            <div>Min:</div>
            <div className="wrapper-chart-header-info-value">{min}</div>
          </div>
        )}
        {max && (
          <div className="wrapper-chart-header-info-item">
            <div>Max:</div>
            <div className="wrapper-chart-header-info-value">{max}</div>
          </div>
        )}
        {avg && (
          <div className="wrapper-chart-header-info-item">
            <div>Avg:</div>
            <div className="wrapper-chart-header-info-value">{avg}</div>
          </div>
        )}
        {sleepHours && (
          <div className="wrapper-chart-header-info-item">
            <div>Sleeping hour:</div>
            <div className="wrapper-chart-header-info-value">{sleepHours}</div>
          </div>
        )}
        {avgSleep && (
          <div className="wrapper-chart-header-info-item">
            <div>Avg sleeping:</div>
            <div className="wrapper-chart-header-info-value">{avgSleep}</div>
          </div>
        )}
        {sleepingHrs && (
          <div className="wrapper-chart-header-info-item">
            <div>Sleeping hour:</div>
            <div className="wrapper-chart-header-info-value">{sleepingHrs}</div>
          </div>
        )}
        {totalActive && (
          <div className="wrapper-chart-header-info-item">
            <div>Total active minutes:</div>
            <div className="wrapper-chart-header-info-value">{totalActive}</div>
          </div>
        )}
      </div>
    </div>
  );
};

WrapperChartHeader.defaultProps = {
  title: undefined,
  min: undefined,
  max: undefined,
  avg: undefined,
  sleepHours: undefined,
  avgSleep: undefined,
  sleepingHrs: undefined,
};

WrapperChartHeader.propTypes = {
  /** title */
  title: PropTypes.string,
  /** min */
  min: PropTypes.string,
  /** max */
  max: PropTypes.string,
  /** avg */
  avg: PropTypes.string,
  /** sleepHours */
  sleepHours: PropTypes.string,
  /** avgSleep */
  avgSleep: PropTypes.string,
  /** sleepingHrs */
  sleepingHrs: PropTypes.string,
};

export default WrapperChartHeader;
