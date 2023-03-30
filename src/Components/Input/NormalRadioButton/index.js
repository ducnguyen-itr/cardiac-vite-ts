import { Radio, Space } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import InputTitle from '../inputTitle';
import './style.scss';

const NormalRadioButton = (props) => {
  const onChangeNormal = (value, option) => {
    props.onChange(props.name, value);
  };

  const renderRadio = props.isObject
    ? _.map(props.options, option => (
      <Radio key={option.value} value={option.value} disabled={props.isNewPatient && option.label === 'Virtual'}>{option.label}</Radio>
    ))
    : _.map(props.options, option => (
      <Radio key={option} value={option}>{option}</Radio>
    ));


  const onRemovePatient = () => {
    props.onRemovePatient();
  };
  const renderErrorMessage = () => (
    <div className="error-message">
      <p>{props.errMsg}</p>
    </div>
  );
  const renderRadioButton = (onChange, onBlur, value, ref) => (
    <Radio.Group
      ref={ref}
      disabled={props.disabled}
      value={value}
      defaultValue={props.defaultValue}
      onChange={onChange}
      onBlur={onBlur}
    >
      {props.isVertical
        ? (
          <Space direction="vertical">
            {renderRadio}
          </Space>
        )
        : renderRadio}
    </Radio.Group>
  );

  return (
    <div className={classNames('select-wrapper', props.className)} key={props.name}>
      {props.title && (
        <InputTitle title={props.title} />
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
              {renderRadioButton((value) => {
                if (props.name === 'insuranceType') {
                  props.resetInsurance();
                }
                if (props.name === 'patientType') {
                  onRemovePatient();
                }
                onChange(value);
              }, onBlur, value, ref)}
            </>
          )}
        />
      ) : (
        <>
          {renderRadioButton(onChangeNormal, () => { }, props.value, undefined)}
        </>
      )}
      {props.errMsg && renderErrorMessage()}
    </div>
  );
};
NormalRadioButton.defaultProps = {
  className: '',
  title: '',
  name: '',
  isUseForm: false,
  disabled: false,
  isNewPatient: true,
  value: undefined,
  options: undefined,
  defaultValue: undefined,
  isObject: true,
  isVertical: false,
  control: undefined,
  errMsg: '',
  onChange: () => {},
  resetInsurance: () => {},
  onRemovePatient: () => {},
};
NormalRadioButton.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  isUseForm: PropTypes.bool,
  disabled: PropTypes.bool,
  isNewPatient: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  options: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape()), PropTypes.arrayOf(PropTypes.string)]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  isObject: PropTypes.bool,
  isVertical: PropTypes.bool,
  control: PropTypes.shape(),
  errMsg: PropTypes.string,
  onChange: PropTypes.func,
  resetInsurance: PropTypes.func,
  onRemovePatient: PropTypes.func,
};
export default NormalRadioButton;
