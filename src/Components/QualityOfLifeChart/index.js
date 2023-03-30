import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { Polar } from '@reactchartjs/react-chart.js';
import { Typography } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { QOL_COLORS_DATA, QOL_LABELS_DATA } from '../../Constants/patientDetails';
import CustomButton from '../Button/customButton';
import DisplayData2 from '../UI/displayData2';
import { getAdditionalInfo } from './helper';

const { Title } = Typography;

const QualityOfLifeChart = (props) => {
  const {
    data, className,
  } = props;
  const {
    physicalFunc, limitPhysical, limitEmotional, energyFatigue, socialFunc, generalHealth,
    sf36Questions,
    // emotional, pain,
  } = data || {};

  const isNodata = _.isNil(physicalFunc) && _.isNil(limitPhysical)
    && _.isNil(limitEmotional) && _.isNil(energyFatigue)
    && _.isNil(socialFunc) && _.isNil(generalHealth);

  //  && _.isNil(pain) && _.isNil(emotional)

  const patientData = [
    generalHealth || 0,
    physicalFunc || 0,
    limitPhysical || 0,
    limitEmotional || 0,
    socialFunc || 0,
    energyFatigue || 0,
  ];

  const chartData = {
    labels: _.map(QOL_LABELS_DATA, (x, index) => `${x}: ${patientData[index]}%`),
    datasets: [
      {
        data: patientData,
        backgroundColor: QOL_COLORS_DATA,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: true,
      position: 'left',
      align: 'start',
      labels: {
        boxWidth: 14, fontSize: 14, padding: 22, fontColor: '#262626',

      },
      onClick: () => null,
    },
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          return data?.labels[tooltipItem?.index];
        },
      },
    },
    scale: {
      ticks: {
        display: false,
        max: 100,
        min: 0,
        stepSize: 20,
      },
    },
  };

  return (
    <div className={classnames('quality-of-life', className)}>
      <div className="qol-title-container">
        <Title level={5}>Initial quality of life</Title>
        {!isNodata && props.isAddEditAble && (
          <CustomButton
            type="primary"
            ghost
            className="fcen edit-qol-btn"
            onClick={() => props.addQualityOfLife(true)}
            icon={<EditFilled />}
            size="small"
            label="Edit"
          />
        )}
      </div>

      {
        isNodata ? (
          <div className="no-data-to-display">
            {props.isUnLinked ? (<span>There is no data to display</span>) : (
              <span>The patient has not yet completed the QOL test, please issue a reminder</span>
            )}
            {props.isAddEditAble && (
              <CustomButton
                className="fcen mt16"
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => props.addQualityOfLife(false)}
                label="Add patient’s quality of life"
              />
            )}
          </div>
        ) : (
          <>
            <div className="size-14-b-g9 mt12 padl12">Scoring</div>
            <div className="quality-of-life-chart">
              <Polar data={chartData} options={options} />
            </div>
            <DisplayData2
              titleClassName="padl12 additional-info-title"
              title="Additional information"
              className="mt16"
              data={getAdditionalInfo(sf36Questions?.slice(-3))}
              isStrip
              leftWidth={6}
            />
          </>
        )
      }
    </div>
  );
};

QualityOfLifeChart.defaultProps = {
  className: undefined,
  data: {},
  isUnLinked: false,
  isAddEditAble: false,
  addQualityOfLife: () => { },
};

QualityOfLifeChart.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape(),
  isUnLinked: PropTypes.bool,
  isAddEditAble: PropTypes.bool,
  addQualityOfLife: PropTypes.func,
};

export default QualityOfLifeChart;
