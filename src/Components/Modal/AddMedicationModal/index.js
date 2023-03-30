import { Modal } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import fetchDrugBankToken from '../../../Apollo/Functions/Fetch/fetchDrugBankToken';
import { FREQUENCY_DATA, MEDICATION_UNIT_OPTIONS, MEDICATION_UNIT_VALUE } from '../../../Constants';
import consoleLog from '../../../Helpers/consoleLog';
import { useMergeState } from '../../../Helpers/customHooks';
import { convertMedicationItem, fetchMedication } from '../../../Utils';
import { formatMedication } from '../../../Utils/medication';
import { showFailedMsg } from '../../../Utils/showNotification';
import CustomButton from '../../Button/customButton';
import AsyncSelectInput from '../../Input/asyncSelect';
import DatepickerCT from '../../Input/datepickerCT';
import InputCT from '../../Input/inputCT';
import InputTitle from '../../Input/inputTitle';
import SelectCT from '../../Input/selectCT';
import { getTimeToTake } from './helper';
import './style.scss';

const AddMedicationModal = (props) => {
  const oldValueRef = useRef('');
  const inputTimeout = useRef('');

  const [state, setState] = useMergeState({
    name: '',
    quantity: '',
    unit: undefined,
    time: getTimeToTake(),
    notes: '',
    quantityErr: '',
    options: [],
    frequency: FREQUENCY_DATA[0],
    isDisabledName: false,
  });
  const {
    quantity, name, notes, time,
    frequency, unit,
  } = state;

  const handleFetchDrugBankToken = async () => {
    try {
      const drugBankToken = await fetchDrugBankToken();
      setState({ drugBankToken });
    } catch (error) {
      consoleLog('Failed to fetch drug bank token', error);
    }
  };

  const checkExistedMedication = (compareList = []) => compareList.find(medication => medication.name === state.name);

  useEffect(() => {
    handleFetchDrugBankToken();
  }, []);


  useEffect(() => {
    if (!_.isEmpty(props.medication) && props.isEdit) {
      const {
        name, quantity, time, notes, unit, isAddNew,
      } = _.cloneDeep(props.medication);
      const unitIndex = _.findIndex(MEDICATION_UNIT_VALUE, u => u === unit);
      oldValueRef.current = _.cloneDeep({
        name,
        quantity,
        time,
        notes,
        frequency: FREQUENCY_DATA[time?.length - 1],
        unit: MEDICATION_UNIT_OPTIONS[unitIndex],
      });
      setState({
        name,
        quantity,
        time: getTimeToTake(FREQUENCY_DATA[time?.length - 1], time),
        notes,
        frequency: FREQUENCY_DATA[time?.length - 1],
        unit: MEDICATION_UNIT_OPTIONS[unitIndex],
        isAddNew,
      });
    } else {
      setState({
        name: '',
        quantity: '',
        unit: undefined,
        time: getTimeToTake(),
        notes: '',
        quantityErr: '',
        options: [],
        frequency: FREQUENCY_DATA[0],
        isDisabledName: false,
      });
    }
  }, [props.medication, props.isEdit]);

  const isDisabled = (type = '') => {
    if (!name || !quantity || !unit) {
      return true;
    }
    const timeClone = _.cloneDeep(time);
    const timeFormat = [];
    timeClone.forEach(x => (
      moment(x).isValid() ? timeFormat.push(moment(x).format('hh:mm A')) : timeFormat.push(moment(x, 'HH:mm').format('hh:mm A'))
    ));
    const checkValue = {
      name,
      quantity: parseInt(quantity, 10),
      time: timeFormat,
      notes,
      unit,
      frequency,
    };
    if (_.isEqual(checkValue, oldValueRef.current) && type !== 'Presribe') {
      return true;
    }
    return false;
  };

  const onChange = (key = '', value = '') => {
    if (key === 'frequency') {
      setState({ [key]: value, quantityErr: '', time: getTimeToTake(value) });
      return;
    }
    setState({ [key]: value, quantityErr: '' });
  };

  const onChangeMedication = (key, option) => {
    if (key === 'name') {
      const unitIndex = _.findIndex(MEDICATION_UNIT_VALUE, u => u === option?.unit);
      setState({
        name: option.value,
        unit: MEDICATION_UNIT_OPTIONS[unitIndex],
        options: [],
      });
    } else {
      setState({ [key]: option.value, options: [] });
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

  const onResetState = () => {
    setState({
      name: '',
      quantity: '',
      time: [moment('09:00', 'HH:mm')],
      notes: '',
      frequency: FREQUENCY_DATA[0],
      unit: undefined,
    });
  };

  const onClickRightBtn = (isAddMore = false, isEdit) => {
    if (!quantity || parseInt(quantity, 10) < 1) {
      setState({ quantityErr: 'The value should be greater than 0' });
      return;
    }
    if (_.uniqBy(time, x => moment(x).format('HH:mm'))?.length < time.length) {
      showFailedMsg('Dosing times can not be repeated!');
      return;
    }
    const unitIndex = _.findIndex(MEDICATION_UNIT_OPTIONS, u => u === state.unit);
    if (!props.isEdit) {
      if (checkExistedMedication(props.existedMedications)) {
        showFailedMsg('The medication had been inputted.');
        return;
      }
    } else {
      const exceptCurrentMedications = props.existedMedications.filter(medication => medication.name !== props.medication.name);
      if (checkExistedMedication(exceptCurrentMedications)) {
        showFailedMsg('The medication had been inputted.');
        return;
      }
    }
    props.onClickSave({ ...state, unit: MEDICATION_UNIT_VALUE[unitIndex] }, isAddMore, props.isEdit);
    onResetState();
  };

  const onInputChange = (changedInputValue) => {
    setState({ name: changedInputValue });
  };

  const showTimes = () => (
    <>
      <InputTitle title="Time to take" className="mt16 mb0" />

      <div className="time-to-take-main">
        {
          _.map(time, (x, i) => (
            <DatepickerCT
              key={i}
              className={classNames('time-to-take-item', i % 4 === 0 ? '' : 'ml16')}
              suffixIcon={<div />}
              onChange={(key, val) => {
                time[i] = val;
                setState({ time });
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

    </>
  );

  const onClose = () => {
    onResetState();
    props.onClose();
  };

  const onSaveAndAddAnother = () => {
    onClickRightBtn(true, props.isEdit);
  };

  const showFooterButton = () => {
    if (!props.isEdit) {
      return (
        <>
          <CustomButton
            disabled={isDisabled()}
            onClick={onSaveAndAddAnother}
            className="mr4"
            type="primary"
            ghost
            label="Save & add another"
          />
          <CustomButton
            disabled={isDisabled()}
            onClick={() => onClickRightBtn(false, props.isEdit)}
            className="ml4"
            type="primary"
            label="Save"
          />
        </>
      );
    }
    return (
      <CustomButton disabled={isDisabled()} onClick={() => onClickRightBtn()} type="primary" label="Save" />
    );
  };
  return (
    <React.Fragment>
      <Modal
        className="add-medication-modal-wrapper"
        title={!props.isEdit ? 'Add medication' : 'Edit medication'}
        visible={props.visible}
        onCancel={onClose}
        maskClosable
        footer={null}
      >

        <div className="add-medication-modal-body">
          <InputTitle title="Medication" />

          <AsyncSelectInput
            name="name"
            placeholder="Find and select a medication"
            defaultValue={state.name}
            value={state.name}
            onChange={onChangeMedication}
            isSearchable
            loadOptions={promiseOptions}
            options={state.options}
            clearOptions={clearOptions}
            onInputChange={onInputChange}
            maxLength={90}
          />
          <div className="f-row mt16">

            <InputCT
              name="quantity"
              decimalScale={0}
              className="w60 mr8"
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
              className="w40 ml8 mt24"
              placeholder="Select a unit"
              data={MEDICATION_UNIT_OPTIONS}
              value={state.unit}
              onChange={onChange}
            />
          </div>
          <SelectCT
            name="frequency"
            className="mt16"
            title="Frequency"
            data={FREQUENCY_DATA}
            value={state.frequency}
            onChange={onChange}
          />

          {showTimes()}

          <InputCT
            name="notes"
            className="mt16"
            type="TEXTAREA"
            title="Notes"
            placeholder="Notes..."
            onChange={onChange}
            value={state.notes}
          />
        </div>
        <div className="add-medication-modal-footer">
          {showFooterButton()}
        </div>
      </Modal>
    </React.Fragment>
  );
};

AddMedicationModal.defaultProps = {
  visible: false,
  onClose: () => { },
  onClickSave: () => { },
  isEdit: false,
  medication: {},
  existedMedications: [],
};

AddMedicationModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onClickSave: PropTypes.func,
  isEdit: PropTypes.bool,
  medication: PropTypes.shape(),
  existedMedications: PropTypes.arrayOf(PropTypes.shape()),
};

export default AddMedicationModal;
