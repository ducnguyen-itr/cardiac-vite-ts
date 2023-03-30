import { FilterFilled, FilterOutlined } from '@ant-design/icons';
import {
  Checkbox, DatePicker, Dropdown, Menu,
} from 'antd';
import classnames from 'classnames';
import _, { isEmpty } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useMergeState } from '../../Helpers/customHooks';
import CustomButton from '../Button/customButton';
import InputTitle from '../Input/inputTitle';
import {
  disabledEndDate, disabledStartDate, getInitState, getNewFilter, isDisabledClear, isEmptyFilter,
} from './helper';
import './style.scss';

const CheckboxGroup = Checkbox.Group;

function BillingFilter(props) {
  const [state, setState] = useMergeState({
    status: [],
    duration: [],
    startDate: null,
    endDate: null,
    isFiltered: false,
    programTypes: [],
  });

  const onChange = (name, value) => {
    setState({ [name]: value });
  };

  const handleVisibleChange = (flag) => {
    setState({ visible: flag });
  };

  const onClickClear = async () => {
    await setState({
      status: [],
      duration: [],
      startDate: moment(),
      endDate: moment(),
      programTypes: [],
    });
    // Set default picker view to current time
    await setState({
      startDate: null,
      endDate: null,
    });
  };

  const onClickApply = () => {
    const newFilter = getNewFilter(state);
    props.onApply(newFilter);
    const isFiltered = !isEmptyFilter(state);
    setState({ visible: false, isFiltered });
  };

  useEffect(() => {
    const initState = getInitState(props.saveFilter);
    setState({ ...initState });
  }, [state.visible, props.saveFilter]);


  const menu = (
    <Menu className="billing-filter-menu">
      <div className="billing-filter-menu-title">Filter</div>

      <div className="billing-filter-menu-input">
        <div className="title">Date of service</div>
        {/* <div className="desc">The timeframe is required to be at least 2 days</div> */}
        <InputTitle title="Start date" />
        <DatePicker
          placeholder="Select date..."
          value={state.startDate}
          suffixIcon={null}
          className={classnames('start-date', props.name)}
          dropdownClassName="start-day-container"
          format="MM/DD/YYYY"
          getPopupContainer={() => document.querySelector(`.start-date.${props.name}`)}
          showToday={false}
          onChange={val => onChange('startDate', val)}
          disabledDate={current => disabledStartDate(current, state.endDate)}
          defaultPickerValue={moment()}
        />

        <InputTitle title="Stop date" className="mt5" />
        <DatePicker
          placeholder="Select date..."
          suffixIcon={null}
          value={state.endDate}
          className={classnames('end-date', props.name)}
          format="MM/DD/YYYY"
          dropdownClassName="start-day-container"
          getPopupContainer={() => document.querySelector(`.end-date.${props.name}`)}
          showToday={false}
          onChange={val => onChange('endDate', val)}
          disabledDate={current => disabledEndDate(current, state.startDate)}
          defaultPickerValue={moment()}
        />

        {_.map(props.options, (x, i) => (
          <div key={`${x.title}-${i}`}>
            <div className="title mt16">{x?.title}</div>
            <CheckboxGroup
              className="billing-filter-checkbox-group"
              options={x.options}
              value={state[x.name]}
              onChange={val => onChange(x?.name, val)}
            />
          </div>
        ))}
      </div>
      <div className="button-container">
        <CustomButton
          key="clear"
          label="Clear"
          className="mr16"
          onClick={onClickClear}
          disabled={isDisabledClear(state)}
        />
        <CustomButton
          key="apply"
          type="primary"
          label="Apply"
          onClick={onClickApply}
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
      placement="bottomRight"
    >
      <CustomButton
        className={classnames('filter-button', props.className)}
        icon={state?.isFiltered ? <FilterFilled className="color-blue-6" /> : <FilterOutlined />}
        label="Filter"
      />
    </Dropdown>
  );
}

BillingFilter.defaultProps = {
  className: '',
  options: [],
  name: '',
  onApply: () => { },
  saveFilter: {},
};

BillingFilter.propTypes = {
  className: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape()),
  name: PropTypes.string,
  onApply: PropTypes.func,
  saveFilter: PropTypes.shape(),
};

export default BillingFilter;
