import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import NumberFormat from 'react-number-format'
import classnames from 'classnames'

import _ from 'lodash'
import InputTitle from './inputTitle'
import SelectCT from './selectCT'
import DatepickerCT from './datepickerCT'
import AsyncSelectInput from './asyncSelect'

const InputCT = (props) => {
  const {
    className,
    type,
    rows,
    placeholder,
    title,
    disabled,
    value,
    inputClassName,
    maxLength,
    prefix,
    mask,
    format,
    decimalScale,
    name,
    allowedDecimalSeparators,
    allowLeadingZeros,
    thousandSeparator,
    data,
    mode,
    unitValue,
    onChangeUnit,
    disabledDate,
    suffix,
    autoComplete,
    supName,
    errMes,
    errMesClassName,
    absSuffix,
    allowNegative,
    isValueOutside,
    isSearchable,
    loadOptions,
    options,
    clearOptions,
    onInputChange, // for Async
    onBlur,
    showCount,
    maxLengthInput,
    isError,
    onFocus
  } = props

  const onChange = (e) => {
    if (props.isInteger) {
      const value = parseFloat(e.target.value)
      const reg = /^([0-9:]+)$/
      if (reg.test(value) || value === '') {
        props.onChange(name, e.target.value)
      }
      return
    }
    if (props.isNumeric) {
      const { value } = e.target
      // check value is numeric
      const reg = /^\d+$/
      if ((!_.isNaN(value) && reg.test(value)) || value === '') {
        props.onChange(props.name, e.target.value)
        return
      }
      return
    }
    if (props.isFloatNumber) {
      const { value } = e.target
      // check value is numeric
      const reg = /^\d*\.?\d*$/
      if ((!_.isNaN(value) && reg.test(value)) || value === '') {
        props.onChange(props.name, value ? value.match(reg)[0] : '')
        return
      }
      return
    }
    if (props.is1FloatNumber) {
      const regex = /^\d*\.?\d*$/
      const { value } = e.target || {}
      if (value?.includes('.') && regex.test(value)) {
        const arr = value.split('.')
        if (arr?.[1]?.length > 0) {
          const newValue = [arr[0], arr?.[1]?.slice(0, 1)].join('.')
          const customValue = parseFloat(newValue)
          props.onChange(name, customValue)
          return
        }
        props.onChange(name, value)
        return
      }
      if (regex.test(value)) {
        props.onChange(name, value)
        return
      }
      return
    }
    props.onChange(name, e.target.value)
  }

  const onValueChange = ({ value }) => {
    props.onChange(name, value)
  }
  return (
    <div className={classnames('input-ct-wrapper', className)}>
      <InputTitle title={title} isRequire={props.isRequire} />

      {type === 'TEXTAREA' ? (
        <Input.TextArea
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          onChange={onChange}
          maxLength={maxLength}
        />
      ) : null}

      {type === 'NUMBER' ? (
        <NumberFormat
          name={props.name}
          mask={mask}
          format={format}
          value={value}
          className={classnames('basic-number-format', inputClassName, errMes ? 'err-border' : '')}
          disabled={disabled}
          onValueChange={onValueChange}
          placeholder={placeholder}
          maxLength={maxLength}
          decimalScale={decimalScale}
          prefix={prefix}
          suffix={suffix}
          allowNegative={allowNegative}
          onBlur={onBlur}
          id={props.inputId}
          isAllowed={props.isAllowed}
          defaultValue={props.defaultValue}
          // allowedDecimalSeparators={allowedDecimalSeparators}
          // allowNegative={false}
          // allowLeadingZeros={allowLeadingZeros}
          // thousandSeparator={thousandSeparator}
          // inputMode="numeric"
          // prefix={prefix}
        />
      ) : null}

      {type === 'SELECT' ? (
        <SelectCT
          name={name}
          mode={mode}
          placeholder={placeholder}
          data={data}
          value={value}
          onChange={props.onChange}
          showSearch={false}
          defaultValue={value}
          disabled={disabled}
        />
      ) : null}

      {type === 'ASYNC_SELECT' && (
        <AsyncSelectInput
          placeholder={placeholder}
          defaultValue={value}
          value={value}
          disabled={disabled}
          name={name}
          onChange={props.onChange}
          isValueOutside={isValueOutside}
          isSearchable={isSearchable}
          loadOptions={loadOptions}
          options={options}
          clearOptions={clearOptions}
          onInputChange={onInputChange}
        />
      )}

      {type === 'DATE' ? (
        <DatepickerCT
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={props.onChange}
          disabledDate={disabledDate}
          suffixIcon={suffix}
          disabled={disabled}
        />
      ) : null}
      {/*  errMes ? 'color-red-5' : '', */}
      {type === 'FREQUENCY' ? (
        <div className='frequency-input'>
          <div className='input-left'>
            <NumberFormat
              mask={mask}
              format={format}
              value={value}
              className={classnames('basic-number-format', inputClassName)}
              disabled={disabled}
              onValueChange={onValueChange}
              placeholder={placeholder}
              maxLength={maxLength}
              decimalScale={0}
              allowNegative={false}
            />
          </div>
          <div className='input-right'>
            <SelectCT
              name={supName}
              mode={mode}
              // placeholder={placeholder}
              data={data}
              value={unitValue}
              onChange={onChangeUnit}
            />
          </div>
        </div>
      ) : null}

      {type === 'text' ? (
        <Input
          className={errMes || isError ? 'err-border' : ''}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          prefix={prefix}
          suffix={suffix}
          onBlur={onBlur}
          onFocus={onFocus}
          showCount={showCount}
          maxLength={maxLengthInput}
          id={props.inputId}
          defaultValue={props.defaultValue}
          allowClear={props.allowClear}
        />
      ) : null}

      {type === 'PASSWORD' ? (
        <Input.Password
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          autoComplete={autoComplete}
        />
      ) : null}

      {errMes ? (
        <div className={classnames('div-incorrect-mes', errMesClassName)}>
          <span>{errMes}</span>
        </div>
      ) : null}

      {absSuffix && (
        <div className='abs-suffix-ct'>
          <span>{absSuffix}</span>
        </div>
      )}
    </div>
  )
}

