import {
  Checkbox,
  DatePicker, Input, InputNumber, TimePicker,
} from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import AutoCompleteInput from '../AutoCompleteInput';
import InputTitle from '../inputTitle';
import './style.scss';

const NormalInput = (props) => {
  const onChangeNormal = (e) => {
    if (props.type === 'search-address') {
      props.onChange(props.name, e);
      return;
    }
    if (props.isNumeric) {
      const { value } = e.target;
      // check value is numeric
      const reg = /^\d+$/;
      if ((!_.isNaN(value) && reg.test(value)) || value === '') {
        props.onChange(props.name, e.target.value);
        return;
      }
      return;
    }
    if (props.type === 'time') {
      props.onChange(props.name, e);
      return;
    }

    if (props.type !== 'number') {
      props.onChange(props.name, e.target.value);
    } else {
      props.onChange(props.name, e);
    }
  };
  const onChangeDate = (date, dateString) => {
    props.onChange(props.name, dateString);
  };
  const handleOnChange = (e, onChange) => {
    if (props.isNumeric) {
      const { value } = e.target;
      // check value is numeric
      const reg = /^\d+$/;
      if ((!_.isNaN(value) && reg.test(value)) || value === '') {
        onChange(e);
        return;
      }
      return;
    }
    if (props.type === 'phone-number') {
      onChange(e.value);
      return;
    }
    if (props.isFloatNumber) {
      const { value } = e.target;
      // check value is numeric
      const reg = /^\d*\.?\d*$/;
      if ((!_.isNaN(value) && reg.test(value)) || value === '') {
        onChange(value ? value.match(reg)[0] : '');
        return;
      }
      return;
    }
    onChange(e);
  };

  const onOk = () => {
    props.onOk();
  };

  const onChangeAddress = (address) => {
    props.onChangeAddress(address);
  };

  const renderInputType = (onChange, onBlur, value, ref) => {
    switch (props.type) {
      case 'textarea':
        return (
          <Input.TextArea
            ref={ref}
            name={props.name}
            value={value}
            disabled={props.disabled}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            maxLength={props.maxLength}
            showCount={props.showCount}
            prefix={props.prefix}
            suffix={props.suffix}
            onChange={onChange}
            onBlur={props.onBlur || onBlur}
            rows={props.rows}
            autoSize={props.autoSize}
          />
        );
      case 'password':
        return (
          <Input.Password
            ref={ref}
            name={props.name}
            value={value}
            disabled={props.disabled}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            maxLength={props.maxLength}
            showCount={props.showCount}
            prefix={props.prefix}
            suffix={props.suffix}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
      case 'number':
        return (
          <InputNumber
            ref={ref}
            name={props.name}
            value={value}
            width="100%"
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            min={props.min}
            max={props.max}
            step={props.step}
            prefix={props.prefix}
            suffix={props.suffix}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
      case 'date':
        return (
          <DatePicker
            ref={ref}
            inputRef
            name={props.name}
            value={value}
            disabled={props.disabled}
            disabledDate={props.disabledDate}
            placeholder={props.placeholder}
            format="MM/DD/YYYY"
            getPopupContainer={trigger => trigger.parentElement}
            onChange={onChange}
            onBlur={onBlur}
            allowClear={props.allowClear}
          />
        );
      case 'time':
        return (
          <TimePicker
            // ref={componentRef}
            disabled={props.disabled}
            getPopupContainer={trigger => trigger.parentElement}
            placeholder={props.placeholder}
            onChange={onChange}
            format={props.format}
            value={typeof (value) === 'string' && moment(value).isValid() ? moment(value) : value || undefined}
            disabledDate={props.disabledDate}
            minuteStep={props.minuteStep}
            showNow={false}
            onSelect={onChange}
            // bordered={props.bordered}
            allowClear={props.allowClear}
            use12Hours={props.use12Hours}
            onOk={onOk}
            inputReadOnly={props.inputReadOnly}
          />
        );
      case 'phone-number':
        return (
          <NumberFormat
            className="phone-number-input"
            name={props.name}
            mask={props.mask}
            format={props.format}
            value={value}
            disabled={props.disabled}
            onValueChange={onChange}
            placeholder={props.placeholder}
            maxLength={props.maxLength}
            isNumericString
            prefix={props.prefix}
            suffix={props.suffix}
            allowNegative={false}
          />
        );
      case 'search-address':
        return (
          <AutoCompleteInput
            ref={ref}
            name={props.name}
            country={props.country}
            value={value}
            disable={props.disabled}
            placeholder={props.placeholder}
            onChange={onChange}
            onChangeInput={onChange}
            onBlur={onBlur}
            onChangeAddress={onChangeAddress}
          />
        );
      case 'float-number':
        return (
          <NumberFormat
            ref={ref}
            name={props.name}
            value={value}
            onValueChange={onChange}
            placeholder={props.placeholder}
            prefix={props.prefix}
            suffix={props.suffix}
            allowNegative={false}
          />
        );
      case 'checkbox':
        return (
          <Checkbox
            ref={ref}
            name={props.name}
            value={value}
            checked={value}
            onChange={onChange}
          >
            {props.label}
          </Checkbox>
        );
      default:
        return (
          <Input
            ref={ref}
            name={props.name}
            value={value}
            disabled={props.disabled}
            placeholder={props.placeholder}
            defaultValue={props.defaultValue}
            maxLength={props.maxLength}
            showCount={props.showCount}
            prefix={props.prefix}
            suffix={props.suffix}
            onChange={onChange}
            onBlur={props.onBlur || onBlur}
            allowClear={props.allowClear}
          />
        );
    }
  };
  const renderErrorMessage = () => (
    <div className="error-message">
      <p>{props.errMsg}</p>
    </div>
  );
  return (
    <div className={classNames('input-wrapper', props.className, props.errMsg ? 'is-error' : '')}>
      {props.title && (
        <InputTitle
          title={props.title}
          isRequired={props.isRequired}
          isChangePassword={props.isChangePassword}
          onForgetPasswordClick={props.onForgetPasswordClick}
          isRequire={props.isRequire}
        />
      )}
      {props.isUseForm ? (
        <Controller
          control={props.control}
          name={props.name}
          render={({
            field: {
              onChange, onBlur, value, ref,
            },
          }) => (
            <>
              {renderInputType((e) => {
                handleOnChange(e, onChange);
              }, onBlur, value, ref)}
            </>
          )}
        />
      ) : (
        <>
          {renderInputType(props.type === 'date' ? onChangeDate : onChangeNormal, () => { }, props.value, undefined)}
        </>
      )}
      {props.errMsg && renderErrorMessage()}
    </div>
  );
};
NormalInput.defaultProps = {
  className: '',
  isRequired: false,
  isUseForm: false,
  isChangePassword: false,
  title: '',
  type: '',
  placeholder: '',
  defaultValue: '',
  disabled: false,
  maxLength: 100,
  showCount: false,
  prefix: undefined,
  suffix: undefined,
  value: '',
  country: 'US',
  name: '',
  min: 0,
  max: 1000,
  step: 1,
  errMsg: '',
  isNumeric: false,
  isFloatNumber: false,
  disabledDate: undefined,
  control: undefined,
  mask: '',
  format: '',
  onChange: () => { },
  onBlur: () => { },
  onForgetPasswordClick: () => { },
  onChangeAddress: () => { },
  allowClear: false,
  use12Hours: false,
  minuteStep: undefined,
  onOk: () => { },
  isRequire: false,
  rows: 3,
  label: '',
  inputReadOnly: false,
  autoSize: false,
};
NormalInput.propTypes = {
  className: PropTypes.string,
  isRequired: PropTypes.bool,
  isUseForm: PropTypes.bool,
  isChangePassword: PropTypes.bool,
  title: PropTypes.string,
  type: PropTypes.oneOf(['text', 'textarea', 'password', 'number', 'date', 'time', 'search-address', '']),
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  maxLength: PropTypes.number,
  country: PropTypes.string,
  showCount: PropTypes.bool,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  isNumeric: PropTypes.bool,
  isFloatNumber: PropTypes.bool,
  errMsg: PropTypes.string,
  mask: PropTypes.string,
  format: PropTypes.string,
  control: PropTypes.shape(),
  disabledDate: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onForgetPasswordClick: PropTypes.func,
  onChangeAddress: PropTypes.func,
  allowClear: PropTypes.bool,
  use12Hours: PropTypes.bool,
  minuteStep: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onOk: PropTypes.func,
  isRequire: PropTypes.bool,
  rows: PropTypes.number,
  label: PropTypes.string,
  inputReadOnly: PropTypes.bool,
  autoSize: PropTypes.bool,
};
export default NormalInput;
