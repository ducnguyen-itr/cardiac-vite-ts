import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import { label } from 'aws-amplify';
import { fetchingUsersData } from './helper';
import { useDebounce, useMergeState, useUpdateEffect } from '../../Helpers/customHooks';
import consoleLog from '../../Helpers/consoleLog';
import InputTitle from '../Input/inputTitle';


const { Option } = Select;

function SearchUserSelect(props) {
  const dataRef = useRef(undefined);
  const facilityRef = useRef(undefined);
  const defaultOptionRef = useRef([]);
  const [state, setState] = useMergeState({
    options: [],
    userCursor: '',
    isEndLoadMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const fetchUser = async (config = {}) => {
    setLoading(true);
    const { isLoadMore = false, searchValue = '' } = config || {};
    try {
      const result = await fetchingUsersData({
        isNurse: props.isNurse,
        facilityId: props.facilityId,
        isLoadMore,
        state,
        searchValue,
      });
      setState(result);
      dataRef.current = result?.options;
      if (facilityRef.current !== props.facilityId) {
        facilityRef.current = props.facilityId;
        defaultOptionRef.current = result?.options;
      }
    } catch (error) {
      consoleLog(error);
    }
    setLoading(false);
  };
  const onChange = (value, options) => {
    props.onChange(props.name, {
      value: options?.option?.value,
      label: options?.option?.label,
    });
  };

  const onSearch = (value) => {
    setSearchValue(value);
    if (!value) {
      setState({ options: defaultOptionRef.current });
    }
  };

  const onScroll = (event) => {
    const { target } = event;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight && !state.isEndLoadMore) {
      fetchUser({ isLoadMore: true });
    }
  };

  const debouncedSearchTerm = useDebounce(searchValue, 300);

  useEffect(() => {
    if (props.facilityId) {
      fetchUser();
    }
  }, [props.facilityId]);


  useUpdateEffect(() => {
    if (searchValue) {
      fetchUser({ searchValue });
    }
  }, [debouncedSearchTerm]);

  return (
    <div className={classNames('search-user-select-wrapper', props.className)}>

      <InputTitle title={props.title} />

      <Select
        getPopupContainer={trigger => trigger.parentElement}
        disabled={props.disabled}
        value={props.isObject ? props.value?.label || undefined
          : props.value}
        placeholder={props.placeholder}
        optionFilterProp="children"
        onChange={onChange}
        showSearch
        onSearch={onSearch}
        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        onPopupScroll={onScroll}
        loading={loading}
      >
        {
          props.isObject ? (
            _.map(state.options, (x, i) => (
              <Option option={x} key={i} value={x.label}>{x.label}</Option>
            ))
          )
            : _.map(state.options, (x, i) => (
              <Option key={i} value={x}>{x}</Option>
            ))
        }
      </Select>
    </div>
  );
}

SearchUserSelect.defaultProps = {
  className: '',
  facilityId: '',
  value: '',
  name: '',
  title: '',
  placeholder: '',
  onChange: () => { },
  disabled: false,
  isObject: true,
  isNurse: false,
};

SearchUserSelect.propTypes = {
  /** overwrite classname of component */
  className: PropTypes.string,
  /** Facility for fetch user */
  facilityId: PropTypes.string,
  /** value of select */
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
    PropTypes.shape(),
  ]),
  /** name of select */
  name: PropTypes.string,
  /** title of select */
  title: PropTypes.string,
  /** placeholder of select */
  placeholder: PropTypes.string,
  /** on change handler */
  onChange: PropTypes.func,
  /** disabled select */
  disabled: PropTypes.bool,
  /** is object value */
  isObject: PropTypes.bool,
  /** Is nurse field */
  isNurse: PropTypes.bool,
};

export default SearchUserSelect;
