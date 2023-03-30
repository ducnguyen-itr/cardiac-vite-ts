import React from 'react'
import PropTypes from 'prop-types'
import { SearchOutlined } from '@ant-design/icons'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'
import classnames from 'classnames'
import _ from 'lodash'

import { useMergeState, useUpdateEffect } from '../../Helpers/customHooks'

import Blue1BgRow from '../UI/blue1BgRow'

const CustomInput = (selectProps) => {
  const newProps = _.cloneDeep(selectProps)
  _.assign(newProps, { isHidden: false })
  return <components.Input {...newProps} />
}

const AsyncSelectInput = (props) => {
  const [state, setState] = useMergeState({
    inputValue: props.value
  })

  const generateCustomStyles = () => ({
    control: (provided, state) => ({
      ...provided,
      minHeight: '2rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgb(24 144 255 / 20%)' : 'none',
      border: state.isFocused ? '1px solid #40a9ff' : '1px solid #d9d9d9',
      borderRadius: '2px',
      padding: '0 0.5rem',
      backgroundColor: state.isDisabled ? '#f5f5f5' : 'white',

      '&:hover': {
        border: '1px solid #40a9ff'
      }
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: 'none',

      "+ div[class*='-indicatorContainer']": {
        padding: 0
      }
    }),
    option: (provided, optionState) => {
      const isOtherOption = optionState?.data?.isOtherOption
      const isCommon = optionState?.data?.isCommon
      const isSelected = optionState.value === props.value
      return {
        ...provided,
        backgroundColor: optionState.isDisabled
          ? 'white'
          : isOtherOption
          ? '#e6f7ff'
          : isSelected
          ? '#e6f7ff'
          : optionState?.isFocused
          ? '#e6f7ff'
          : 'white',
        color: isOtherOption
          ? '#1890FF'
          : isCommon
          ? '#8C8C8C'
          : optionState.isDisabled
          ? '#D9D9D9'
          : isSelected
          ? '#1d2f47'
          : '#262626',
        fontWeight: isOtherOption || isCommon ? '600' : isSelected ? 'bold' : 'normal',
        display: isOtherOption ? 'flex' : 'block',
        justifyContent: isOtherOption ? 'center' : 'unset',
        fontSize: isCommon ? '12px' : '14px',
        '&:hover': {
          backgroundColor: isOtherOption ? '#e6f7ff' : optionState.isDisabled ? '#ffffff' : '#E6F7FF',
          cursor: optionState.isDisabled ? 'default' : 'pointer'
        }
      }
    },
    placeholder: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'rgba(0, 0, 0, 0.25)' : '#BFBFBF'
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      maxHeight: 'calc(8.25rem - 2 * 0.75rem)',
      overflowY: 'auto',
      padding: 0
    })
  })

  const onChange = (value) => {
    if (props.isInputLabel && value?.isOtherOption) {
      setState({ inputValue: 'Other' })
      props.onChange(props.name, value)
      return
    }
    setState({ inputValue: value.value })

    props.onChange(props.name, value)
  }

  const onRemoveOutsideValue = (value) => {
    props.onChange(props.name, value, true)
  }

  const generateSelectInputComponents = () => ({
    Input: CustomInput,
    DropdownIndicator: () => null
    // DropdownIndicator: () => (
    //   <SearchOutlined />
    // ),
  })

  const onInputChange = (inputValue, { action }) => {
    if (inputValue?.length > props.maxLength) {
      return inputValue.substr(0, props.maxLength)
    }
    if (action === 'input-change') {
      props.onInputChange(inputValue)
      if (!inputValue) {
        props.clearOptions()
      }
      setState({ inputValue })
    }
    return inputValue
  }

  useUpdateEffect(() => {
    if (!_.isNil(props.value)) {
      setState({ inputValue: props.value })
    }
  }, [props.value])

  return (
    <div className={classnames('custom-select-input', props.className)}>
      <AsyncSelect
        isDisabled={props.disabled}
        value={props.isValueOutside ? null : props.value}
        inputValue={props.isValueOutside ? undefined : state.inputValue}
        onInputChange={onInputChange}
        styles={generateCustomStyles()}
        onChange={onChange}
        loadOptions={props.loadOptions}
        onBlur={props.onBlur}
        isSearchable={props.isSearchable}
        placeholder={props.placeholder}
        components={generateSelectInputComponents()}
        defaultOptions={props.options}
        filterOption={() => true}
        menuIsOpen={props.options === null || props.options?.length === 0 ? false : undefined}
        onKeyDown={(e) => {
          if (e.keyCode === 32 && !e.target.value) {
            e.preventDefault()
            onInputChange(state.inputValue + e.key, { action: 'input-change' })
          }
        }}
      />
      {props.isShowSearchIcon && <SearchOutlined className='search-icon' />}
      {props.isValueOutside && (
        <div className='select-ct-outside-res'>
          {_.map(props.defaultValue, (item) => (
            <Blue1BgRow
              key={item.value}
              value={item.label}
              className='mt8'
              onClick={() => {
                onRemoveOutsideValue(item)
              }}
              isShowDeleteButton={!item.isDefault}
            />
          ))}
        </div>
      )}
    </div>
  )
}

AsyncSelectInput.defaultProps = {
  className: undefined,
  disabled: false,
  placeholder: '',
  value: undefined,
  isValueOutside: false,
  isSearchable: false,
  loadOptions: () => {},
  options: [],
  clearOptions: () => {},
  defaultValue: [],
  onInputChange: () => {},
  onBlur: () => {},
  isInputLabel: false,
  isShowSearchIcon: false,
  maxLength: 75
}

AsyncSelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.shape()), PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  isValueOutside: PropTypes.bool,
  isSearchable: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
        value: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
      })
    ),
    PropTypes.string
  ]),
  loadOptions: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
      value: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
    })
  ),
  clearOptions: PropTypes.func,
  onBlur: PropTypes.func,
  onInputChange: PropTypes.func,
  isInputLabel: PropTypes.bool,
  isShowSearchIcon: PropTypes.bool,
  maxLength: PropTypes.number
}

export default AsyncSelectInput
