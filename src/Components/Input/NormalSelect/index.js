import { Select } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import auth from '../../../Helpers/auth';
import CustomAvatar from '../../Avatar';
import InputTitle from '../inputTitle';
import './style.scss';

const { Option, OptGroup } = Select;

const NormalSelect = (props) => {
  // need something to store selected items, can use state or ref.
  const onSearch = (value) => {
  };
  const onChangeNormal = (value, option) => {
    props.onChange(props.name, option);
  };

  const resetAddress = (value) => {
    props.resetAddress(value);
  };

  const resetInsurance = (value) => {
    props.resetInsurance(value);
  };

  const setStoredValue = (name, value) => {
    props.setStoredValue(name, value);
  };

  const onRemovePatient = () => {
    props.onRemovePatient();
  };

  const onClear = () => {
    props.onClear();
  };

  const renderOptions = props.isObject
    ? _.map(props.options, option => (
      <Option key={option.value} value={option.value} option={option} label={option.label}>{option.label}</Option>
    ))
    : _.map(props.options, option => (
      <Option key={option} value={option}>{option}</Option>
    ));

  const renderErrorMessage = () => (
    <div className="error-message">
      {props.errMsg}
    </div>
  );

  const renderReasonOption = () => (
    _.map(props.options, option => (
      <Option label={option.name} value={option._id} key={option._id} option={option}>
        {option.name}
      </Option>
    ))
  );

  const renderSelectClinicOption = () => (
    _.map(props.options, option => (
      <Option label={option.label} value={option.value} key={option.value} option={option}>
        <div className="facility">
          <div className="facility-name">{option.label}</div>
          <div className="facility-description">{option.description}</div>
        </div>
      </Option>
    ))
  );

  const renderSelectAttendeeOption = () => {
    if (!_.isEmpty(props.assignedNurse)) {
      const isAssignedNurse = props.options.find(nurse => nurse._id === props.assignedNurse._id);
      if (isAssignedNurse) {
        const otherNurse = props.options.filter(nurse => nurse._id !== props.assignedNurse._id);
        return (
          <>
            <OptGroup label="Assigned">
              <Option
                value={isAssignedNurse._id}
                key={isAssignedNurse._id}
                label={`${isAssignedNurse.firstName} ${isAssignedNurse.lastName} ${isAssignedNurse._id === auth.getLoginData()._id ? '(You)' : ''}`}
                option={isAssignedNurse}
              >
                <div className="attendee">
                  <div className="attendee-info">
                    <CustomAvatar
                      className="mr12"
                      avatarLink={isAssignedNurse.photo}
                      firstName={isAssignedNurse.firstName}
                      lastName={isAssignedNurse.lastName}
                    />
                    <div className="attendee-info-name">
                      {`${isAssignedNurse.firstName} ${isAssignedNurse.lastName} ${isAssignedNurse._id === auth.getLoginData()._id ? '(You)' : ''}`}
                    </div>
                  </div>
                  <div className="attendee-status">
                    {isAssignedNurse.available ? '' : 'Busy'}
                  </div>
                </div>
              </Option>
            </OptGroup>
            {!_.isEmpty(otherNurse) && (
            <OptGroup label="Others">
              {_.map(otherNurse, option => (
                <Option
                  value={option._id}
                  key={option._id}
                  label={`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
                  option={option}
                >
                  <div className="attendee">
                    <div className="attendee-info">
                      <CustomAvatar
                        className="mr12"
                        avatarLink={option.photo}
                        firstName={option.firstName}
                        lastName={option.lastName}
                      />
                      <div className="attendee-info-name">
                        {`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
                      </div>
                    </div>
                    <div className="attendee-status">
                      {option.available ? '' : 'Busy'}
                    </div>
                  </div>
                </Option>
              ))}
            </OptGroup>
            )}

          </>
        );
      }
    }
    if (!_.isEmpty(props.assignedPhysician)) {
      const isAssignedPhysician = props.options.find(physician => physician._id === props.assignedPhysician._id);
      if (isAssignedPhysician) {
        const otherPhysician = props.options.filter(physician => physician._id !== props.assignedPhysician._id);
        return (
          <>
            <OptGroup label="Assigned">
              <Option
                value={isAssignedPhysician._id}
                key={isAssignedPhysician._id}
                label={`${isAssignedPhysician.firstName} ${isAssignedPhysician.lastName} ${isAssignedPhysician._id === auth.getLoginData()._id ? '(You)' : ''}`}
                option={isAssignedPhysician}
              >
                <div className="attendee">
                  <div className="attendee-info">
                    <CustomAvatar
                      className="mr12"
                      avatarLink={isAssignedPhysician.photo}
                      firstName={isAssignedPhysician.firstName}
                      lastName={isAssignedPhysician.lastName}
                    />
                    <div className="attendee-info-name">
                      {`${isAssignedPhysician.firstName} ${isAssignedPhysician.lastName} ${isAssignedPhysician._id === auth.getLoginData()._id ? '(You)' : ''}`}
                    </div>
                  </div>
                  <div className="attendee-status">
                    {isAssignedPhysician.available ? '' : 'Busy'}
                  </div>
                </div>
              </Option>
            </OptGroup>
            {!_.isEmpty(otherPhysician) && (
            <OptGroup label="Others">
              {_.map(otherPhysician, option => (
                <Option
                  value={option._id}
                  key={option._id}
                  label={`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
                  option={option}
                >
                  <div className="attendee">
                    <div className="attendee-info">
                      <CustomAvatar
                        className="mr12"
                        avatarLink={option.photo}
                        firstName={option.firstName}
                        lastName={option.lastName}
                      />
                      <div className="attendee-info-name">
                        {`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
                      </div>
                    </div>
                    <div className="attendee-status">
                      {option.available ? '' : 'Busy'}
                    </div>
                  </div>
                </Option>
              ))}
            </OptGroup>
            )}

          </>
        );
      }
    }
    return (
      _.map(props.options, option => (
        <Option
          value={option._id}
          key={option._id}
          label={`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
          option={option}
        >
          <div className="attendee">
            <div className="attendee-info">
              <CustomAvatar
                className="mr12"
                avatarLink={option.photo}
                firstName={option.firstName}
                lastName={option.lastName}
              />
              <div className="attendee-info-name">
                {`${option.firstName} ${option.lastName} ${option._id === auth.getLoginData()._id ? '(You)' : ''}`}
              </div>
            </div>
            <div className="attendee-status">
              {option.available ? '' : 'Busy'}
            </div>
          </div>
        </Option>
      ))
    );
  };
  const optionsRender = () => {
    if (props.isSelectClinic) {
      return renderSelectClinicOption();
    }
    if (props.isAttendee) {
      return renderSelectAttendeeOption();
    }
    if (props.isReason) {
      return renderReasonOption();
    }
    return renderOptions;
  };

  const renderSelect = (onChange, onBlur, value, ref) => (
    <Select
      ref={ref}
      placeholder={props.placeholder}
      allowClear={props.allowClear}
      showSearch={props.showSearch}
      loading={props.loading}
      optionFilterProp="children"
      disabled={props.disabled}
      mode={props.mode}
      value={value}
      getPopupContainer={() => document.getElementsByClassName('select-wrapper')[0]}
      options={props.mode === 'multiple' || props.isSelectClinic || props.isSelectClinicUser || props.isAttendee || props.isObject ? undefined : props.options}
      defaultValue={props.defaultValue}
      onSearch={onSearch}
      onChange={onChange}
      onBlur={onBlur}
      notFoundContent={props.notFoundContent}
      optionLabelProp="label"
      suffixIcon={props.suffixIcon}
      onClear={onClear}
      filterOption={(input, option) => {
        const normalizeInput = input.toLowerCase();
        if (props.isReason) {
          const normalizeFullLabel = (option?.label?.toLowerCase());
          return normalizeFullLabel?.includes(normalizeInput);
        }
        if (props.isAttendee) {
          const normalizeFullLabel = option.label.toLowerCase();
          return normalizeFullLabel?.includes(normalizeInput);
        }
        if (props.isSelectClinic) {
          const normalizeFullLabel = option.children.props.children[0].props.children.toLowerCase();
          return normalizeFullLabel?.includes(normalizeInput);
        }
        if (props.isObject) {
          const normalizeFullLabel = (option?.option?.label?.toLowerCase());
          return normalizeFullLabel?.includes(normalizeInput);
        }
        const normalizeFullValue = (option?.value?.toLowerCase());
        return normalizeFullValue?.includes(normalizeInput);
      }
      }
    >
      {optionsRender()}
    </Select>
  );

  return (
    <div className={classNames('select-wrapper', props.className)} key={props.name}>
      {props.title && (
        <InputTitle title={props.title} isRequire={props.isRequire} />
      )}
      {props.isUseForm ? (
        <Controller
          control={props.control}
          name={props.name}
          render={({
            field: {
              onChange, onBlur, value, ref,
            },
          }) => (
            <>
              {renderSelect((value, option) => {
                if (props.name === 'country') {
                  resetAddress(value);
                  resetInsurance(value);
                  onChange(option.option);
                  return;
                }
                if (props.isAttendee) {
                  if (value === undefined) {
                    onChange(null);
                    return;
                  }
                  onChange({ value: option.option._id, label: `${option.option.firstName} ${option.option.lastName} ${option.option._id === auth.getLoginData()._id ? '(You)' : ''}` });
                  return;
                }
                if (props.isSelectClinic) {
                  setStoredValue('storedClinic', option.option);
                  onRemovePatient();
                  onChange(null);
                  return;
                }
                if (props.name === 'reason') {
                  setStoredValue('reasons', option.option);
                  onChange(null);
                  return;
                }
                if (props.name === 'insuranceName') {
                  onChange(value);
                  return;
                }
                if (props.isObject) {
                  onChange(option.option);
                  return;
                }
                onChange(value);
              }, onBlur, props.mode === 'multiple' ? [...value] : value, ref)}
            </>
          )}
        />
      ) : (
        <>
          {renderSelect(onChangeNormal, () => { }, props.value, undefined)}
        </>
      )}
      {props.errMsg && renderErrorMessage()}
    </div>
  );
};
NormalSelect.defaultProps = {
  className: '',
  title: '',
  name: '',
  isUseForm: false,
  showSearch: true,
  placeholder: '',
  disabled: false,
  loading: false,
  mode: '',
  value: undefined,
  options: undefined,
  defaultValue: undefined,
  allowClear: false,
  isRequire: false,
  isObject: true,
  isSelectClinic: false,
  isSelectClinicUser: false,
  isReason: false,
  suffixIcon: undefined,
  notFoundContent: 'No data',
  control: undefined,
  errMsg: '',
  onChange: () => {},
  resetAddress: () => {},
  resetInsurance: () => {},
  isAttendee: false,
  assignedNurse: {},
  assignedPhysician: {},
  onClear: () => {},
  setStoredValue: () => {},
  onRemovePatient: () => {},
};
NormalSelect.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  isUseForm: PropTypes.bool,
  showSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  mode: PropTypes.string,
  isRequire: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.arrayOf(PropTypes.string)]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  allowClear: PropTypes.bool,
  isObject: PropTypes.bool,
  isSelectClinic: PropTypes.bool,
  isSelectClinicUser: PropTypes.bool,
  notFoundContent: PropTypes.string,
  control: PropTypes.shape(),
  errMsg: PropTypes.string,
  onChange: PropTypes.func,
  resetAddress: PropTypes.func,
  resetInsurance: PropTypes.func,
  isAttendee: PropTypes.bool,
  isReason: PropTypes.bool,
  suffixIcon: PropTypes.node,
  assignedNurse: PropTypes.shape(),
  assignedPhysician: PropTypes.shape(),
  onClear: PropTypes.func,
  setStoredValue: PropTypes.func,
  onRemovePatient: PropTypes.func,
};
export default NormalSelect;
