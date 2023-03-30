import { Select, Tooltip } from 'antd';

import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Blue1BgRow from '../UI/blue1BgRow';
import InputTitle from './inputTitle';
import './style.scss';

const { Option } = Select;

const SelectCTV2 = (props) => {
  const selectRef = useRef(undefined);

  const {
    className, placeholder, data, title, // onChange,
    showSearch, defaultValue, isValueOutside,
    value, mode, suffixIcon, name,
    disabled, isObject, size,
  } = props;

  const onChange = (value) => {
    props.onChange(name, value);
    selectRef.current.blur();
  };

  const onSearch = (value) => {
    props.onSearch(name, value);
  };

  return (
    <div
      className={classnames('select-ct-wrapper', className)}
      key={`select-ct-wrapper-${props.name}`}
    >
      <InputTitle title={title} />

      <Select
        labelInValue
        getPopupContainer={trigger => trigger.parentElement}
        disabled={disabled}
        ref={selectRef}
        suffixIcon={suffixIcon}
        mode={mode}
        size={size}
        defaultValue={defaultValue}
        value={isValueOutside ? []
          : isObject ? value || undefined
            : value}
        showSearch={showSearch}
        placeholder={placeholder}
        optionFilterProp="children"
        onChange={onChange}
        onSearch={showSearch ? onSearch : undefined}
        filterOption={(input, option) => {
          const normalizeInput = input.toLowerCase();
          if (option?.className === 'rma-options') {
            const normalizeFullLabel = (option?.value?.toLowerCase());
            return normalizeFullLabel?.includes(normalizeInput);
          }
          const normalizeFullLabel = (option.children.toLowerCase());
          return normalizeFullLabel.includes(normalizeInput);
        }}
      >
        {
          isObject ? (
            _.map(data, (x, i) => (x?.isRMA
              ? (

                <Option className="rma-options" disabled key={i} value={x.value}>
                  <Tooltip
                    overlayInnerStyle={{ minWidth: '295px' }}
                    placement="bottomLeft"
                    title="You cannot start a study on an RMA device"
                  >
                    <div className="rma-options-container">
                      <div>{x.label}</div>
                      <div className="rma-tag">RMA</div>
                    </div>
                  </Tooltip>
                </Option>

              )
              : <Option key={i} value={x.value}>{x.label}</Option>))
          )
            : _.map(data, (x, i) => (
              <Option key={i} value={x}>{x}</Option>
            ))
        }
      </Select>

      {
        isValueOutside && (
          <div className="select-ct-outside-res">
            {
              _.map(value, (x, i) => (
                <Blue1BgRow
                  key={i}
                  value={x.value}
                  className="mt8"
                  onClick={() => props.onRemove(name, x)}
                  isShowDeleteButton
                />
              ))
            }
          </div>
        )
      }
    </div>
  );
};

SelectCTV2.defaultProps = {
  className: undefined,
  title: '',
  placeholder: 'Select...',
  data: [],
  onChange: () => { },
  onSearch: () => { },
  showSearch: true,
  defaultValue: undefined,
  isValueOutside: false,
  mode: undefined, // 'tags', // or multiple
  value: [],
  suffixIcon: undefined,
  name: '',
  disabled: false,
  isObject: false,
  size: 'default',
  onRemove: () => { },
};

SelectCTV2.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.shape()),
  ]),
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
  onSearch: PropTypes.func,
  showSearch: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  isValueOutside: PropTypes.bool,
  mode: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.shape(),
  ]),
  suffixIcon: PropTypes.node,
  name: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  isObject: PropTypes.bool,
};

export default SelectCTV2;
