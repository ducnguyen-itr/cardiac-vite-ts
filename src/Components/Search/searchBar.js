import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Input, Dropdown, Menu } from 'antd';
import { SearchOutlined, ControlOutlined, CheckOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';

import { useMergeState, useUpdateEffect, useDebounce } from '../../Helpers/customHooks';

const { Item } = Menu;

const SearchBar = (props) => {
  const [state, setState] = useMergeState({
    searchValue: '',
    searchByKey: props.searchByList?.[0]?.value || 'patientName',
  });

  const searchByItem = useMemo(
    () => _.find(props.searchByList, x => x.value === state.searchByKey),
    [state.searchByKey],
  );

  const onChangeSearch = (e) => {
    setState({ searchValue: e.target.value });
  };

  const onChangeSearchNumber = (e) => {
    const { value } = e.target;
    // const reg = /^-?\d*(\.\d*)?$/;
    const reg = /^-?\d*(\d*)?$/;
    if ((!_.isNaN(value) && reg.test(value))) {
      setState({ searchValue: value });
    }
  };

  const debouncedSearchTerm = useDebounce(state.searchValue, 300);

  useUpdateEffect(() => {
    if (props.shouldShowAllData) {
      props.handleSearch(
        state.searchByKey,
        state.searchValue !== ''
          ? searchByItem?.isInteger
            ? parseInt(state.searchValue, 10)
            : state.searchValue
          : undefined,
      );
    } else {
      props.fetchData({
        [state.searchByKey]: state.searchValue !== ''
          ? searchByItem?.isInteger
            ? parseInt(state.searchValue, 10)
            : state.searchValue?.trim()
          : undefined,
      }, false, false, true);
    }
  }, [debouncedSearchTerm]);

  const onChangeSearchBy = ({ key }) => {
    setState({ searchByKey: key });
    setState({ searchValue: '' });
  };

  useEffect(() => {
    if (!_.isEmpty(props.searchValue) || !_.isNil(props.searchValue)) {
      if (props.searchValue?.toString() !== state.searchValue?.toString()) {
        const newState = {
          searchValue: props.searchValue,
        };
        if (props.searchByKey !== state.searchByKey) {
          _.assign(newState, { searchByKey: props.searchByKey || props.searchByList?.[0]?.value || 'patientName' });
        }
        setState(newState);
      }
    }
  }, [props.searchValue]);

  const menu = (
    <Menu className="search-menu-wrapper">
      <div className="search-menu-title">
        <span>Search by</span>
      </div>
      {
        _.map(props.searchByList, searchByItem => (
          <Item key={searchByItem.value} className="search-menu-item" onClick={onChangeSearchBy}>
            {
              searchByItem.value === state.searchByKey
                ? <CheckOutlined className="item-icon" />
                : <div className="icon-placeholder" />
            }
            {searchByItem.label}
          </Item>
        ))
      }
    </Menu>
  );

  return (
    <div className={classnames('search-bar-wrapper', props.searchBarWrapper)}>
      <Input
        disabled={props.disabled}
        allowClear
        className={classnames(props.className,
          state.searchValue ? '' : 'is-inactive',
          props.isVisible ? '' : 'search-bar-input-ct')}
        placeholder={searchByItem?.placeholder || ''}
        prefix={props.icon
          ? (
            <img src={props.icon} alt="Search bar icon" />
          )
          : (
            <SearchOutlined />
          )}
        value={state.searchValue}
        onChange={searchByItem?.isInteger ? onChangeSearchNumber : onChangeSearch}
      />
      {
        props.isVisible && (
          <Dropdown disabled={props.disabled} className="search-filter-btn" overlay={menu} trigger={['click']} placement="bottomRight">
            <ControlOutlined />
          </Dropdown>
        )
      }
    </div>
  );
};

SearchBar.defaultProps = {
  searchBarWrapper: '',
  className: undefined,
  icon: undefined,
  searchByList: [],
  isVisible: true,
  fetchData: () => { },
  shouldShowAllData: false,
  handleSearch: () => { },
  disabled: false,
  searchValue: '',
  searchByKey: '',
};

SearchBar.propTypes = {
  /** Wrapper classname */
  searchBarWrapper: PropTypes.string,
  /** Classname of component */
  className: PropTypes.string,
  /** Prefix icon of component */
  icon: PropTypes.string,
  /** fetch data event */
  fetchData: PropTypes.func,
  /** Search by list option */
  searchByList: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    isInteger: PropTypes.bool,
  })),
  /** Whether visible filter option */
  isVisible: PropTypes.bool,
  /** Whether show all data */
  shouldShowAllData: PropTypes.bool,
  /** Handle search event */
  handleSearch: PropTypes.func,
  /** Whether disabled */
  disabled: PropTypes.bool,
  /** Value of component */
  searchValue: PropTypes.string,
  /** Search key of component */
  searchByKey: PropTypes.string,
};

export default SearchBar;
