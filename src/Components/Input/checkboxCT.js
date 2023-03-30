import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import DatepickerCT from './datepickerCT';
import InputCT from './inputCT';
import SelectCT from './selectCT';
import InputTitle from './inputTitle';
import AsyncSelectInput from './asyncSelect';

const CheckboxCT = (props) => {
  const {
    className, data, type, disabled, isCheck,
    placeholder, suffix, title,
    value, selectData, name, mode,
    checkboxClassName, supName, onChangeInput, supDisabled,
  } = props;

  const onChange = (e) => {
    props.onChange(name, e.target.checked);
  };

  return (
    <div className={classnames('checkbox-ct-wrapper', className)}>
      <InputTitle title={title} className="checkbox-ct-title" />

      <div className={classnames('checkbox-ct-main', checkboxClassName)}>
        <Checkbox
          name={name}
          checked={isCheck}
          disabled={disabled}
          onChange={onChange}
        >
          {data}
        </Checkbox>

        {suffix ? (
          <div className="checkbox-suffix">
            <span>{suffix}</span>
          </div>
        ) : null}
      </div>

      {type === 'DATE' && isCheck
        ? (
          <DatepickerCT
            disabled={supDisabled}
            name={supName}
            className="date-sub-component"
            placeholder={placeholder}
            onChange={onChangeInput}
          />
        ) : null}

      {type === 'TEXTAREA' && isCheck
        ? (
          <InputCT
            disabled={supDisabled}
            name={supName}
            type="TEXTAREA"
            className="date-sub-component"
            placeholder={placeholder}
            onChange={onChangeInput}
          />
        ) : null}

      {type === 'SELECT'
        ? (
          <SelectCT
            disabled={supDisabled}
            name={supName}
            mode={mode}
            suffixIcon={(<SearchOutlined />)}
            className="mt8"
            placeholder={placeholder}
            value={value}
            data={selectData}
            onChange={onChangeInput}
            isValueOutside
          />
        ) : null}

      {
        type === 'ASYNC_SELECT' && (
          <AsyncSelectInput
            disabled={supDisabled}
            name={supName}
            className="mt8"
            placeholder={props.placeholder}
            defaultValue={props.value}
            onChange={props.onChangeInput}
            isValueOutside={props.isValueOutside}
            isSearchable={props.isSearchable}
            loadOptions={props.loadOptions}
            options={props.options}
            maxLength={props.maxLength}
          />
        )
      }
    </div>
  );
};

CheckboxCT.defaultProps = {
  className: undefined,
  title: '',
  data: '',
  onChange: () => { },
  onChangeInput: () => { },
  isCheck: false,
  disabled: false,
  supDisabled: false,
  type: '',
  placeholder: '',
  suffix: '',
  value: [],
  selectData: [],
  name: '',
  supName: '',
  mode: undefined,
  checkboxClassName: undefined,
  isValueOutside: false,
  isSearchable: false,
  loadOptions: () => { },
  options: [],
  maxLength: 75,
};

CheckboxCT.propTypes = {
  /** ClassName of check box */
  className: PropTypes.string,
  /** Title of check box */
  title: PropTypes.string,
  /** Data / label of check box */
  data: PropTypes.string,
  /** On Change handler */
  onChange: PropTypes.func,
  /**  On Change input handler */
  onChangeInput: PropTypes.func,
  /** Whether the check box is check or uncheck */
  isCheck: PropTypes.bool,
  /** Whether the check box is disabled */
  disabled: PropTypes.bool,
  /** Whether the check box is supDisabled */
  supDisabled: PropTypes.bool,
  /** Type of check box */
  type: PropTypes.string,
  /** Placeholder of check box */
  placeholder: PropTypes.string,
  /** Suffix icon of check box */
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Value of check box */
  value: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ])),
  /** Select data of check box following type */
  selectData: PropTypes.arrayOf(PropTypes.string),
  /** Name of check box */
  name: PropTypes.string,
  /** Sub name of check box */
  supName: PropTypes.string,
  /** Mode of check box */
  mode: PropTypes.string,
  /** Check box class name */
  checkboxClassName: PropTypes.string,
  /** Whether the check box is Value Outside */
  isValueOutside: PropTypes.bool,
  /** Whether the check box is  Searchable */
  isSearchable: PropTypes.bool,
  /** Load options handler */
  loadOptions: PropTypes.func,
  /** Options of select following check box */
  options: PropTypes.arrayOf(PropTypes.shape()),
  /** Max length of input following check box */
  maxLength: PropTypes.number,
};

export default CheckboxCT;
