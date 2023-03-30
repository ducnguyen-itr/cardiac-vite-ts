import { FilterFilled, FilterOutlined } from '@ant-design/icons';
import {
  Checkbox, Dropdown, Menu,
} from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useMergeState } from '../../Helpers/customHooks';
import CustomButton from '../Button/customButton';
import { isEmptyFilters } from './helper';
import './style.scss';

const CheckboxGroup = Checkbox.Group;

const CheckboxFilter = (props) => {
  const [state, setState] = useMergeState({});
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);

  const onChange = (name, value) => {
    setState({ [name]: value });
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const resetState = () => {
    const newState = {};
    _.forEach(props.options, (item) => {
      _.assign(newState, { [item.name]: [] });
    });
    setState(newState);
  };

  const onClickClear = async () => {
    resetState();
  };

  const onClickApply = () => {
    props.onApply(state);
    const isFiltered = !isEmptyFilters(state, props.options);
    setVisible(false);
    setFiltered(isFiltered);
  };

  useEffect(() => {
    const isFiltered = !isEmptyFilters(props.saveFilter, props.options);
    if (isFiltered) {
      setState(props.saveFilter);
    } else {
      resetState();
    }
    setFiltered(isFiltered);
  }, [visible, props.saveFilter, props.options]);

  const menu = (
    <Menu className="report-filter-menu">
      <div className="report-filter-menu-title">Filter</div>
      <div className="report-filter-menu-input">
        {_.map(props.options, (item, i) => (
          <div key={`${item?.name}-${i}`} className="report-filter-menu-input-item">
            <div className="title">{_.capitalize(item?.label)}</div>
            <CheckboxGroup
              className="report-filter-checkbox-group"
              options={item?.options}
              value={state[item.name]}
              onChange={val => onChange(item?.name, val)}
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
          disabled={isEmptyFilters(state, props.options)}
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
      visible={visible}
      trigger={['click']}
      overlay={menu}
      placement="bottomLeft"
      getPopupContainer={trigger => trigger.parentElement}
    >
      <CustomButton
        className={classnames('filter-button', props.className)}
        icon={isFiltered ? <FilterFilled className="color-blue-6" /> : <FilterOutlined />}
        label="Filter"
      />
    </Dropdown>
  );
};

CheckboxFilter.defaultProps = {
  className: '',
  options: [],
  onApply: () => { },
  saveFilter: {},
};

CheckboxFilter.propTypes = {
  /** Overwrite class name */
  className: PropTypes.string,
  /** Options of filter */
  options: PropTypes.arrayOf(PropTypes.shape()),
  /** Event apply filter */
  onApply: PropTypes.func,
  /** Saved filter */
  saveFilter: PropTypes.shape(),
};

export default CheckboxFilter;
