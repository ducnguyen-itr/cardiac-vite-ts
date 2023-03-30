import { Select } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import CustomAvatar from '../../Avatar';
import InputTitle from '../inputTitle';
import './style.scss';

const { Option, OptGroup } = Select;

function AssignedSelectInput(props) {
  const onChange = (value) => {
    const item = _.find(props.options, x => x._id === value);
    props.onChange(props.name, item);
  };

  const assigneeOption = useMemo(() => {
    const option = _.find(props.options, x => x._id === props.assignee._id);
    return _.clone(option);
  }, [props.options, props.assignee]);
  return (
    <div
      className={classnames('select-ct-wrapper', props.className)}
      key={`select-ct-wrapper-${props.name}`}
    >
      <InputTitle title={props.title} />
      <Select
        placeholder={props.placeholder}
        optionFilterProp="label"
        onChange={onChange}
        filterOption={(input, option) => option?.label?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
        showSearch
        allowClear
        value={props.value?.fullName || null}
        disabled={props.disabled}
      >
        {!_.isEmpty(assigneeOption) ? (
          <>
            <OptGroup label="Assigned physician">
              <Option className="appointment-option" value={assigneeOption?.userId} label={assigneeOption?.fullName}>
                <div className="search-option">
                  <CustomAvatar
                    avatarLink={assigneeOption?.photo}
                    firstName={assigneeOption?.firstName}
                    lastName={assigneeOption?.lastName}
                  />
                  <div className="search-option-name">
                    {assigneeOption?.fullName}
                  </div>
                </div>
              </Option>
            </OptGroup>
            <OptGroup label="Others">
              {
                _.map(props.options.filter(x => x.userId !== props.assignee?._id), (x, i) => (
                  <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                    <div className="search-option">
                      <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                      <div className="search-option-name">
                        {x?.fullName}
                      </div>
                    </div>
                  </Option>
                ))
              }
            </OptGroup>
          </>
        ) : (
          <>
            {
              _.map(props.options, (x, i) => (
                <Option className="appointment-option" key={i} value={x.userId} label={x?.fullName}>
                  <div className="search-option">
                    <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                    <div className="search-option-name">
                      {x?.fullName}
                    </div>
                  </div>
                </Option>
              ))
            }
          </>
        )}
      </Select>
    </div>
  );
}
AssignedSelectInput.defaultProps = {
  value: {},
  disabled: false,
  options: [],
  assignee: {},
  placeholder: '',
  name: '',
  onChange: () => { },
  title: '',
  className: '',
};

AssignedSelectInput.propTypes = {
  /** Value of component */
  value: PropTypes.shape(),
  /** Whether disabled */
  disabled: PropTypes.bool,
  /** Options data */
  options: PropTypes.arrayOf(),
  /** Assignee data */
  assignee: PropTypes.shape(),
  /** Placeholder of component */
  placeholder: PropTypes.string,
  /** Name of component */
  name: PropTypes.string,
  /** Change value event */
  onChange: PropTypes.func,
  /** Title of component */
  title: PropTypes.string,
  /** Classname of component */
  className: PropTypes.string,
};

export default AssignedSelectInput;
