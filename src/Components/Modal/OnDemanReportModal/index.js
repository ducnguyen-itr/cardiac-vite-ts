import './style.scss';

import {
  DatePicker, Modal,
} from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import _ from 'lodash';
import { ON_DEMAND_REPORT } from '../../../Constants/carePlan';
import { useMergeState } from '../../../Helpers/customHooks';
import CustomButton from '../../Button/customButton';
import { createNewOnDemandReport, disabledDate, isValidRangeTime } from './helper';


const { RangePicker } = DatePicker;
const OnDemandReportModal = (props) => {
  const {
    visible, loading,
  } = props;
  const [state, setState] = useMergeState({
    startTime: '',
    endTime: '',
    value: [],
    dates: [],
    isShowRangeDatePickerPanel: false,
    isError: false,
    diffDayStr: '0 day',
  });

  // functions for modal
  const onCancel = (e) => {
    e.stopPropagation();
    setState({
      isShowRangeDatePickerPanel: false, dates: [], value: [], startTime: '', endTime: '',
    });
    setTimeout(() => { props.onClickCancel(); }, 150);
  };
  const onCreate = async (e) => {
    e.stopPropagation();
    props.onClickCreate();
    // create new ondemand report here
    const sendingData = {
      input: {
        carePlanId: props.carePlan_id,
        startDate: state.startTime,
        endDate: state.endTime,
      },
    };
    await createNewOnDemandReport(sendingData);
    setTimeout(() => {
      setState({
        isShowRangeDatePickerPanel: false, dates: [], value: [], startTime: '', endTime: '',
      });
      // props.onStopLoadingButton();
      props.onCloseModal();
    }, 100);
    props.onReloadOnDemandReportTable();
  };

  // functions and data for range picker

  const footerBtns = [
    <CustomButton
      key="cancel"
      onClick={onCancel}
      label="Cancel"
    />,
    <CustomButton
      key="create"
      onClick={onCreate}
      type="primary"
      loading={loading}
      disabled={!isValidRangeTime(state.startTime, state.endTime) || state.isError}
      label="Create"
    />,
  ];

  const setFocusChangeDay = (val = []) => {
    const elements = document.querySelectorAll('.ant-picker-range .ant-picker-input');
    if (elements) {
      _.forEach(elements, (ele) => {
        if (!ele.className?.includes('ant-picker-input-active') && !val?.[1]) {
          const input = ele.querySelector('input');
          if (input) {
            setTimeout(() => {
              input.focus();
            }, 50);
          }
        }
        if (ele.className?.includes('ant-picker-input-active') && val?.[1]) {
          const input = ele.querySelector('input');
          if (input) {
            setTimeout(() => {
              input.focus();
            }, 50);
          }
        }
      });
    }
  };

  const checkError = (val) => {
    if (val[0] && val[1]) {
      const startDate = moment(val[0]).startOf('day');
      const endDate = moment(val[1]).startOf('day');
      const diffDay = moment(endDate).diff(startDate, 'day');
      const diffDayStr = `${diffDay + 1} day${diffDay + 1 > 1 ? 's' : ''}`;
      if (diffDay < 6 || diffDay > 29) {
        setState({ isError: true, diffDayStr });
      } else {
        setState({ isError: false, diffDayStr });
      }
    } else {
      setState({ isError: false });
    }
  };

  const onRangePickerChange = (val) => {
    setState({
      startTime: moment(val[0]._d).format('YYYY-MM-DD'),
      endTime: moment(val[1]._d).format('YYYY-MM-DD'),
      value: val,
    });
    setState({ dates: val });
    checkError(val);
  };

  const onCalendarChange = (val) => {
    setState({ dates: val, value: val });
    checkError(val);
    setFocusChangeDay(val);
  };

  useEffect(() => {
    setTimeout(() => setState({ isShowRangeDatePickerPanel: visible }), 40);
  }, [visible]);

  return (
    <Modal
      className="on-demand-report-modal"
      title="Create on-demand report"
      visible={visible}
      width={570}
      onCancel={onCancel}
      footer={footerBtns}
      maskClosable={false}
    >
      <div className="range-picker-label">
        <div>Start date</div>
        <div className="end-date">End date</div>
        <div className="total-day">Total</div>
      </div>
      <div className="ondemand-range-picker">
        <RangePicker
          value={state.value}
          className="on-demand-report-modal__range-picker"
          dropdownClassName="on-demand-calendar"
          disabledDate={current => disabledDate(current, state.dates, props.startDate)}
          onCalendarChange={onCalendarChange}
          open={state.isShowRangeDatePickerPanel}
          onChange={onRangePickerChange}
          format="MM/DD/YYYY"
          autoFocus
          placeholder={['Select date...', 'Select date...']}
        />
        <div className="total-day-show">{state.diffDayStr}</div>
      </div>
      {/* {state.isError && (
        <div className="error-message">
          The report timeframe must be at least 7 days and less than 31 days.
        </div>
      )} */}
      <div className="instruction">
        <p>{ON_DEMAND_REPORT.instruction}</p>
      </div>
      <div className="content" />
    </Modal>
  );
};
OnDemandReportModal.defaultProps = {
  carePlan_id: '',
  visible: false,
  loading: false,
  onClickCreate: () => { },
  onClickCancel: () => { },
  onCloseModal: () => { },
  startDate: '',
  onReloadOnDemandReportTable: () => { },
};

OnDemandReportModal.propTypes = {
  carePlan_id: PropTypes.string,
  visible: PropTypes.bool,
  loading: PropTypes.bool,
  onClickCreate: PropTypes.func,
  onClickCancel: PropTypes.func,
  onCloseModal: PropTypes.func,
  startDate: PropTypes.string,
  onReloadOnDemandReportTable: PropTypes.func,
};

export default OnDemandReportModal;
