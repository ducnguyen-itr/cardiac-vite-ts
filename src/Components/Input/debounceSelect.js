import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Select, Spin, Tooltip } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { Controller } from 'react-hook-form';
import { TOOLTIP_MESSAGES } from '../../Constants';
import { useMergeState } from '../../Helpers/customHooks';
import { zeroPad } from '../../Utils';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import InputTitle from './inputTitle';
import PatientTypeTag from '../PatientTypeTag';
import './style.scss';

const { Option, OptGroup } = Select;

const DebounceSelect = forwardRef((props, ref) => {
  const clinicRef = useRef({});
  const patientTypeRef = useRef('');
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [state, setState] = useMergeState({
    loading: false,
  });
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setSearchValue(value);
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      if (value) {
        setOptions([]);
        setFetching(true);
        props.fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return;
          }
          if (props.patientType === 'other' && newOptions) {
            newOptions.unshift({
              isOtherOptions: true,
              label: 'Invite a new patient',
            });
          }
          setOptions(newOptions);
          setFetching(false);
        });
      } else {
        if (props.isGroupOption) {
          fetchRef.current = 0;
          setOptions([]);
        }
        setFetching(false);
      }
    };

    return debounce(loadOptions, props.debounceTimeout);
  }, [props.fetchOptions, props.debounceTimeout, props.patientType]);
  const onScroll = (event) => {
    const { target } = event;
    if (!state.loading && target.scrollTop + target.offsetHeight === target.scrollHeight && props.shouldLoadMore) {
      if (searchValue) {
        setState({ loading: true });
        setOptions([...options, { value: 'loading', label: 'loading', isLoading: true }]);
        target.scrollTo(0, target.scrollHeight);
        props.fetchOptions('', true, options).then((newOptions) => {
          setOptions(newOptions);
          setState({ loading: false });
        });
      }
    }
  };

  const onChangeNormal = (value, option) => {
    props.onChange(props.name, option);
  };

  useEffect(() => {
    if (props.isInitSearch) {
      debounceFetcher('');
    }
  }, []);

  useEffect(() => {
    if (!_.isEqual(clinicRef.current, props.clinic) || patientTypeRef.current !== props.patientType) {
      setOptions([]);
      clinicRef.current = props.clinic;
      patientTypeRef.current = props.patientType;
    }
  }, [props.patientType, props.clinic]);

  useImperativeHandle(ref, () => ({
    fetch(searchText) {
      debounceFetcher(searchText);
    },
  }));
  const renderErrorMessage = () => (
    <div className="error-message mt-4">
      <p>{props.errMsg}</p>
    </div>
  );

  const onClickAddBtn = () => {
    props.onClickAddBtn();
    if (props.shouldClearOption) {
      fetchRef.current = 0;
      setOptions([]);
    }
  };


  const setStoredValue = (name, value) => {
    props.setStoredValue(name, value);
  };
  const renderPatientOptions = () => (
    _.map(options, (x, i) => (
      <Option key={x._id} label={x.fullName} value={x._id} option={x}>
        <div className="debounce-search-option">
          <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
          <div className="debounce-search-option-name">
            <div className="main-name">{x?.fullName}</div>
            <div className="sub-name">
              {x?.email && <div>{x?.email}</div>}
              {x?.email && x?.carePlanFid && (
                <div className="qoute">|</div>
              )}
              {x?.carePlanFid && <div>{`Care plan ${zeroPad(x?.carePlanFid)}`}</div>}
            </div>
          </div>
        </div>
      </Option>
    ))
  );

  const renderCCMUserOptions = () => {

  };

  const renderNonCCMUserOptions = () => {

  };
  const renderNormalOptions = () => (
    <>
      {_.map(options, (x, i) => (
        <>
          {x.isLoading ? (
            <Option disabled className="fcen" key="loading">
              <Spin size="small" />
            </Option>
          ) : x.isOtherOptions ? (
            <Option key={`other-${i}`} value={x._id} option={x} label={x?.fullName} className="debounce-other-option-wrapper fcen">
              <div className="debounce-other-option">
                {x.label}
              </div>
            </Option>
          ) : (
            <Option key={i} value={x._id} option={x} label={x?.fullName}>
              <div className="debounce-search-option">
                <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                <div className="debounce-search-option-name">
                  <div className="main-name">
                    {x?.fullName}
                    {((props.patientType === 'chronic' && x?.patient?.willDeletedAt) || (props.patientType === 'other' && x?.willDeletedAt)) && (
                      <>
                        <Tooltip title={TOOLTIP_MESSAGES.DELETED_ACCOUNT} placement="bottom">
                          <ExclamationCircleOutlined className="is-deleted-icon" />
                        </Tooltip>
                      </>
                    )}
                    {x?.isCCM && <PatientTypeTag className="ml10" title="CCM" isShow isCCM />}
                    {x?.isRPM && <PatientTypeTag className="ml10" title="RPM" isShow />}
                  </div>
                  <div className="sub-name">
                    {x?.email && <div>{x?.email}</div>}
                    {x?.email && x?.carePlanFid && (
                      <div className="qoute">|</div>
                    )}
                    {x?.carePlanFid && <div>{`Care plan ${zeroPad(x?.carePlanFid)}`}</div>}
                  </div>
                </div>
              </div>
            </Option>
          )}
        </>
      ))}

    </>
  );

  const renderGroupOptions = () => (
    <>
      {!_.isEmpty(props.specialOption) && _.isEmpty(options) && fetchRef.current === 0 ? (
        <>
          <OptGroup label="Copy code from previous superbill">
            {_.map(props.specialOption, (x, i) => (
              <Option className="appointment-option" option={x} key={`${i}-${x.value}`} value={x.value} label={x?.label}>
                <div className="search-option">{x.label}</div>
              </Option>
            ))}
          </OptGroup>
        </>
      ) : (
        <>
          {_.map(options, (x, i) => (
            <Option option={x} key={i} value={x.value} label={x?.label}>
              <div>{x.label}</div>
            </Option>
          ))}
        </>
      )}
    </>
  );

  const renderOptions = () => {
    if (props.isSelectPatient) {
      return renderNormalOptions();
    }
    if (props.isSelectCCM) {
      return renderCCMUserOptions();
    }
    if (props.isSelectNonCCM) {
      return renderNonCCMUserOptions();
    }
    if (props.isGroupOption) {
      return renderGroupOptions();
    }
    return renderNormalOptions();
  };
  const renderDebounceSelect = (onChange, onBlur, value, ref) => (
    <Select
      ref={ref}
      placeholder={props.placeholder}
      allowClear={props.allowClear}
      showSearch={props.showSearch}
      disabled={props.disabled}
      mode={props.mode}
      value={value}
      filterOption={false}
      onSelect={props.onSelect}
      onSearch={debounceFetcher}
      onBlur={onBlur}
      getPopupContainer={() => document.getElementsByClassName('select-wrapper')[0]}
      notFoundContent={fetching ? <Spin size="small" /> : fetchRef.current === 0 && _.isEmpty(options) ? '' : props.notFoundContent}
      onChange={onChange}
      suffixIcon={props.suffixIcon}
      // options={options}
      onPopupScroll={onScroll}
    >
      {renderOptions()}
    </Select>
  );
  return (
    // <div className={classnames('select-wrapper', props.className)} key={props.name}>
    //   {props.title && <InputTitle className="mb-8" title={props.title} isRequired={props.isRequired} />}
    //   {renderDebounceSelect(onChangeNormal, () => { }, props.value, undefined)}
    //   {props.errMsg && renderErrorMessage()}
    // </div>
    <>
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
                {renderDebounceSelect((value, option) => {
                  if (props.isSelectPatient) {
                    setStoredValue('storedPatient', option.option);
                    if (option?.option?.nurse) {
                      setStoredValue('assignedNurse', option?.option?.nurse);
                    }
                    if (option?.option?.physician) {
                      setStoredValue('assignedPhysician', option?.option?.physician);
                    }
                    onChange(null);
                    return;
                  }
                  onChange(value);
                }, onBlur, props.mode === 'multiple' ? [...value] : value, ref)}
              </>
            )}
          />
        ) : (
          <>
            {renderDebounceSelect(onChangeNormal, () => { }, props.value, undefined)}
          </>
        )}
        {props.errMsg && renderErrorMessage()}
      </div>
      {props.showAddBtn && (
        <CustomButton
          disabled={props.disabledBtn}
          onClick={onClickAddBtn}
          type="primary"
          label="Add"
        />
      )}
    </>
  );
});

