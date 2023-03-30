import { SearchOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ASSIGN_SELECT_TYPES } from '../../Constants';
import { useMergeState } from '../../Helpers/customHooks';
import { formatNoEmptyString } from '../../Utils';
import CustomAvatar from '../Avatar';
import AssignTag from '../UI/assignTag';
import InputTitle from './inputTitle';

const { Option } = Select; // , OptGroup

const { APPOINTMENT, PATIENT_DETAILS } = ASSIGN_SELECT_TYPES;

const AssignSelect = (props) => {
  const [state, setState] = useMergeState({
    searchText: '',
  });

  const { searchText } = state;

  const {
    className, placeholder, data, title, onChange,
    showSearch, defaultValue,
    value, mode, suffixIcon, name,
    onDeleteTag, type,
    loading, valueItem,
  } = props;

  const valueItemData = type === APPOINTMENT ? valueItem : _.find(data, x => x.userId === value);

  const onSelect = (x) => {
    onChange(name, x);
  };

  const onSearch = (x) => {
    setState({ searchText: x });
    props.onSearch(x);
  };

  const filterOption = (input, option) => {
    if (type === APPOINTMENT) {
      return true;
    }
    const optionText = formatNoEmptyString(option?.key);
    const inputText = formatNoEmptyString(input);
    return optionText?.includes(inputText);
  };

  const renderOption = () => {
    switch (type) {
      case APPOINTMENT:
        return _.map(data, (x, z) => (
          <Option
            key={`${x.firstName} ${x.lastName} ${x.email} - ${z}`}
            value={x.userId}
          >
            <CustomAvatar
              avatarLink={x.photo}
              firstName={x.firstName}
              lastName={x.lastName}
              size={32}
            />
            <div className="ml12">
              <div className="b">
                {`${x.firstName} ${x.lastName}`}
              </div>
              <div>
                {x.email}
              </div>
            </div>
          </Option>
        ));
      default:
        return _.map(data, (x, z) => (
          <Option
            key={`${x.firstName} ${x.lastName} - ${z}`}
            value={x.userId}
          >
            <CustomAvatar
              avatarLink={x.photo}
              firstName={x.firstName}
              lastName={x.lastName}
              size={32}
            />
            <div className="ml12">
              {`${x.firstName} ${x.lastName}`}
            </div>
          </Option>
        ));
    }
  };

  return (
    <div className={classnames('assign-select-wrapper', className)}>

      <InputTitle title={title} />

      <Select
        suffixIcon={suffixIcon || <SearchOutlined />}
        mode={mode}
        defaultValue={defaultValue}
        value={[]}
        showSearch={showSearch}
        placeholder={placeholder}
        optionFilterProp="children"
        onSelect={onSelect}
        onSearch={onSearch}
        dropdownClassName="assign-drawer-dropdown"
        filterOption={(input, option) => filterOption(input, option)}
        notFoundContent={loading ? <Spin size="small" /> : data.length === 0 && searchText ? 'No data' : null}
      >
        {
          !loading && data.length !== 0 && renderOption()
        }
      </Select>

      {
        _.isEmpty(valueItemData) && type === PATIENT_DETAILS && !props.isAppointment
        && <div className="assign-select-outside-res" />
      }

      {
        valueItemData && !_.isEmpty(valueItemData) && (
          <div className="assign-select-outside-res">
            <AssignTag
              onDeleteTag={onDeleteTag}
              firstName={valueItemData.firstName}
              lastName={valueItemData.lastName}
              email={type === APPOINTMENT ? valueItemData.email : ''}
              photo={valueItemData.photo}
            />
          </div>
        )
      }
    </div>
  );
};
AssignSelect.defaultProps = {
  className: '',
  title: '',
  placeholder: 'Select...',
  data: [],
  onChange: () => { },
  onSearch: () => { },
  onDeleteTag: () => { },
  showSearch: true,
  defaultValue: undefined,
  mode: undefined, // 'tags', // or multiple
  value: undefined,
  suffixIcon: undefined,
  name: '',
  // isAssignMD: false,
  type: PATIENT_DETAILS,
  loading: false,
  valueItem: {},
  isAppointment: false,
};
AssignSelect.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onDeleteTag: PropTypes.func,
  showSearch: PropTypes.bool,
  defaultValue: PropTypes.string,
  mode: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape(),
  ]),
  suffixIcon: PropTypes.node,
  name: PropTypes.string,
  // isAssignMD: PropTypes.bool,
  type: PropTypes.string,
  loading: PropTypes.bool,
  valueItem: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    photo: PropTypes.string,
  }),
  isAppointment: PropTypes.bool,
};
export default AssignSelect;
