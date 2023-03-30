import { CalendarOutlined, CloseOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import fetchDrugBankToken from '../../Apollo/Functions/Fetch/fetchDrugBankToken';
import {
  FREQUENCY_DATA, MEDICATION_UNIT_OPTIONS, MEDICATION_UNIT_VALUE,
} from '../../Constants';
import consoleLog from '../../Helpers/consoleLog';
import { useMergeState } from '../../Helpers/customHooks';
import { convertMedicationItem, convertPluralMedicationUnit, fetchMedication } from '../../Utils';
import { formatMedication } from '../../Utils/medication';
import { showFailedMsg } from '../../Utils/showNotification';
import CustomButton from '../Button/customButton';
import AsyncSelectInput from '../Input/asyncSelect';
import DatepickerCT from '../Input/datepickerCT';
import InputCT from '../Input/inputCT';
import InputTitle from '../Input/inputTitle';
import SelectCT from '../Input/selectCT';
import {
  formatInput,
  getMedicationInfoText,
  getTimeToTake, getTimeToTakeInfoText, INIT_STATE, isDisabled, isDisabledClear,
} from './helper';
import './style.scss';


const AddMedication = (props) => {
  const inputTimeout = useRef('');
  const [state, setState] = useMergeState(_.cloneDeep(INIT_STATE));

  const onClickClearInput = () => {
    setState(_.cloneDeep(INIT_STATE));
  };

  const checkExistedMedication = (compareList = []) => compareList.find(medication => medication.name === state.name);

  const onAddMedication = () => {
    if (!state.quantity || parseInt(state.quantity, 10) < 1) {
      setState({ quantityErr: 'The value should be greater than 0' });
      return;
    }
    if (_.uniqBy(state.time, x => moment(x).format('HH:mm'))?.length < state.time.length) {
      showFailedMsg('Dosing times can not be repeated!');
      return;
    }
    const unitIndex = _.findIndex(MEDICATION_UNIT_OPTIONS, u => u === state.unit);
    if (!props.isEdit) {
      if (checkExistedMedication(props.medications)) {
        showFailedMsg('The medication had been inputted.');
        return;
      }
    } else {
      const exceptCurrentMedications = checkExistedMedication(props.medications);
      if (checkExistedMedication(exceptCurrentMedications)) {
        showFailedMsg('The medication had been inputted.');
        return;
      }
    }
    const timeToTake = _.map(state.time, x => moment(x).format('hh:mm A')).join(', ');
    const newData = formatInput(state);
    props.onAddMedication(props.name, { ...newData, unit: MEDICATION_UNIT_VALUE[unitIndex], timeToTake });
    onClickClearInput();
  };

  const onChangeMedication = (key, option) => {
    if (key === 'name') {
      const unitIndex = _.findIndex(MEDICATION_UNIT_VALUE, u => u === option?.unit);
      setState({
        name: option.value,
        unit: MEDICATION_UNIT_OPTIONS[unitIndex],
      });
    } else {
      setState({ [key]: option.value });
    }
  };
  const clearOptions = () => {
    setState({ options: [], name: '' });
  };

  const promiseOptions = (inputValue) => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = null;
    }
    return new Promise((resolve) => {
      inputTimeout.current = setTimeout(async () => {
        const products = await fetchMedication(inputValue, state.drugBankToken);
        const medicationData = convertMedicationItem(products);
        const options = formatMedication(medicationData);
        if (_.isEmpty(options)) {
          options.push({
            label: 'No results',
            value: 'No results',
            isDisabled: true,
          });
        }
        if (inputValue) {
          options.unshift({
            label: `Use "${inputValue}" anyway`,
            value: inputValue,
            isOtherOption: true,
          });
        }
        const setStateObject = { options };
        setState(setStateObject);
        resolve(options);
      }, 300);
    });
  };

  const onInputChange = (changedInputValue) => {
    setState({ name: changedInputValue });
  };

  const onChange = (key = '', value = '') => {
    if (key === 'frequency') {
      setState({ [key]: value, quantityErr: '', time: getTimeToTake(value) });
      return;
    }
    setState({ [key]: value, quantityErr: '' });
  };


  const showTimes = () => (
    <div className="mt16">
      <InputTitle title="Time to take" />
      <div className="time-to-take-main">
        {
          _.map(state.time, (x, i) => (
            <DatepickerCT
              key={i}
              className={classNames('time-to-take-item')}
              suffixIcon={<div />}
              onChange={(key, val) => {
                state.time[i] = val;
                setState({ time: state.time });
              }}
              format="hh:mm A"
              value={x}
              type="TIME"
              allowClear={false}
              use12Hours
            />
          ))
        }
      </div>
    </div>
  );

  const handleFetchDrugBankToken = async () => {
    try {
      const drugBankToken = await fetchDrugBankToken();
      setState({ drugBankToken });
    } catch (error) {
      consoleLog('Failed to fetch drug bank token', error);
    }
  };

  useEffect(() => {
    handleFetchDrugBankToken();
  }, []);

  return (
    <>
      <div className={classNames('add-medication-wrapper', props.className)}>
        <div className="header">
          <div className="title">Add medication</div>
        </div>
        <div className="body">
          <InputTitle title="Medication name" />
          <AsyncSelectInput
            name="name"
            placeholder="Enter medication name"
            value={state.name}
            onChange={onChangeMedication}
            isSearchable
            loadOptions={promiseOptions}
            options={state.options}
            clearOptions={clearOptions}
            onInputChange={onInputChange}
            maxLength={90}
            disabled={state.isDisabledName}
            isShowSearchIcon
          />
          <div className="input-row mt16">
            <div className="input-row-item first-item">
              <InputCT
                name="quantity"
                decimalScale={0}
                className="mr8 flex-1"
                type="NUMBER"
                title="Quantity"
                placeholder="Enter quantity"
                onChange={onChange}
                inputClassName={state.quantityErr ? 'err-border' : ''}
                value={state.quantity}
                errMes={state.quantityErr}
                errMesClassName="div-small-incorrect-mes"
              />
              <SelectCT
                name="unit"
                className="ml8 flex-2"
                placeholder="Select a unit"
                data={MEDICATION_UNIT_OPTIONS}
                value={state.unit}
                onChange={onChange}
              />
            </div>
            <SelectCT
              name="frequency"
              title="Frequency"
              className="input-row-item"
              data={FREQUENCY_DATA}
              value={state.frequency}
              onChange={onChange}
            />
          </div>

          {showTimes()}
          <InputCT
            name="notes"
            className="mt8"
            type="TEXTAREA"
            title="Note"
            placeholder="Enter note"
            onChange={onChange}
            value={state.notes}
            rows={1}
          />
          <InputCT
            name="prescribedDate"
            className="mt16"
            title="Prescribed date"
            placeholder="Enter prescribed date"
            type="DATE"
            value={state.prescribedDate}
            format="MM/DD/YYYY"
            onChange={onChange}
            disabledDate="PAST"
            suffix={<CalendarOutlined />}
          />
        </div>
        <div className="button-group">
          <CustomButton
            className="cancel-button"
            label="Clear"
            onClick={onClickClearInput}
            disabled={isDisabledClear(state)}
          />
          <CustomButton
            disabled={isDisabled(state)}
            onClick={onAddMedication}
            className="ml10 add-button"
            type="primary-light"
            label="Add medication"
          />
        </div>
      </div>
      {!_.isEmpty(props.medications) && (
        <div className="medication-card-container">
          {_.map(props.medications, (item, idx) => (
            <div className="medication-card-item mt8" key={`medication-card-${idx}`}>
              <div className="medication-card-top">
                <div className="medication-name">{item.name}</div>
                <CustomButton onClick={() => props.onRevmove(props.name, idx)} icon={<CloseOutlined />} className="delete-btn" />
              </div>
              {(getMedicationInfoText(item) || getTimeToTakeInfoText(item)) && (
                <div className="medication-card-bot">
                  <div className="medication-quantity">
                    {getMedicationInfoText(item)}
                  </div>
                  <div className="medication-note">
                    {getTimeToTakeInfoText(item)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

AddMedication.defaultProps = {
  className: undefined,
  name: '',
  medications: [],
  isEdit: false,
  onAddMedication: () => { },
  onRevmove: () => { },
};

AddMedication.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  medications: PropTypes.arrayOf(),
  isEdit: PropTypes.bool,
  onAddMedication: PropTypes.func,
  onRevmove: PropTypes.func,
};

export default AddMedication;
