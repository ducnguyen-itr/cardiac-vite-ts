import { PlusOutlined } from '@ant-design/icons';
import { Divider, Typography } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import {
  CONFIRMATION_LAYOUT_TYPES, DEFAULT_HEART_VALVE_DATA,
} from '../../../Constants';
import { BASELINE_DIAGNOSED_CONDITIONS_OTHER, BASELINE_DIAGNOSED_CONDITIONS_TYPE, MEDICAL_HISTORY_DEFAULT_OPTIONS } from '../../../Constants/baseline';
import { useMergeState, useUpdateEffect } from '../../../Helpers/customHooks';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { showFailedMsg } from '../../../Utils/showNotification';
import Blue1BgButton from '../../Button/blue1BgButton';
import CustomButton from '../../Button/customButton';
import FullWidthButtons from '../../Button/fullWidthButtons';
import AsyncSelectInput from '../../Input/asyncSelect';
import InputCT from '../../Input/inputCT';
import InputTitle from '../../Input/inputTitle';
import { handleSplitAllergies } from '../../Modal/AddAllergyModal/helper';
import DiagnosedConditions from '../DiagnosedConditions';
import {
  disabledAddMore, fetchAtRiskCondition, formartaAtRiskConditionValue, formataAtRiskCondition, getConditionsSelectData, getHeartValveData, isDisabledSaveBtn,
} from './helper';

const { Title } = Typography;

