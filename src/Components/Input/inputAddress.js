import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import PairInput from './pairInput';
import SearchAutocomplete from './searchAutocomplete';
import { COUNTRY_SHORT_DATA } from '../../Constants/newPatientData';

const InputAddress = (props) => {
  const {
    onChange,
    address, className,
    city, stateAddress,
    zip, stateData,
    country,
    disabled,
    onChangeAddress,
  } = props;

  const searchAutoProps = {
    country, onChange, onChangeAddress,
  };

  return (
    <div className={classnames('input-address-wrapper', className)}>

      <SearchAutocomplete
        disabled={disabled}
        title="Address"
        keyValue="address"
        value={address}
        {...searchAutoProps}
      />

      <SearchAutocomplete
        title="City"
        keyValue="city"
        value={city}
        types={['(cities)']}
        className="mt16"
        placeholder="Select city"
        {...searchAutoProps}
        disabled={disabled}
      />

      <PairInput
        disabledLeft={disabled}
        disabledRight={disabled}
        nameLeft="stateAddress"
        nameRight="zip"
        className="mt16"
        valueLeft={stateAddress}
        valueRight={zip}
        titleLeft="State"
        titleRight="Zip code"
        placeholderLeft="Select state"
        placeholderRight="Enter zip code"
        onChangeLeft={onChange}
        onChangeRight={onChange}
        typeLeft={_.isEqual(country, ['US']) || _.isEqual(country, ['CA']) ? 'SELECT' : undefined}
        dataLeft={stateData}
        rightErrMes={props.zipErr}
      />

    </div>
  );
};
InputAddress.defaultProps = {
  className: '',
  title: '',
  name: '',
  onChange: () => {},
  onChangeAddress: () => {},
  onSelect: () => {},
  address: '',
  inputClassName: '',
  placeholder: 'Enter your address',
  type: 'text',
  maxLength: 50,
  onBlur: () => { },
  disabled: false,
  city: undefined,
  stateAddress: undefined,
  zip: '',
  cityData: [],
  stateData: [],
  country: COUNTRY_SHORT_DATA,
  zipErr: '',
};
InputAddress.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onChangeAddress: PropTypes.func,
  onSelect: PropTypes.func,
  address: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  inputClassName: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  maxLength: PropTypes.number,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  city: PropTypes.string,
  stateAddress: PropTypes.string,
  zip: PropTypes.string,
  cityData: PropTypes.arrayOf(PropTypes.string),
  stateData: PropTypes.arrayOf(PropTypes.string),
  country: PropTypes.arrayOf(PropTypes.string),
  zipErr: PropTypes.string,
};

export default InputAddress;