InputCT.defaultProps = {
  className: undefined,
  rows: 4,
  type: 'text',
  title: '',
  placeholder: 'Enter...',
  onChange: () => {},
  onChangeUnit: () => {},
  disabled: false,
  value: undefined,
  defaultValue: undefined,
  inputClassName: '',
  maxLength: 200,
  allowedDecimalSeparators: undefined,
  decimalScale: undefined,
  allowLeadingZeros: false,
  thousandSeparator: false,
  prefix: undefined,
  suffix: undefined,
  mask: undefined,
  format: undefined,
  name: '',
  supName: '',
  data: [],
  mode: undefined, // 'tags', // or multiple
  unitValue: '',
  disabledDate: undefined,
  autoComplete: '',
  errMes: '',
  errMesClassName: '',
  absSuffix: '',
  allowNegative: false,
  isValueOutside: false,
  isNumeric: false,
  isFloatNumber: false,
  isSearchable: false,
  loadOptions: () => {},
  options: [],
  clearOptions: () => {},
  onInputChange: () => {},
  isAllowed: () => true,
  onBlur: undefined,
  showCount: false,
  maxLengthInput: undefined,
  inputId: '',
  isInteger: false,
  is1FloatNumber: false,
  isRequire: false,
  isError: false,
  onFocus: () => {},
  allowClear: false
}

InputCT.propTypes = {
  /** Classname of input */
  className: PropTypes.string,
  /** Number of row when type is TEXTAREA */
  rows: PropTypes.number,
  /** Type of input */
  type: PropTypes.string,
  /** title  of input */
  title: PropTypes.string,
  /** placeholder  of input */
  placeholder: PropTypes.string,
  /** On change handler */
  onChange: PropTypes.func,
  /** On change unit handler */
  onChangeUnit: PropTypes.func,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** Value of input */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
    PropTypes.shape()
  ]),
  /** Default Value of input */
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.number,
    PropTypes.shape()
  ]),
  /** Class name of input tag */
  inputClassName: PropTypes.string,
  /** Max lenght of input */
  maxLength: PropTypes.number,
  /** Whether the input is allowedDecimalSeparators */
  allowedDecimalSeparators: PropTypes.bool,
  /** The decimalScale for the Input */
  decimalScale: PropTypes.number,
  /** Whether the input is allowLeadingZeros */
  allowLeadingZeros: PropTypes.bool,
  /** Whether the input is thousandSeparator */
  thousandSeparator: PropTypes.bool,
  /** Whether the input is Numeric */
  isNumeric: PropTypes.bool,
  /** Whether the input is FloatNumber */
  isFloatNumber: PropTypes.bool,
  /** The prefix icon for the Input */
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  /** The suffix icon for the Input */
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  /** Mask of number type input */
  mask: PropTypes.string,
  /** Format of number type input */
  format: PropTypes.string,
  /** Name of input */
  name: PropTypes.string,
  /** Sub name of input */
  supName: PropTypes.string,
  /** Options of select type */
  data: PropTypes.arrayOf(PropTypes.string),
  /** Mode of input */
  mode: PropTypes.string,
  /** Unit value if has */
  unitValue: PropTypes.string,
  /** Diabled date when input type is DATE */
  disabledDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.func]),
  /** Auto complete when type is PASSWORD */
  autoComplete: PropTypes.string,
  /** Error message of input */
  errMes: PropTypes.string,
  /** Error message classname */
  errMesClassName: PropTypes.string,
  /** absSuffix of input */
  absSuffix: PropTypes.string,
  /**  Whether the input is allowNegative */
  allowNegative: PropTypes.bool,
  /**  Whether the input is ValueOutside */
  isValueOutside: PropTypes.bool,
  /**  Whether the input is Searchable */
  isSearchable: PropTypes.bool,
  /**  Whether the input is Require */
  isRequire: PropTypes.bool,
  /** Load options function handler */
  loadOptions: PropTypes.func,
  /** Options of input when select type */
  options: PropTypes.arrayOf(PropTypes.shape()),
  /** Clear options handler */
  clearOptions: PropTypes.func,
  /** On input change handler */
  onInputChange: PropTypes.func,
  /** On blur handler */
  onBlur: PropTypes.func,
  /** Whether the input is showCount */
  showCount: PropTypes.bool,
  /** Max lenght of input */
  maxLengthInput: PropTypes.number,
  /** Id of input */
  inputId: PropTypes.string,
  /** Whether the input is Allowed */
  isAllowed: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  /** Whether the input is Integer */
  isInteger: PropTypes.bool,
  /** Whether the input is 1 FloatNumber */
  is1FloatNumber: PropTypes.bool,
  /** Whether the input is error */
  isError: PropTypes.bool,
  /** Whether the input is allowClear */
  allowClear: PropTypes.bool,
  /** On focus handler */
  onFocus: PropTypes.func
}

export default InputCT