const AFIBInformation = (props) => {
  const inputTimeout = useRef();
  const [state, setState] = useMergeState({
    // Heart valve status
    heartValveIssue: props.data?.heartValveIssue || getHeartValveData(props.data?.diagnosedConditions, 1) || undefined,

    valvularHeartDisease: props.data?.valvularHeartDisease || getHeartValveData(props.data?.diagnosedConditions, 2) || undefined,
    heartValveReplacement: props.data?.heartValveReplacement || getHeartValveData(props.data?.diagnosedConditions, 3) || DEFAULT_HEART_VALVE_DATA,
    mitralValveStatus: props.data?.mitralValveStatus || getHeartValveData(props.data?.diagnosedConditions, 4) || undefined,

    diagnosedConditions: props.hasDoneStep1 ? _.cloneDeep(props.data?.diagnosedConditions) : props.data?.diagnosedConditions && props.data?.diagnosedConditions?.length !== 0
      ? _.cloneDeep(props.data?.diagnosedConditions) : props.isAdd ? _.cloneDeep(props.diagnosedConditionsAdd) : [{}],
    othersConditions: _.cloneDeep(props.data?.othersConditions) || undefined,
    atRiskConditions: props.hasDoneStep1 ? formartaAtRiskConditionValue(props.data?.atRiskConditions) : !_.isEmpty(props.data?.atRiskConditions) ? formartaAtRiskConditionValue(props.data?.atRiskConditions)
      : !_.isEmpty(_.cloneDeep(props.defaultData?.atRiskConditions))
        ? formartaAtRiskConditionValue(_.cloneDeep(props.defaultData?.atRiskConditions)) : [],
    notesAtRiskConditions: _.cloneDeep(props.data?.notesAtRiskConditions) || undefined,
    atRiskConditionsErr: '',
    isNextErrVisible: false,
    atRiskConditionsOptions: MEDICAL_HISTORY_DEFAULT_OPTIONS,
  });

  const { className, type, data } = props;
  const {
    heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
    diagnosedConditions, notesAtRiskConditions,
    atRiskConditions, othersConditions, atRiskConditionsErr,
    isNextErrVisible,
  } = state;
  const onChangeMultiCheckbox = (keyValue, obj, x) => {
    const data = _.cloneDeep(state[keyValue]);
    const item = _.find(data, x => x?.value === obj?.value);
    _.assign(item, { isCheck: x });
    setState({ [keyValue]: _.cloneDeep(data) });
  };

  const onChange = (key = '', value = '') => {
    setState({ [key]: value });
  };


  const onChangeTextArea = (key = '', value = '') => {
    let lineCount = 0;
    const lineCountLimit = 7;
    // const charactersPerLine = auth.isMD() ? 144 : 176;
    const charactersPerLine = 110;
    const splitedLineBreakValue = value.split(/\r\n|\r|\n/);
    _.remove(splitedLineBreakValue, x => !x); // *: Remove empty lines
    lineCount += splitedLineBreakValue.length; // *: Line count included all line breaks
    _.forEach(splitedLineBreakValue, (splitedLine) => {
      const singleLineCount = Math.ceil(splitedLine.length / charactersPerLine);
      if (singleLineCount > 1) { // *: Add more line count if each single line has larger than 1 line
        lineCount += (singleLineCount - 1);
      }
    });
    if (lineCount > lineCountLimit) {
      showFailedMsg('Could not add more lines');
    } else {
      setState({ [key]: value });
    }
  };

  useUpdateEffect(() => {
    if (!_.isEmpty(othersConditions)) {
      setState({ atRiskConditionsErr: '' });
    }
  }, [othersConditions]);

  const onClickLeft = () => {
    props.onClickLeft();
  };

  const toggleNextErr = () => {
    setState({ isNextErrVisible: !isNextErrVisible });
  };

  const onClickRight = () => {
    // if (!diagnosedConditions?.[0]?.type) {
    //   setState({ isNextErrVisible: true });
    //   return;
    // }
    const emptyDiagnosed = _.find(diagnosedConditions, x => x?.type === BASELINE_DIAGNOSED_CONDITIONS_OTHER && _.isEmpty(x.othersConditions));
    if (emptyDiagnosed) {
      emptyDiagnosed.errMes = 'Please enter the condition!';
      setState({ diagnosedConditions });
      return;
    }
    if (atRiskConditions?.includes(BASELINE_DIAGNOSED_CONDITIONS_TYPE.Other) && _.isEmpty(othersConditions.trim())) {
      setState({ atRiskConditionsErr: 'Please enter the condition!' });
      return;
    }

    const atRiskConditionsFm = formataAtRiskCondition(state.atRiskConditions);
    const notesAtRiskConditions = handleSplitAllergies(state.notesAtRiskConditions, 110);
    props.onClickRight({ ...state, atRiskConditions: atRiskConditionsFm, notesAtRiskConditions });
  };

  const onClickAddMore = () => {
    diagnosedConditions.push({});
    setState({ diagnosedConditions });
  };

  const onChangeDiagnosed = (key, value, index, isOtherOption) => {
    if (isOtherOption) {
      _.assign(diagnosedConditions[index], { [key]: 'Other', errMes: '', othersConditions: value });
      setState({ diagnosedConditions });
      if (key === 'type') {
        _.assign(diagnosedConditions[index], { flag: false });
      }
      return;
    }
    _.assign(diagnosedConditions[index], { [key]: value, errMes: '' });
    if (key === 'type') {
      _.assign(diagnosedConditions[index], {
        flag: false, othersConditions: undefined, pattern: null, onsetDate: null, confirmedVia: undefined,
      });
    }
    setState({ diagnosedConditions });
  };

  const onClickDeleteDiagnosed = (index = 0) => {
    const cloneDiagnosedConditions = _.cloneDeep(diagnosedConditions);
    cloneDiagnosedConditions.splice(index, 1);
    setState({ diagnosedConditions: cloneDiagnosedConditions });
  };


  const clearOptions = () => {
    const cloneOption = _.cloneDeep(MEDICAL_HISTORY_DEFAULT_OPTIONS);
    _.forEach(state.atRiskConditions, (x) => {
      _.remove(cloneOption, option => option.value === x.value);
    });
    setState({ atRiskConditionsOptions: cloneOption });
  };

  const onChangePastMedication = (name, option, isRemove) => {
    const data = _.cloneDeep(state[name]) || [];
    const optionName = `${name}Options`;
    const cloneOptions = _.cloneDeep(state[optionName]) || [];
    const item = _.find(data, x => x.value === option.value);
    _.remove(cloneOptions, x => x.value === 'No results');
    if (option.isOtherOption) {
      const other = _.find(data, x => x.value?.slice(7) === option.value);
      if (!other) {
        data.push({
          value: `Other: ${option.value}`,
          label: `Other: ${option.value}`,
        });
        _.remove(cloneOptions, x => x.value === option.value);
        setState({ [name]: _.cloneDeep(data) });
        clearOptions();
        return;
      }
    } else if (!item) {
      data.push(option);
      _.remove(cloneOptions, x => x.value === option.value);
    } else if (isRemove) {
      _.remove(data, x => x.value === option.value);

      if (option.value?.includes('Other')) {
        const optionValue = option.value?.slice(7);
        const lastOther = _.find(cloneOptions, x => x.isOtherOption === true);
        if (lastOther) {
          _.remove(cloneOptions, lastOther);
        }
        cloneOptions.unshift({
          label: `Use "${optionValue}" anyway`,
          value: optionValue,
          isOtherOption: true,
        });
      } else {
        cloneOptions.push(option);
      }
    }

    setState({ [name]: _.cloneDeep(data) });
    clearOptions();
  };


  const promiseOptions = (inputValue) => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = null;
    }
    return new Promise((resolve) => {
      inputTimeout.current = setTimeout(async () => {
        const medicalHistoryData = await fetchAtRiskCondition(inputValue);
        const atRiskConditionsOptions = [];
        const additionalHistory = _.filter(MEDICAL_HISTORY_DEFAULT_OPTIONS,
          x => x.value.toLowerCase().includes(inputValue?.toLowerCase()));
        _.forEach([...medicalHistoryData, ...additionalHistory], (element) => {
          const isAddedCondition = _.find(state.atRiskConditions, y => y?.value?.toLowerCase() === element.value?.toLowerCase());
          if (!isAddedCondition && element.value !== 'Common conditions') {
            atRiskConditionsOptions.push({
              value: element.value === 'Atrial fibrillation' ? 'Atrial Fibrillation' : element.value,
              label: (
                <div className={classnames('option-item')}>
                  <span>{element.label === 'Atrial fibrillation' ? 'Atrial Fibrillation' : element.label}</span>
                </div>
              ),
            });
          }
        });
        const uniqOptions = _.sortBy(_.uniqBy(atRiskConditionsOptions, 'value'), 'value');
        if (_.isEmpty(atRiskConditionsOptions)) {
          uniqOptions.push({
            label: 'No results',
            value: 'No results',
            isDisabled: true,
          });
        }
        if (inputValue) {
          uniqOptions.unshift({
            label: `Use "${inputValue}" anyway`,
            value: inputValue,
            isOtherOption: true,
          });
        }
        const setStateObject = { pastMedicalHistoryOptions: uniqOptions };
        if (!state.valueInput) {
          clearOptions();
        } else {
          setState(setStateObject);
          resolve(uniqOptions);
        }
      }, 300);
    });
  };

  const showFooterButtons = () => {
    const isInput = type === 'INPUT';
    const rightTitle = isInput ? 'Next step' : 'Save';
    const leftTitle = isInput ? '' : 'Cancel';
    return (
      <FullWidthButtons
        rightTitle={rightTitle}
        leftTitle={leftTitle}
        disabled={isDisabledSaveBtn(state, props.patientData?.isUnLinked)}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
      />
    );
  };

  const onInputChange = (value) => {
    setState({ valueInput: value });
  };

  useEffect(() => {
    clearOptions();
  }, []);

  return (
    <>
      <div className={classnames('afib-information-wrapper', className)}>
        <div>
          <Title level={5}>
            Diagnosed conditions
          </Title>

          {
            _.map(diagnosedConditions, (x, index) => (
              <DiagnosedConditions
                className="mt16"
                key={index}
                index={index}
                data={x}
                errMes={x?.errMes}
                onChange={(key, value, isOtherOption) => onChangeDiagnosed(key, value, index, isOtherOption)}
                disabledDelete={index === 0 && diagnosedConditions?.length === 1}
                onClickDelete={onClickDeleteDiagnosed}
                selectData={getConditionsSelectData(diagnosedConditions, x?.type)}
                onChangeMultiCheckbox={onChangeMultiCheckbox}
                heartValveReplacement={heartValveReplacement}
                heartValveIssue={heartValveIssue}
                valvularHeartDisease={valvularHeartDisease}
                mitralValveStatus={mitralValveStatus}
                onHeartValeChange={onChange}
                searchBioFluxInfo={props.searchBioFluxInfo}
                patientData={props.patientData}
                diagnosedConditionsValue={x}
                diagnosedConditions={diagnosedConditions}
              />
            ))
          }

          <CustomButton
            type="primary-light"
            block
            icon={<PlusOutlined />}
            size="large"
            className="mt16"
            label="Add condition"
            onClick={onClickAddMore}
            disabled={disabledAddMore(diagnosedConditions)}
          />

          <Divider />

          <Title level={5}>
            At-risk conditions
          </Title>

          <InputTitle className="mt16" title="At-risk conditions" />
          <AsyncSelectInput
            name="atRiskConditions"
            placeholder="Search and select a condition..."
            defaultValue={state.atRiskConditions}
            value={state.atRiskConditions}
            onChange={onChangePastMedication}
            isSearchable
            loadOptions={promiseOptions}
            options={state.atRiskConditionsOptions}
            onInputChange={onInputChange}
            isValueOutside
            clearOptions={clearOptions}
            isHasOtherOption
            maxLength={65}
            onBlur={clearOptions}
          />

          {/* {
            atRiskConditions?.includes('Others') && (
              <InputCT
                className="mt8"
                value={othersConditions}
                name="othersConditions"
                placeholder="Enter condition..."
                onChange={onChange}
                errMes={atRiskConditionsErr}
                errMesClassName="div-small-incorrect-mes"
              />
            )
          } */}

          <InputCT
            className="mt16"
            title="Notes"
            type="TEXTAREA"
            value={notesAtRiskConditions}
            name="notesAtRiskConditions"
            onChange={onChangeTextArea}
            maxLength={750}
          />

          {/* <Divider />
          <Title level={5}>Heart valve status</Title>

          <SelectCT
            name="heartValveIssue"
            className="mv16"
            title="Issues"
            placeholder="Select..."
            data={HeartValveIssuseData}
            value={heartValveIssue}
            onChange={onChange}
          /> */}

          {/* {showIssueDetails()} */}
        </div>

        <div className="midle-ct" />

        {showFooterButtons()}
      </div>

      <ConfirmationLayout
        toggleClick={toggleNextErr}
        type={CONFIRMATION_LAYOUT_TYPES.INCOMPLETE_INFO}
        visible={isNextErrVisible}
        onClick={toggleNextErr}
        message="Please add at least one diagnosed condition to proceed with the next steps!"
      />
    </>
  );
};
AFIBInformation.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  diagnosedConditionsAdd: [],
  isAdd: false,
  searchBioFluxInfo: {},
  patientData: {},
  defaultData: {},
  hasDoneStep1: false,
};

AFIBInformation.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  diagnosedConditionsAdd: PropTypes.arrayOf(PropTypes.shape({})),
  isAdd: PropTypes.bool,
  searchBioFluxInfo: PropTypes.shape({}),
  patientData: PropTypes.shape(),
  defaultData: PropTypes.shape(),
  hasDoneStep1: PropTypes.bool,
};

export default AFIBInformation;
