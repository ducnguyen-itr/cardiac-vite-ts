import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete';
import { UncontrolledPopover } from 'reactstrap';
import { COUNTRY_SHORT_DATA, GENERAL_INFOMATION_DATA } from '../../Constants/newPatientData';
import consoleLog from '../../Helpers/consoleLog';
import { normalizeString } from '../../Pages/Patients/CreateNewPatient/helper';
import InputTitle from './inputTitle';

const {
  CitySign1, CitySign2, StateSign, PostCodeSign,
} = GENERAL_INFOMATION_DATA.AddressSigns;

const SearchAutocomplete = (props) => {
  const {
    onChange,
    value, className, placeholder,
    types, maxLength, onBlur, disabled,
    country,
    keyValue, title, icon,
    onChangeAddress,
  } = props;

  const displayLocations = (loading, suggestions, getSuggestionItemProps, targetID) => (
    <UncontrolledPopover
      className={`dropdown-input-${keyValue}-popover`}
      trigger="legacy"
      placement="bottom-start"
      target={targetID}
    >
      <div className={classnames('suggestion-inner', suggestions.length > 0 ? 'have-suggestions' : '')}>
        {_.map(suggestions, suggestion => (
          <div
            className={classnames('suggestion-item', suggestion.active ? 'active-item' : '')}
            {...getSuggestionItemProps(suggestion, {})}
            key={suggestion.placeId}
          >
            <span>{suggestion.description}</span>
          </div>
        ))}
      </div>
    </UncontrolledPopover>
  );

  const getDataFromPlaceId = (placeId) => {
    geocodeByPlaceId(placeId)
      .then((results) => {
        let tempCity = '';
        let tempState = '';
        let tempStateCode = '';
        let tempZipCode = '';
        if (results.length !== 0) {
          _.forEach(results[0]?.address_components, (x) => {
            if (x?.types?.includes(CitySign1)) {
              tempCity = x.long_name;
            }
            if (x?.types?.includes(CitySign2)) {
              tempCity = x.long_name;
            }
            if (x?.types?.includes(StateSign)) {
              tempState = x.long_name;
              tempStateCode = x.short_name;
            }
            if (x?.types?.includes(PostCodeSign)) {
              tempZipCode = x.long_name;
            }
          });
        }
        onChangeAddress({
          city: normalizeString(tempCity),
          stateAddress: normalizeString(tempState),
          stateCode: normalizeString(tempStateCode),
          zip: tempZipCode,
        });
      })
      .catch(error => consoleLog(error));
  };

  const onError = (status, clearSuggestions) => {
    consoleLog('Google Maps API returned error with status: ', status);
    clearSuggestions();
  };

  return (
    <div className={classnames('w100', className)}>
      <InputTitle title={title} />

      <PlacesAutocomplete
        id={`input-${keyValue}-id`}
        searchOptions={{ componentRestrictions: { country }, types }}
        value={value}
        onChange={(location) => {
          onChange(keyValue, location.split(',')[0]);
        }}
        onSelect={(location, placeId) => {
          onChange(keyValue, location.split(',')[0]);
          getDataFromPlaceId(placeId);
        }}
        onError={onError}
        debounce={300}
        disabled={disabled}
      >
        {({
          getInputProps, suggestions, getSuggestionItemProps, loading,
        }) => (
          <div className="pos-re">
            <input
              {...getInputProps({
                placeholder,
                className: classnames('input-address-main', props.disabled ? 'disaled-input' : ''),
                disabled: props.disabled,
                maxLength,
                onBlur,
                id: `id-${keyValue}-popover`,
              })}
            />

            {displayLocations(loading, suggestions, getSuggestionItemProps, `id-${keyValue}-popover`)}

            {
              icon && (
              <div className="search-auto-icon">
                {icon}
              </div>
              )
            }
          </div>
        )}
      </PlacesAutocomplete>

    </div>
  );
};
SearchAutocomplete.defaultProps = {
  className: '',
  title: '',
  icon: undefined,
  value: '',
  placeholder: 'Enter your address',
  types: undefined,
  maxLength: 50,
  disabled: false,
  keyValue: 'address',
  country: COUNTRY_SHORT_DATA,
  onBlur: () => { },
  onChange: () => { },
  onChangeAddress: () => { },
  onSelect: () => { },
};
SearchAutocomplete.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  icon: PropTypes.shape(),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.string),
  maxLength: PropTypes.number,
  disabled: PropTypes.bool,
  keyValue: PropTypes.string,
  country: PropTypes.arrayOf(PropTypes.string),
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onChangeAddress: PropTypes.func,
  onSelect: PropTypes.func,
};

export default SearchAutocomplete;
