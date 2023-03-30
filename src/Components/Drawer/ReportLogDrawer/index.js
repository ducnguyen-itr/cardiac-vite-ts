import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer, Space, Spin } from 'antd';
import ModalHeader from '../../UI/modalHeader';
import DisplayData3 from '../../UI/displayData3';
import DisplayData2 from '../../UI/displayData2';
import consoleLog from '../../../Helpers/consoleLog';
import { fetchReportHistory } from './helper';
import './style.scss';
import { useEmitter } from '../../../Helpers/customHooks';
import EMITTER_CONSTANTS from '../../../Constants/emitter';

function ReportLogDrawer(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const sendingData = {
      filter: {
        logName: 'Report',
        collectionId: props.reportId,
        sortOrder: 'desc',
        sortField: '_id',
      },
      limit: 999,
    };
    try {
      const dataFormat = await fetchReportHistory(sendingData);
      setData(dataFormat);
      setLoading(false);
    } catch (error) {
      consoleLog(error);
      setLoading(false);
    }
  };

  const handleUpdateReportLogListener = (msg) => {
    if (props.visible && (props.reportId === msg?.collectionId || props.reportId === msg?._id)) {
      fetchData();
    }
  };

  useEffect(() => {
    if (props.visible) {
      fetchData();
    }
  }, [props.visible]);

  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_BIOHEART_REPORT_LOG, handleUpdateReportLogListener, [props.reportId, props.visible]);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_BIOFLUX_REPORT_LOG, handleUpdateReportLogListener, [props.reportId, props.visible]);
  useEmitter(EMITTER_CONSTANTS.UPDATED_REPORT, handleUpdateReportLogListener, [props.reportId, props.visible]);

  const renderMainView = () => (
    <>
      {
        loading && (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        )
      }
      <DisplayData2
        className="report-log-display-data"
        data={data}
        isStrip
        leftWidth={3}
      />
    </>
  );

  return (
    <>
      <Drawer
        width={450}
        placement="right"
        className="edit-add-patient-info-drawer"
        title="Report log"
        onClose={props.onClickCancel}
        visible={props.visible}
      >
        <ModalHeader
          title="Report log"
          onClick={props.onClickCancel}
        />
        {renderMainView()}
      </Drawer>

    </>
  );
}

ReportLogDrawer.defaultProps = {
  visible: false,
  reportId: '',
};

ReportLogDrawer.propTypes = {
  onClickCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  reportId: PropTypes.string,
};

export default ReportLogDrawer;
