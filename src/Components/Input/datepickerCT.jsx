import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { DatePicker, TimePicker } from 'antd'
import classnames from 'classnames'
import moment from 'moment'

import InputTitle from './inputTitle'

const DatepickerCT = (props) => {
  const {
    className,
    title,
    placeholder,
    format,
    value,
    name,
    suffixIcon,
    type,
    disabledDate,
    disabled,
    availableDate,
    picker,
    allowClear,
    minuteStep,
    bordered,
    onFocus,
    onBlur,
    isOpen,
    inputReadOnly,
    titleClass
  } = props

  const onChange = (date) => {
    props.onChange(name, date)
  }

  let disabledDateCT
  switch (disabledDate) {
    case 'PAST': {
      disabledDateCT = (current) => current > moment().endOf('day')
      break
    }
    case 'FUTURE': {
      disabledDateCT = (current) => current <= moment().endOf('day')
      break
    }
    case 'TODAY_FUTURE': {
      disabledDateCT = (current) => current < moment().startOf('day')
      break
    }
    case 'CUSTOM': {
      disabledDateCT = (current) => availableDate(current)
      break
    }
    default: {
      break
    }
  }

  return (
    <div className={classnames('datepicker-ct-wrapper', className)}>
      <InputTitle title={title} className={titleClass} />

      {type === 'TIME' ? (
        <TimePicker
          // ref={componentRef}
          disabled={disabled}
          getPopupContainer={(trigger) => trigger.parentElement}
          suffixIcon={suffixIcon}
          placeholder={placeholder}
          onChange={onChange}
          format={format}
          value={typeof value === 'string' && moment(value).isValid() ? moment(value) : value || undefined}
          disabledDate={disabledDateCT}
          minuteStep={minuteStep}
          showNow={false}
          onSelect={onChange}
          bordered={bordered}
          allowClear={allowClear}
          use12Hours={props.use12Hours}
        />
      ) : (
        <DatePicker
          open={isOpen}
          allowClear={allowClear}
          disabled={disabled}
          getPopupContainer={(trigger) => trigger.parentElement}
          suffixIcon={suffixIcon}
          placeholder={placeholder}
          onChange={onChange}
          format={format}
          value={typeof value === 'string' && moment(value).isValid() ? moment(value) : value || undefined}
          disabledDate={disabledDateCT}
          picker={picker}
          // showToday={false}
          bordered={bordered}
          onFocus={onFocus}
          onBlur={onBlur}
          inputReadOnly={inputReadOnly}
        />
      )}
    </div>
  )
}

DatepickerCT.defaultProps = {
  className: undefined,
  format: 'MM/DD/YYYY',
  title: '',
  placeholder: 'Select date',
  onChange: () => {},
  value: undefined,
  name: '',
  disabledDate: undefined,
  suffixIcon: undefined,
  type: 'DATE',
  disabled: false,
  availableDate: () => {},
  picker: undefined,
  allowClear: true,
  minuteStep: undefined,
  isOpen: undefined,
  bordered: undefined,
  onFocus: () => {},
  onBlur: () => {},
  inputReadOnly: false,
  titleClass: '',
  use12Hours: false
}

DatepickerCT.propTypes = {
  /** Classname of date picker */
  className: PropTypes.string,
  /** Format of date picker */
  format: PropTypes.string,
  /** Title of date picker */
  title: PropTypes.string,
  /** Placeholder of date picker */
  placeholder: PropTypes.string,
  /** On change handler */
  onChange: PropTypes.func,
  /** Value of date picker */
  value: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
  /** Name of date picker */
  name: PropTypes.string,
  /** Date disabled */
  disabledDate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.func]),
  /** Sunffix icon of date picker */
  suffixIcon: PropTypes.shape(),
  /** Type of date picker */
  type: PropTypes.string,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** Date avilable to pick */
  availableDate: PropTypes.func,
  /** picker picker pickerchu */
  picker: PropTypes.string,
  /** Whether the input is allowClear */
  allowClear: PropTypes.bool,
  /** Minute step when input show time */
  minuteStep: PropTypes.number,
  /** Whether the input is Open */
  isOpen: PropTypes.bool,
  /** Whether the input is bordered */
  bordered: PropTypes.bool,
  /** On focus handler */
  onFocus: PropTypes.func,
  /** On blur handler */
  onBlur: PropTypes.func,
  /** Whether the input is inputReadOnly */
  inputReadOnly: PropTypes.bool,
  /** Class name of tilter */
  titleClass: PropTypes.string,
  /** Whether the input is use12Hours */
  use12Hours: PropTypes.bool
}

export default DatepickerCT
