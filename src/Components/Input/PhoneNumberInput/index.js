import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import CountryFlag from '../../CountryFlag';
import CountrySelect from '../CountrySelect';
import InputTitle from '../inputTitle';
import './style.scss';

function PhoneNumberInput(props) {
  const countryData = useSelector(state => state.country);
  const onValueChange = (e) => {
    props.onChange(props.name, e.value);
  };

  const countryObjValue = useMemo(() => {
    if (props.isObjectCountry) {
      return props.countryValue;
    }
    const data = _.find(countryData, x => x?.alpha2 === props.countryValue);
    return data || {};
  }, [props.countryValue, props.isObjectCountry, countryData]);

  return (
    <div className={classnames('phone-number-input', props.className)}>
      {props.title && (
        <InputTitle title={props.title} isRequire={props.isRequire} />
      )}
      <div className="phone-number-input-container">
        {props.couldSelect ? (
          <div className={classnames('phone-number-input-container__select', props.errMes ? 'err-border' : '')}>
            <CountrySelect
              name={props.countryName}
              className="phone-number-input-1"
              onChange={props.onChange}
              isObject={props.isObjectCountry}
              value={props.countryValue}
              isShowFlag
              errMes={props.errMes}
            />
          </div>
        ) : (
          <div className={classnames('flag-phone-box', props.errMes ? 'err-border' : '')}>
            <CountryFlag className="mr4" countryCode={countryObjValue?.alpha2} />
            <p>{`${countryObjValue?.dial ? `+${countryObjValue?.dial}` : ''}`}</p>
          </div>
        )}

        <NumberFormat
          name={props.name}
          value={props.value}
          className={classnames('phone-number-input-container__input', props.focusClass, props.errMes ? 'err-border' : '')}
          disabled={props.disabled}
          onValueChange={onValueChange}
          placeholder={props.placeholder}
          maxLength={props.maxLength}
          decimalScale={props.decimalScale}
          prefix={props.prefix}
          suffix={props.suffix}
          allowNegative={props.allowNegative}
          onBlur={props.onBlur}
          id={props.inputId}
          isAllowed={props.isAllowed}
          defaultValue={props.defaultValue}
        />
      </div>
      {props.errMes && <div className="error-message ">{props.errMes}</div>}
    </div>
  );
}

PhoneNumberInput.defaultProps = {
  className: '',
  focusClass: '',
  title: '',
  name: '',
  countryName: 'country',
  placeholder: 'Enter phone number',
  value: '',
  countryValue: 'US',
  defaultValue: '',
  errMes: '',
  inputId: '',
  maxLength: 15,
  prefix: undefined,
  suffix: undefined,
  isObjectCountry: false,
  disabled: false,
  isRequire: false,
  couldSelect: false,
  isAllowed: () => true,
  allowNegative: false,
  decimalScale: undefined,
  onBlur: () => { },
  onChange: () => { },
};

PhoneNumberInput.propTypes = {
  /** Input class name */
  className: PropTypes.string,
  /** Input class name when focus */
  focusClass: PropTypes.string,
  /** Input title */
  title: PropTypes.string,
  /** Input phone number name */
  name: PropTypes.string,
  /** Input country name */
  countryName: PropTypes.string,
  /** Input placeholder */
  placeholder: PropTypes.string,
  /** Input id */
  inputId: PropTypes.string,
  /** Input value */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape(),
  ]),
  /** Input country value */
  countryValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape(),
  ]),
  /** Is object value */
  isObjectCountry: PropTypes.bool,
  /** Input default value */
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /** Input prefix */
  prefix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  /** Input suffix */
  suffix: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  /** Could select country */
  couldSelect: PropTypes.bool,
  /** Error message */
  errMes: PropTypes.string,
  /** Input max length */
  maxLength: PropTypes.number,
  /** Input is disabled option */
  disabled: PropTypes.bool,
  /** Input is require option */
  isRequire: PropTypes.bool,
  /** Input is allowed option */
  isAllowed: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  /** Input is allowed negative option */
  allowNegative: PropTypes.bool,
  /** Input decimal scale */
  decimalScale: PropTypes.number,
  /** On blur handler */
  onBlur: PropTypes.func,
  /** On change handler */
  onChange: PropTypes.func,
};

export default PhoneNumberInput;
