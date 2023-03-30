import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import ModalHeader from '../../UI/modalHeader';
import { getDataUnit, getDrawerTitle } from './helper';
import './style.scss';
import { MEASUREMENT_ENUM } from '../../../Constants/dailyEntry';

function DetailDailyEntryDrawer(props) {
  const arrayData = useMemo(() => {
    switch (props.type) {
      case MEASUREMENT_ENUM.BLOOD_PRESSURE:
        return props.data?.bloodPressureData;
      case MEASUREMENT_ENUM.BODY_TEMPERATURE:
        return props.data?.bodyTemperatureData;
      case MEASUREMENT_ENUM.HEART_RATE_AND_SPO2:
        return props.data?.heartRateAndSpo2Data;
      case MEASUREMENT_ENUM.WEIGHTS:
        return props.data?.weightData;
      default:
        return [];
    }
  }, [props.type, props.data]);

  return (
    <Drawer
      width={400}
      placement="right"
      className={classNames('detail-daily-entry-drawer', props.className)}
      title={getDrawerTitle(props.type)}
      onClose={props.onClickCancel}
      visible={props.visible}
    >
      <ModalHeader
        title={getDrawerTitle(props.type)}
        onClick={props.onClickCancel}
      />
      <div className="detail-daily-container">
        {_.isEmpty(arrayData) ? <div className="fcen">There is no data.</div> : (
          <>
            {_.map(arrayData, (item, idx) => (
              <div className="detail-card" key={idx}>
                <div className="detail-card-value">
                  <div className="bold-value">{item?.value || 0}</div>
                  <div>{getDataUnit(props.type)}</div>
                  {props.type === 'heartRateAndSpo2' && item?.value2 !== null && item?.value2 !== undefined && (
                    <>
                      <div className="ml30 bold-value">{item?.value2 || 0}</div>
                      <div>%</div>
                    </>
                  )}
                </div>
                <div>{item?.time}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </Drawer>
  );
}

DetailDailyEntryDrawer.defaultProps = {
  className: '',
  type: '',
  visible: false,
  data: {},
  onClickCancel: () => { },
};

DetailDailyEntryDrawer.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  visible: PropTypes.bool,
  data: PropTypes.shape(),
  onClickCancel: PropTypes.func,
};

export default DetailDailyEntryDrawer;
