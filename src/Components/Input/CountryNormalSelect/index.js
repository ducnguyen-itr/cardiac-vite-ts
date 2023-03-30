import { Select } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { trimLowerCase } from '../../../Pages/PatientDetails/TimeTrackingSuperbill/helper';
import CountryFlag from '../../CountryFlag';
import InputTitle from '../inputTitle';
import './style.scss';

const { Option } = Select;

function CountryNormalSelect(props) {
  const countryData = useSelector(state => state.country);

  const onChange = (name, value) => {
    props.onChange(props.name, value.option);
  };

  const filterOption = ({ input, option }) => {
    const item = option?.option || {};
    const key = trimLowerCase(item.alpha2);
    const key2 = trimLowerCase(item.alpha3);
    const name = trimLowerCase(item.name);
    const value = trimLowerCase(input);
    return name?.includes(value) || key === value || key2 === value;
  };

  const options = _.map(countryData, (x, i) => (
    <Option
      label={x.label}
      value={x.label}
      option={x}
      className="country-normal-select-menu-item"
      key={`country-normal-select-${i}`}
    >
      <div className="country-normal-select-flag-content">
        <CountryFlag className="mr4" countryCode={x?.alpha2} />
        <div className="country-normal-select-country-name">{x.name}</div>
      </div>
      <div>{`+${x.dial}`}</div>
    </Option>
  ));

  return (
    <div className={classnames('country-select-wrapper', props.className)}>
      {props.title && (
        <InputTitle title={props.title} isRequire={props.isRequire} />
      )}
      <Select
        showSearch
        placeholder={props.placeholder}
        getPopupContainer={node => node.parentNode}
        onChange={onChange}
        value={props.value}
        filterOption={(input, option) => filterOption({ input, option })}
      >
        {options}
      </Select>
    </div>
  );
}

CountryNormalSelect.defaultProps = {
  className: '',
  name: '',
  value: '',
  placeholder: '',
  title: '',
  isRequire: false,
  onChange: () => { },
};

CountryNormalSelect.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Name of component */
  name: PropTypes.string,
  /** Value of component */
  value: PropTypes.string,
  /** placeholder of component */
  placeholder: PropTypes.string,
  /** Title of component */
  title: PropTypes.string,
  /** Whether show require symbol */
  isRequire: PropTypes.bool,
  /** Change value event */
  onChange: PropTypes.func,
};

export default CountryNormalSelect;
