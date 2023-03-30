import React, { useState } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';
import { Select } from 'antd';
import { COMFIRM_VIA_OPTIONS } from '../helper';

const ConfirmViaSelect = (props) => {
  const [options, setOptions] = useState(COMFIRM_VIA_OPTIONS);
  const [keyword, setKeyword] = useState();

  const onChange = (value, option) => {
    if (!option) {
      props.onChangeInput('confirmedVia', value);
      setOptions(COMFIRM_VIA_OPTIONS);
      return;
    }
    props.onChangeInput('confirmedVia', value);
    setOptions(COMFIRM_VIA_OPTIONS);
  };

  const onSearch = (keyword) => {
    setKeyword(keyword);
    const findByKeyword = COMFIRM_VIA_OPTIONS.filter(option => option.label.toLowerCase().includes(keyword.toLowerCase()));
    if (findByKeyword.length !== 0) {
      setOptions(findByKeyword);
    } else {
      setOptions([{ value: keyword, label: keyword, isOther: true }]);
    }
  };
  return (
    <div className={classnames('confirm-via-select', props.className)}>
      <div className="title">
        Confirm via
      </div>
      <Select
        optionLabelProp="label"
        filterOption={false}
        value={props.value}
        onSearch={onSearch}
        showSearch
        placeholder="Select..."
        allowClear
        onChange={onChange}
      >
        {options.map(method => (
          <Select.Option
            className={classnames(
              'method-select-item',
              method?.isOther ? 'method-select-item__custom' : '',
            )}
            // key={icdCode._id}
            isOther={method?.isOther}
            value={method.value}
            label={method.label}
          >
            <div
              className={classnames(
                'method-select-selection',
                method.isOther ? 'method-select-selection__custom' : '',
              )}
            >
              {method?.isOther ? (
                <>{`Use "${method.label}" anyway`}</>
              ) : (
                <>{method.label}</>
              )}
            </div>
          </Select.Option>
        ))}
      </Select>
    </div>

  );
};

ConfirmViaSelect.defaultProps = {
  className: undefined,
  value: undefined,
  onChangeInput: () => {},
};

ConfirmViaSelect.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** value */
  value: PropTypes.string,
  /** on change function */
  onChangeInput: PropTypes.func,
};

export default ConfirmViaSelect;
