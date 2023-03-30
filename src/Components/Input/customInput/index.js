/* eslint-disable no-unused-vars */
import { Input } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { handleOnChange } from './helper';
import './style.scss';

function CustomInput(props) {
  const onChangeWithoutForm = (event) => {
    handleOnChange({
      event,
      onChange: props.onChange,
      name: props.name,
      type: props.type,
      numberFormatType: props.numberFormatType,
      isUseForm: false,
    });
  };

  const onChangeWithForm = (event, onChange) => {
    handleOnChange({
      event,
      onChange,
      name: props.name,
      type: props.type,
      numberFormatType: props.numberFormatType,
      isUseForm: true,
    });
  };

  const renderInput = (onChange, onBlur, value, ref) => {
    switch (props.type) {
      case 'textarea':
        return (
          <Input.TextArea
            className={classnames('custom-input', props.className)}
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            disabled={props.disabled}
            id={props.id}
            size={props.size}
            maxLength={props.maxLength}
            showCount={props.showCount}
            type={props.type}
            onPressEnter={props.onPressEnter}
            prefix={props.prefix}
            suffix={props.suffix}
            allowClear={props.allowClear}
          />
        );
      default:
        return (
          <Input
            className={classnames('custom-input', props.className)}
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            defaultValue={props.defaultValue}
            placeholder={props.placeholder}
            disabled={props.disabled}
            id={props.id}
            size={props.size}
            maxLength={props.maxLength}
            showCount={props.showCount}
            type={props.type}
            onPressEnter={props.onPressEnter}
            prefix={props.prefix}
            suffix={props.suffix}
            allowClear={props.allowClear}
          />
        );
    }
  };

  return (
    <>
      {props.title && (
        <p className="custom-input__title">
          <span>{props.title}</span>
          <span className="custom-input__title__require">{props.showRequireSymbol ? ' *' : ''}</span>
        </p>
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
              {renderInput((e) => { onChangeWithForm(e, onChange); }, onBlur, value, ref)}
            </>
          )}
        />
      ) : (
        <>
          {renderInput(onChangeWithoutForm, props.onBlur, props.value, undefined)}
        </>
      )}

      {props.errorMessage && (
        <p className="custom-input__error-message">
          {props.errorMessage}
        </p>
      )}
    </>
  );
}

CustomInput.defaultProps = {
  className: '',
  name: '',
  value: undefined,
  defaultValue: undefined,
  placeholder: '',
  disabled: false,
  title: undefined,
  errorMessage: undefined,
  showRequireSymbol: false,
  id: undefined,
  type: 'text',
  size: undefined,
  maxLength: undefined,
  showCount: false,
  allowClear: false,
  numberFormatType: 'default',
  prefix: undefined,
  suffix: undefined,
  control: undefined,
  isUseForm: false,
  onChange: (name, value) => { },
  onBlur: (event) => { },
  onPressEnter: (event) => { },
};

CustomInput.propTypes = {
  /** Classname of input */
  className: PropTypes.string,
  /** Name of input */
  name: PropTypes.string,
  /** The input content value */
  value: PropTypes.string,
  /** The initial input content */
  defaultValue: PropTypes.string,
  /** The input placeholder */
  placeholder: PropTypes.string,
  /** Whether the input is disabled */
  disabled: PropTypes.bool,
  /** The input title */
  title: PropTypes.string,
  /** The error message for input */
  errorMessage: PropTypes.string,
  /** Whether show require symbol */
  showRequireSymbol: PropTypes.bool,
  /** The ID for input */
  id: PropTypes.string,
  /** The type of input */
  type: PropTypes.oneOf(['text', 'number', 'password']),
  /** The size of the input box. Note: in the context of a form, the middle size is used */
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  /** Whether show text count */
  maxLength: PropTypes.number,
  /** Whether show text count */
  showCount: PropTypes.bool,
  /** Number type of the content input, work only with the 'type' is 'number' */
  numberFormatType: PropTypes.oneOf(['default', 'integer', 'float']),
  /** If allow to remove input content with clear icon */
  allowClear: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      clearIcon: PropTypes.node,
    })]),
  /** The prefix icon for the Input */
  prefix: PropTypes.node,
  /** The suffix icon for the Input */
  suffix: PropTypes.node,
  /** React hook form controller, work only with isUseForm equal true */
  control: PropTypes.shape(),
  /** Whether use react hook form */
  isUseForm: PropTypes.bool,
  /** Callback when user input */
  onChange: PropTypes.func,
  /** Callback when user blur */
  onBlur: PropTypes.func,
  /** The callback function that is triggered when Enter key is pressed */
  onPressEnter: PropTypes.func,
};

export default CustomInput;
