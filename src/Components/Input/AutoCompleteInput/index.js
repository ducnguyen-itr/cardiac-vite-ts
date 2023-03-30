/* eslint-disable camelcase */
import React, {
  useRef, useImperativeHandle, useEffect, forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import usePlacesAutocomplete, { getDetails } from 'use-places-autocomplete';
import classnames from 'classnames';
import _ from 'lodash';

import './style.scss';
import { useMergeState } from '../../../Helpers/customHooks';

const CustomInput = (selectProps) => {
  const newProps = _.cloneDeep(selectProps);
  _.assign(newProps, { isHidden: false });
  return (<components.Input {...newProps} />);
};

const getDataGoogle = (addressComponents) => {
  const object = {};
  _.forEach(addressComponents, (element) => {
    if (typeof element.types !== 'undefined') {
      if (element.types[0] === 'postal_code') {
        _.assign(object, { zip: element.short_name });
      }
      if (element.types[0] === 'administrative_area_level_1') {
        const state = {
          name: element.long_name,
          code: element.short_name,
        };
        _.assign(object, { state });
      }
      if (element.types[0] === 'country') {
        const country = {
          name: element.long_name,
          code: element.short_name,
        };
        _.assign(object, { country });
      }
      if (element.types[0] === 'locality') {
        _.assign(object, { city: element.long_name });
      } else if (element.types.includes('sublocality') || element.types.includes('sublocality_level_1')) {
        _.assign(object, { city: element.long_name });
      }
    }
  });
  return object;
};

const AutoCompleteInput = forwardRef((props, ref) => {
  const countryRef = useRef(undefined);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: 'unset',
      height: '2rem',
      // boxShadow: state.isFocused ? '0px 0px 4px 1px #397ACC' : 'none',
      borderRadius: '2px',
      padding: '0 0 0 10px',
      backgroundColor: state.isDisabled ? '#E7E9EC' : 'white',
      '&:hover': {
        border: props.isError
          ? '1px solid #40a9ff'
          : '1px solid #40a9ff',
      },
      border: props.isError
        ? '1px solid #D42323' : state.isFocused ? '1px solid #40a9ff'
          : '1px solid #d9d9d9',
      boxShadow: props.isError
        ? 'unset' : state.isFocused ? '0px 0px 4px 1px rgba(0, 136, 143, 0.25)'
          : 'unset',
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided, state) => ({
      ...provided,
      borderRadius: '2px',
      borderBottom: 'none',
      padding: '0',
      boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      backgroundColor: '#0D9E92',
      color: 'white',
      padding: '0 0.5rem',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      color: 'white',
      padding: 0,
      paddingLeft: 0,
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      padding: 0,
      marginLeft: '0.75rem',

      '&:hover': {
        backgroundColor: '#0D9E92',
        color: 'white',
        cursor: 'pointer',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: 'white',
      color: state.isSelected ? '#49494F' : '#49494F',
      fontWeight: state.isSelected ? 'bold' : 'normal',
      fontSize: '0.875rem',
      height: '32px',
      border: 'none',
      borderRadius: '0px',
      padding: '5px 12px',
      '&:hover': {
        backgroundColor: '#f7f9f9',
        cursor: 'pointer',
      },
      '&:not(:first-of-type)': {
        borderTop: '1px solid #F5F7FA',
      },
    }),
    placeholder: (provided, state) => ({
      ...provided,
      color: '#9F9FA7',
      // fontStyle: 'italic',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: '#1D2F47',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      maxHeight: 'calc(8.25rem - 2 * 0.75rem)',
      overflowY: 'auto',
      padding: 0,
    }),
    clearIndicator: (provided, state) => ({
      ...provided,
      padding: 0,
      width: '15px',
    }),
  };
  const refCurrent = useRef({});
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: props.country ? props.country : ['CA', 'US'],
      },
      types: props.isSearchCity ? ['(cities)'] : [],
    },
    cache: false,
  });

  const [state, setState] = useMergeState({
    addressArray: [],
    address: '',
  });

  const resetData = () => {
    setState({ addressArray: [], address: '' });
  };

  useImperativeHandle(ref, () => ({
    resetData() {
      setState({ addressArray: [], address: '' });
    },
  }));

  const onInputChange = (inputValue, { action }) => {
    if (action === 'input-change') {
      if (props.onChangeInput) {
        props.onChangeInput(inputValue, props.isSearchCity);
      }
      setValue(inputValue);
      setState({ address: inputValue });
    }
  };

  const onChange = (addressSelect) => {
    if (addressSelect) {
      const eleData = _.find(refCurrent.current.dataAddress, x => x.value === addressSelect.value);
      if (eleData) {
        const { placeId } = eleData;
        if (placeId) {
          const parameter = {
            placeId,
          };
          getDetails(parameter).then((result) => {
            if (result) {
              const { address_components: addressComponents = {}, utc_offset_minutes = 0 } = result;
              const object = getDataGoogle(addressComponents);
              _.assign(object, { utcOffset: utc_offset_minutes || 0 });
              if (!props.isSearchCity) {
                _.assign(object, { address: eleData.address });
              }
              if (props.onChange) {
                props.onChange(props?.name, object, props.isSearchCity);
                props.onChangeAddress(object);
              }
            }
          }).catch((err) => {
            console.error('Failed to get geocode', err);
          });
        }
        setState({ address: eleData.address });
      }
    } else {
      resetData();
      if (props.eventClear) {
        props.eventClear(props.isSearchCity);
      }
    }
  };

  useEffect(() => {
    if (props.value !== undefined) {
      setState({ address: props.value });
    }
  }, [props.value]);

  useEffect(() => {
    if (props.country !== countryRef.current) {
      setState({ addressArray: [] });
      countryRef.current = props.country;
    }
  }, [props.country]);

  useEffect(() => {
    const newArray = [];
    const newArrayData = [];
    _.forEach(data, (x, index) => {
      const {
        structured_formatting: { main_text: mainText, secondary_text: secondaryText },
        place_id: placeId,
      } = x;
      newArray.push({
        value: index,
        label: `${mainText} ${secondaryText || ''}`,
      });
      newArrayData.push({
        value: index,
        label: `${mainText} ${secondaryText || ''}`,
        placeId,
        address: mainText,
      });
    });
    refCurrent.current = { dataAddress: newArrayData };
    setState({ addressArray: newArray });
  }, [data]);
  return (
    <div className={classnames('custom-select-input', props.className)}>
      {
        !!props.title && (
          <div className="custom-select-input__label">{props.title}</div>
        )
      }

      <Select
        inputId={props.id}
        onKeyDown={props.onKeyPress}
        isClearable
        isDisabled={props.disabled}
        styles={customStyles}
        name={props.name}
        placeholder={props.placeholder}
        options={state.addressArray}
        filterOption={() => true}
        inputValue={state.address}
        value=""
        onInputChange={onInputChange}
        onChange={onChange}
        components={{
          Input: CustomInput,
          DropdownIndicator: () => null,
        }}
      />

      {
        props.isError && !!props.errorMessage
          ? (
            <div className="custom-select-input__error-message">{props.errorMessage}</div>
          )
          : null
      }
    </div>
  );
});

AutoCompleteInput.defaultProps = {
  id: '',
  isSearchCity: false,
  disabled: false,
  className: '',
  country: ['CA', 'US'],
  title: '',
  placeholder: '',
  isError: false,
  errorMessage: '',
  value: '',
  onKeyPress: () => { },
  onChangeAddress: () => { },
};

AutoCompleteInput.propTypes = {
  isSearchCity: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  country: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  title: PropTypes.string,
  placeholder: PropTypes.string,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  value: PropTypes.string,
  onChangeInput: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  eventClear: PropTypes.func.isRequired,
  id: PropTypes.string,
  onKeyPress: PropTypes.func,
  onChangeAddress: PropTypes.func,
};

export default AutoCompleteInput;
