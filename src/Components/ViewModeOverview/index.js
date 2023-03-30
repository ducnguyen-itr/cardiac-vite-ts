import {
  CalendarOutlined, DownOutlined, LeftOutlined, RightOutlined, UpOutlined,
} from '@ant-design/icons';
import {
  DatePicker, Dropdown, Menu, Popover,
} from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { VIEW_MODE_OPTIONS, VIEW_MODE_VALUE } from '../../Constants/overview';
import { useMergeState } from '../../Helpers/customHooks';
import CustomButton from '../Button/customButton';
import {
  checkDisabledChangeDate,
  disabledDate, getChartView, getDateString, getNewDate, getStartEndTime, isDisabledApply,
} from './helper';
import './style.scss';


const { RangePicker } = DatePicker;

function ViewModeOverview(props) {
  const [visible, setVisible] = useState(false);

  const [state, setState] = useMergeState({
    value: [],
    visible: false,
    dates: [],
  });

  const setFocusChangeDay = (val = []) => {
    const elements = document.querySelectorAll('.view-mode-range-picker .ant-picker-range .ant-picker-input');
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

  const onRangePickerChange = (val) => {
    setState({
      startTime: moment(val[0]._d).format('YYYY-MM-DD'),
      endTime: moment(val[1]._d).format('YYYY-MM-DD'),
      value: val,
    });
    setState({ dates: val });
    setFocusChangeDay(val);
  };

  const onCalendarChange = (val) => {
    setState({ dates: val, value: val });
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
    if (!flag) {
      setState({ visible: false });
    }
  };
  const handleVisiblePopover = (visible) => {
    setState({ visible: !state.visible });
  };

  const onClickCancel = () => {
    setState({ visible: false, value: [], dates: [] });
  };

  const onClickApply = () => {
    setState({ visible: false });
    setVisible(false);
    let diff = moment(state.dates?.[1]).diff(moment(state.dates?.[0]), 'd') + 1; // include both side

    if (!state.dates?.[1] || !state.dates?.[0]) {
      diff = 1;
    }
    const chartView = getChartView(diff);
    const item = {
      label: 'Custom',
      value: VIEW_MODE_VALUE.CUSTOM,
      endTime: state.dates?.[1] ? moment(state.dates?.[1]).endOf('day') : moment(state.dates?.[0]).endOf('day'),
      startTime: state.dates?.[0] ? moment(state.dates?.[0]).startOf('day') : moment(state.dates?.[1]).startOf('day'),
      numberVal: diff,
      chartView,
    };
    props.onChange(item);
  };

  const onChangeViewMode = (item) => {
    setVisible(false);
    if (state.visible) {
      setState({ visible: false });
    }
    const startEndTime = getStartEndTime(item);
    props.onChange({ ...item, ...startEndTime });
  };

  const onClickPrevious = () => {
    const newData = getNewDate({
      data: props.dayValues,
      isPrev: true,
    });
    props.onChange(newData);
  };

  const onClickNext = () => {
    const newData = getNewDate({
      data: props.dayValues,
      isPrev: false,
    });
    props.onChange(newData);
  };

  const dayShow = useMemo(() => getDateString(props.dayValues), [props.dayValues]);

  const disabledBtn = useMemo(() => checkDisabledChangeDate({
    dayValues: props.dayValues,
    activityHistory: props.activityHistory,
  }), [props.dayValues, props.activityHistory]);

  const popoverContent = () => (
    <div className="view-mode-popover-content-wrapper">
      <div className="view-mode-range-picker">
        <div className="range-picker-label">
          <div>Start date</div>
          <div className="end-date">End date</div>
        </div>
        <RangePicker
          value={state.value}
          className=""
          dropdownClassName="view-mode-calendar"
          disabledDate={current => disabledDate(current, state.dates, props.activityHistory)}
          onCalendarChange={onCalendarChange}
          onChange={onRangePickerChange}
          format="MM/DD/YYYY"
          autoFocus
          open={state.visible}
          placeholder={['Select date...', 'Select date...']}
          placement="bottomLeft"
          getPopupContainer={trigger => trigger}
        />
        <div className="total-day-show">{state.diffDayStr}</div>
      </div>
      <div className="view-mode-btn-container">
        <CustomButton onClick={onClickCancel} label="Cancel" />
        <CustomButton
          disabled={isDisabledApply(state.dates)}
          onClick={onClickApply}
          className="apply-button"
          type="primary"
          label="Apply"
        />
      </div>
    </div>
  );
  const menu = (
    <Menu className="view-mode-overview-menu">
      {_.map(VIEW_MODE_OPTIONS, (item, idx) => (
        <div key={idx}>
          {item?.value === VIEW_MODE_VALUE.CUSTOM
            ? (
              <Popover
                visible={visible && state.visible}
                trigger={['click']}
                placement="leftBottom"
                content={visible && state.visible ? popoverContent : null}
                getPopupContainer={trigger => trigger}
              >
                <CustomButton
                  icon={<CalendarOutlined />}
                  onClick={handleVisiblePopover}
                  className="view-mode-overview-menu-btn custom-view-label"
                  label={item?.label}
                />
              </Popover>
            )
            : (
              <CustomButton
                onClick={() => { onChangeViewMode(item); }}
                className="view-mode-overview-menu-btn "
                label={item?.label}
              />
            )}
        </div>
      ))}
    </Menu>
  );
  return (
    <div className="overview-view-mode-wrapper">
      <div className="overview-view-mode-wrapper-left">
        <CustomButton
          onClick={onClickPrevious}
          className="change-view-btn"
          icon={<LeftOutlined />}
          disabled={disabledBtn?.isDisabledPrev}
        />
        <div>{dayShow}</div>
        <CustomButton
          onClick={onClickNext}
          className="change-view-btn"
          icon={<RightOutlined />}
          disabled={disabledBtn?.isDisabledNext}
        />
      </div>
      <Dropdown
        onVisibleChange={handleVisibleChange}
        visible={visible}
        trigger={['click']}
        overlay={menu}
        placement="bottomRight"
        getPopupContainer={trigger => trigger}
      >
        <CustomButton
          className={classNames('view-mode-overview-button', props.className, visible ? 'active-btn' : '')}
          icon={visible ? <UpOutlined className="view-mode-btn-icon" /> : <DownOutlined className="view-mode-btn-icon" />}
          label={props.dayValues?.label || 'Day'}
        />
      </Dropdown>
    </div>
  );
}
ViewModeOverview.defaultProps = {
  className: '',
  activityHistory: [],
  dayValues: [],
  onChange: () => { },
};

ViewModeOverview.propTypes = {
  /** overwrite classname */
  className: PropTypes.string,
  /** day active careplan */
  activityHistory: PropTypes.arrayOf(PropTypes.shape({
    fromDate: PropTypes.string,
    toDate: PropTypes.string,
  })),
  dayValues: PropTypes.arrayOf(PropTypes.shape()),
  /** call back function change day */
  onChange: PropTypes.func,
};

export default ViewModeOverview;
