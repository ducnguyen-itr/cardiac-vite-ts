import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMergeState } from '../../../Helpers/customHooks';
import { trimLowerCase } from '../../../Pages/PatientDetails/TimeTrackingSuperbill/helper';
import CountryFlag from '../../CountryFlag';
import InputCT from '../inputCT';
import InputTitle from '../inputTitle';
import './style.scss';

function CountrySelect(props) {
  const countryData = useSelector(state => state.country);
  const [state, setState] = useMergeState({
    visible: false,
    search: '',
  });

  const handleVisibleChange = (flag) => {
    setState({ visible: flag });
  };
  const onChange = (name, value) => {
    setState({ [name]: value });
  };
  const onChangeSelect = (item) => {
    setState({ visible: false });
    const data = props.isObject ? item : item?.alpha2;
    props.onChange(props.name, data);
  };

  const filterCountry = useMemo(() => {
    if (!state.search) {
      return countryData;
    }
    return _.filter(countryData, (x) => {
      const key = trimLowerCase(x.alpha2);
      const key2 = trimLowerCase(x.alpha3);
      const name = trimLowerCase(x.name);
      const value = trimLowerCase(state.search);
      return name?.includes(value) || key === value || key2 === value;
    });
  }, [countryData, state.search]);

  const selectedValue = useMemo(() => {
    if (props.isObject) {
      return props.value;
    }
    return _.find(countryData, x => x?.alpha2.toLowerCase() === props.value?.toLowerCase());
  }, [props.value, countryData, props.isObject]);

  const menu = (
    <Menu className="country-select-menu">
      <div className="country-select-menu-search">
        <InputCT
          placeholder="Search and select country"
          name="search"
          value={state.search}
          onChange={onChange}
          allowClear
          suffix={state.search ? null : <SearchOutlined className="suffix-icon" />}
        />
      </div>
      {_.isEmpty(filterCountry) ? <div className="text-color pad5-12">No results</div> : (
        <div className="country-select-menu-list">
          {_.map(filterCountry, (x, i) => (
            <Menu.Item onClick={() => onChangeSelect(x)} className="country-select-menu-item" key={`country-select-${i}`}>
              <div className="flag-content">
                <CountryFlag className="mr4" countryCode={x?.alpha2} />
                {/* <span className="flag-icon">{x.flag}</span> */}
                <p className="country-name">{x.name}</p>
              </div>
              <div>{`+${x.dial}`}</div>
            </Menu.Item>
          ))}
        </div>
      )}

    </Menu>
  );

  const flagShow = () => (
    <div className={classnames('phone-box-display', props.errMes ? 'err-border' : '')}>
      {_.isEmpty(selectedValue) ? <p className="text-color">Select country</p> : (
        <>
          <CountryFlag className="mr4" countryCode={selectedValue?.alpha2} />
          <p>{`${selectedValue?.dial ? `+${selectedValue?.dial}` : ''}`}</p>
        </>
      )}

    </div>
  );
  return (
    <div className={classnames('country-select-wrapper', props.className)}>
      {props.title && (
        <InputTitle title={props.title} isRequire={props.isRequire} />
      )}
      <Dropdown
        onVisibleChange={handleVisibleChange}
        visible={state.visible}
        trigger={['click']}
        overlay={menu}
        placement="bottomLeft"
        getPopupContainer={() => document.querySelector(`.country-select-button${props.popUpClassName ? `.${props.popUpClassName}` : ''}`)}
      >
        <div
          className={classnames('country-select-button', props.popUpClassName, selectedValue?.name ? '' : 'text-color')}
        >
          <div>{props.isShowFlag ? flagShow() : <span>{selectedValue?.name || 'Select country'}</span>}</div>
          <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

CountrySelect.defaultProps = {
  className: '',
  popUpClassName: '',
  name: '',
  value: '',
  errMes: '',
  title: '',
  isObject: false,
  isShowFlag: false,
  isRequire: false,
  onChange: () => { },
};

CountrySelect.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Popup classname of component */
  popUpClassName: PropTypes.string,
  /** Name of component */
  name: PropTypes.string,
  /** Value of component */
  value: PropTypes.string,
  /** Error message */
  errMes: PropTypes.string,
  /** Title of component */
  title: PropTypes.string,
  /** Whether object data */
  isObject: PropTypes.bool,
  /** Whether show country flag */
  isShowFlag: PropTypes.bool,
  /** Whether show require symbol */
  isRequire: PropTypes.bool,
  /** Change value event */
  onChange: PropTypes.func,
};

export default CountrySelect;
