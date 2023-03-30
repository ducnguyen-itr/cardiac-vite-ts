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
import { isDisabledClear, isEmptyFilter } from './helper';
import './style.scss';

const CheckboxGroup = Checkbox.Group;

function ReportFilter(props) {
  const [state, setState] = useMergeState({
    status: [],
    review: [],
  });
  const [isFiltered, setFiltered] = useState(false);
  const [visible, setVisible] = useState(false);

  const onChange = (name, value) => {
    setState({ [name]: value });
  };

  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onClickClear = async () => {
    await setState({
      status: [],
      review: [],
    });
  };

  const onClickApply = () => {
    props.onApply(state);
    const isFiltered = !isEmptyFilter(state);
    setVisible(false);
    setFiltered(isFiltered);
  };

  useEffect(() => {
    const isFiltered = !isEmptyFilter(props.saveFilter);
    if (visible) {
      if (isFiltered) {
        setState(_.cloneDeep(props.saveFilter));
      } else {
        setState({
          status: [],
          review: [],
        });
      }
    }
    setFiltered(isFiltered);
  }, [visible, props.saveFilter]);

  const menu = (
    <Menu className="report-filter-menu">
      <div className="report-filter-menu-title">Filter</div>

      <div className="report-filter-menu-input">
        {_.map(props.options, (item, i) => (
          <div key={`${item?.name}-${i}`} className="report-filter-menu-input-item">
            <div className="title">{_.capitalize(item?.name)}</div>
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
}

ReportFilter.defaultProps = {
  className: '',
  options: [],
  onApply: () => { },
  saveFilter: {},
};

ReportFilter.propTypes = {
  /** component class name */
  className: PropTypes.string,
  /** options filter */
  options: PropTypes.arrayOf(PropTypes.shape()),
  /** event apply filter */
  onApply: PropTypes.func,
  /** filter */
  saveFilter: PropTypes.shape(),
};

export default ReportFilter;
