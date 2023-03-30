import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Collapse, Space, Spin } from 'antd';
import { getVitalsData, handleFetchInitialData } from '../../helper';
import DisplayData2 from '../../../../UI/displayData2';
import './style.scss';

const { Panel } = Collapse;

function AppointmentHistory(props) {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const handleCreateInitialData = async () => {
    const result = await handleFetchInitialData(props.patientId);
    setData(result.history);
    setLoaded(true);
  };

  useEffect(() => {
    if (props.patientId) {
      handleCreateInitialData();
    }
  }, [props.patientId]);

  const renderHistory = (data = {}) => {
    const arrayData = getVitalsData(data?.vital);
    return (
      <div>
        <div className="appointment-history-title">Vital signs</div>
        <DisplayData2
          className="mt12"
          data={arrayData}
          isStrip
        />
        <div className="appointment-history-title mt12">Reason for visit</div>
        <div className="appointment-history-reason mt12">
          { data?.reasons?.length > 0 ? _.map(data?.reasons, (x, i) => (
            <>
              <span key={i}>{`${data?.reasons?.length > 1 ? '• ' : ''}${x}`}</span>
            </>
          )) : '--'}
        </div>
      </div>
    );
  };
  return (
    <div className={classnames('appointment-history', data?.length > 0 ? '' : 'text-align-center')}>

      {
        !loaded ? (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        ) : (
          <>
            {data?.length > 0 ? (
              <Collapse defaultActiveKey={['0']}>
                {_.map(data, (x, i) => (
                  <Panel key={i} header={x?.title}>
                    {renderHistory(x)}
                  </Panel>
                ))}
              </Collapse>
            ) : (
              <span>No history</span>
            )}
          </>
        )
      }
    </div>
  );
}
AppointmentHistory.defaultProps = {
};
AppointmentHistory.propTypes = {
  patientId: PropTypes.string.isRequired,
};

export default AppointmentHistory;