DebounceSelect.defaultProps = {
  className: '',
  title: '',
  name: '',
  showSearch: true,
  placeholder: '',
  disabled: false,
  mode: '',
  value: undefined,
  allowClear: false,
  isInitSearch: false,
  notFoundContent: 'No results',
  debounceTimeout: 300,
  errMsg: '',
  onChange: () => { },
  fetchOptions: () => { },
  onSelect: () => { },
  isSelectPatient: false,
  isSelectCCM: false,
  isSelectNonCCM: false,
  patientType: '',
  clinic: {},
  shouldLoadMore: false,
  isUseForm: false,
  control: {},
  setStoredValue: () => { },
  isGroupOption: false,
  specialOption: [],
  shouldClearOption: false,
  showAddBtn: false,
  disabledBtn: false,
  onClickAddBtn: () => { },
  suffixIcon: undefined,
};
DebounceSelect.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  showSearch: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  mode: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.shape(), PropTypes.arrayOf(PropTypes.string)]),
  allowClear: PropTypes.bool,
  isInitSearch: PropTypes.bool,
  notFoundContent: PropTypes.string,
  errMsg: PropTypes.string,
  onChange: PropTypes.func,
  fetchOptions: PropTypes.func,
  onSelect: PropTypes.func,
  debounceTimeout: PropTypes.number,
  isSelectPatient: PropTypes.bool,
  isSelectCCM: PropTypes.bool,
  isSelectNonCCM: PropTypes.bool,
  patientType: PropTypes.string,
  clinic: PropTypes.shape(),
  shouldLoadMore: PropTypes.bool,
  isUseForm: PropTypes.bool,
  control: PropTypes.shape(),
  setStoredValue: PropTypes.func,
  isGroupOption: PropTypes.bool,
  specialOption: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ])),
  shouldClearOption: PropTypes.bool,
  showAddBtn: PropTypes.bool,
  onClickAddBtn: PropTypes.func,
  disabledBtn: PropTypes.bool,
  suffixIcon: PropTypes.node,
};

export default DebounceSelect;
