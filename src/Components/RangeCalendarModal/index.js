import React from 'react';
import PropTypes from 'prop-types';
import { CalendarOutlined } from '@ant-design/icons';
import {
  Button, DatePicker, Dropdown, Menu,
} from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import { useMergeState } from '../../Helpers/customHooks';
import { disabledDate } from './helper';
import './style.scss';
import CustomButton from '../Button/customButton';

const { RangePicker } = DatePicker;

function RangeDatePickerInput(props) {
  const [state, setState] = useMergeState({
    startTime: '',
    endTime: '',
    value: [],
    dates: [],
    isShowRangeDatePickerPanel: true,
    isError: false,
    diffDayStr: '0 day',
    dateString: '',
  });

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

  const handleVisibleChange = (flag) => {
    setState({ visible: flag });
  };

  const menu = (
    <Menu className="ranger-date-picker-menu">
      <div className="top-container">
        {props.description && <div className="description">{props.description}</div>}
        <RangePicker
          value={state.value}
          className="range-date-picker-input__range-picker"
          dropdownClassName="ranger-picker-calendar"
          // disabledDate={current => disabledDate(current, state.dates)}
          onCalendarChange={onCalendarChange}
          open={state.visible}
          onChange={onRangePickerChange}
          format="MM/DD/YYYY"
          autoFocus
          placement="bottomRight"
          placeholder={['Select date...', 'Select date...']}
          getPopupContainer={() => document.getElementsByClassName('range-date-picker-input__range-picker')[0]}
        />
      </div>
      <div className="button-container">
        <CustomButton
          key="cancel"
          label="Cancel"
          className="mr16"
        />
        <CustomButton
          key="ok"
          type="primary"
          label="Ok"
        />
      </div>
    </Menu>
  );

  return (
    <Dropdown
      onVisibleChange={handleVisibleChange}
      visible={state.visible}
      trigger={['click']}
      overlay={menu}
      placement="bottomLeft"
    // getPopupContainer={() => document.getElementsByClassName('drop-down-popup-container')[0]}
    >
      <Button className={classnames('ranger-picker-input-container', props.className)}>
        <div className="time-show">
          {state.dateString ? <div>{state.dateString}</div> : <div>Select date of service</div>}
        </div>
        <CalendarOutlined className="date-icon" />
      </Button>
    </Dropdown>

  );
}

RangeDatePickerInput.defaultProps = {
  className: '',
  description: 'The timeframe is required to be at least 7 days',
};

RangeDatePickerInput.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
};

export default RangeDatePickerInput;
