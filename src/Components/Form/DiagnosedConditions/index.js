import {
  CalendarOutlined, CheckCircleOutlined, CloseCircleFilled, CloseOutlined, LoadingOutlined,
} from '@ant-design/icons';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import {
  AfibConfirmData, MitralValveStatusData, ValvularHeartDiseaseData,
} from '../../../Constants';
import { BASELINE_DIAGNOSED_CONDITIONS_TYPE, BASELINE_PATTERNS, MEDICAL_HISTORY_DEFAULT_OPTIONS } from '../../../Constants/baseline';
import { AFibStatusQuestion } from '../../../Constants/newPatientData';
import auth from '../../../Helpers/auth';
import { useMergeState } from '../../../Helpers/customHooks';
import { getStudyIdAndStatus } from '../../../Pages/Patients/CreateNewPatient/helper';
import { fetchMedicalCondition } from '../../../Pages/Patients/CreateNewPatient/NewPatientStep2/helper';
import CustomButton from '../../Button/customButton';
import AsyncSelectInput from '../../Input/asyncSelect';
import DatePickerCT from '../../Input/datepickerCT';
import InputCT from '../../Input/inputCT';
import InputTitle from '../../Input/inputTitle';
import MultipleCheckbox from '../../Input/multipleCheckbox';
import SelectCT from '../../Input/selectCT';

const {
  BIOFLUX_LOADING, BIOFLUX_LOADING_MSG,
  BIOFLUX_SUCCESS, BIOFLUX_SUCCESS_MSG,
  BIOFLUX_FAILED, BIOFLUX_FAILED_MSG,
} = AFibStatusQuestion;

const DiagnosedConditions = (props) => {
  const inputTimeout = useRef();
  const isFacilities = auth.isFacilities();
  const facilitiesData = _.map(auth.getFacilities() || [], x => x.name);
  const [state, setState] = useMergeState({
    biofluxFacilityId: null,
    biofluxStatus: '',
    biofluxService: null,
    pastMedicalHistory: props.data?.type || '',
    pastMedicalHistoryOptions: MEDICAL_HISTORY_DEFAULT_OPTIONS,
  });

  const { biofluxFacilityId, biofluxStatus, biofluxService } = state;
  const {
    className, data, index, onChange, disabledDelete, onClickDelete,
    selectData, heartValveIssue, valvularHeartDisease, mitralValveStatus,
    onChangeMultiCheckbox, heartValveReplacement, onHeartValeChange,
    patientData,
  } = props;
  const { isUnLinked } = patientData;
  const {
    type, pattern, onsetDate, confirmedVia,
    othersConditions,
    // flag,
  } = data;

  const handleCheckBiofluxPatientReport = async (isFacilities = false) => {
    // if (isUnLinked) {
    //   setState({ biofluxStatus: BIOFLUX_FAILED });
    //   onChange('biofluxStatus', BIOFLUX_FAILED);
    //   return;
    // }
    // auth.getFactilities() return biofluxFactility.
    const facilityId = _.find(auth.getFacilities() || [], x => x.name === props.searchBioFluxInfo?.facility)?._id;
    const biofluxFacilityId = isFacilities ? state.biofluxFacilityId : facilityId;
    if (!isFacilities) {
      onChange('facility', facilityId);
    }
    const res = await getStudyIdAndStatus(props.searchBioFluxInfo, facilityId, biofluxFacilityId);
    if (res?.studyId) {
      onChange('studyId', res?.studyId);
    }
    onChange('biofluxStatus', res?.biofluxStatus);
    setState(res);
  };

  const onChangeConfirmVia = (name, value) => {
    if (type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.AtrialFibrillation && value === 'Bioflux' && !isFacilities) {
      handleCheckBiofluxPatientReport(!isFacilities);
    }
    onChange(name, value);
  };

  useEffect(() => {
    if (state.biofluxFacilityId) {
      handleCheckBiofluxPatientReport(isFacilities);
    }
  }, [state.biofluxFacilityId]);

  useEffect(() => {
    if (type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.AtrialFibrillation && confirmedVia === 'Bioflux') {
      const biofluxFacilities = auth.getFacilities();
      if (biofluxFacilities.length === 1) {
        const targetBiofluxFacity = _.find(biofluxFacilities || [], x => x.name === props.searchBioFluxInfo?.facility)?._id;
        setState({
          biofluxStatus: BIOFLUX_LOADING,
          facilityId: targetBiofluxFacity?._id,
          biofluxService: targetBiofluxFacity?.name,
        });

        onChange('facility', targetBiofluxFacity?._id);
        handleCheckBiofluxPatientReport();
      }
    }
  }, [type, confirmedVia]);

  const onChangeSelectBiofluxFacility = (key, value) => {
    const biofluxFacilities = auth.getFacilities();
    const targetBiofluxFacities = _.find(biofluxFacilities, biofluxFacility => biofluxFacility?.name === value);
    if (key === 'biofluxService') {
      setState({
        [key]: targetBiofluxFacities?.name,
        biofluxFacilityId: targetBiofluxFacities?._id || '',
        biofluxStatus: BIOFLUX_LOADING,
        chestPainTimePerWeekErr: '',
      });
      onChange('facility', targetBiofluxFacities?._id);
    }
  };


  const clearOptions = () => {
    const cloneOption = _.cloneDeep(MEDICAL_HISTORY_DEFAULT_OPTIONS);
    _.forEach(props.diagnosedConditions, (x) => {
      _.remove(cloneOption, option => option.value?.toLowerCase() === x.type?.toLowerCase());
    });
    setState({ pastMedicalHistoryOptions: cloneOption });
  };
  const onChangePastMedication = (name, option) => {
    if (option?.isOtherOption) {
      setState({ [name]: 'Other' });
      clearOptions();
      props.onChange('type', option?.value, option?.isOtherOption);
      return;
    }
    setState({ [name]: option?.value });
    clearOptions();
    props.onChange('type', option?.value, option?.isOtherOption);
  };


  const promiseOptions = (inputValue) => {
    if (inputTimeout.current) {
      clearTimeout(inputTimeout.current);
      inputTimeout.current = null;
    }
    return new Promise((resolve) => {
      inputTimeout.current = setTimeout(async () => {
        const medicalHistoryData = await fetchMedicalCondition(inputValue);
        const pastMedicalHistoryOptions = [];
        const additionalHistory = _.filter(MEDICAL_HISTORY_DEFAULT_OPTIONS,
          x => x.value.toLowerCase().includes(inputValue?.toLowerCase()));
        _.forEach([...medicalHistoryData, ...additionalHistory], (element) => {
          const isHasValue = _.find(props.diagnosedConditions, x => x.type?.toLowerCase() === element.value?.toLowerCase());
          if (!state.pastMedicalHistory?.includes(element.value) && !isHasValue && element.value !== 'Common conditions') {
            pastMedicalHistoryOptions.push({
              value: element.value === 'Atrial fibrillation' ? 'Atrial Fibrillation' : element.value,
              label: (
                <div className={classnames('option-item')}>
                  <span>{element.label === 'Atrial fibrillation' ? 'Atrial Fibrillation' : element.label}</span>
                </div>
              ),
            });
          }
        });
        const uniqOptions = _.sortBy(_.uniqBy(pastMedicalHistoryOptions, 'value'), 'value');
        if (_.isEmpty(pastMedicalHistoryOptions)) {
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

  const onInputChange = (value) => {
    setState({ valueInput: value });
    if (_.isEmpty(value)) {
      props.onChange('type', '');
    }
  };

  useEffect(() => {
    clearOptions();
  }, [props.diagnosedConditions]);


  useEffect(() => {
    if (props.data?.bioflux?.facilityName) {
      onChange('facility', props.data?.bioflux?.facilityName);
      const facilityId = _.find(auth.getFacilities() || [], x => x.name === props.data?.bioflux?.facilityName)?._id;
      setState({ biofluxService: _.cloneDeep(props.data?.bioflux?.facilityName), biofluxFacilityId: facilityId });
    }
  }, [props.data?.bioflux?.facilityName]);

  useEffect(() => {
    setState({ pastMedicalHistory: props.data?.type || '' });
  }, [props.data]);

  const showIssueDetails = (key) => {
    switch (key) {
      case '1':
        return (
          <SelectCT
            name="valvularHeartDisease"
            className="mt16"
            title="Valvular heart disease"
            placeholder="Select..."
            data={ValvularHeartDiseaseData}
            value={valvularHeartDisease}
            onChange={onHeartValeChange}
          />
        );
      case '2':
        return (
          <>
            <MultipleCheckbox
              className="mt16"
              title="Which valve?"
              data={heartValveReplacement}
              onChange={(obj, x) => onChangeMultiCheckbox('heartValveReplacement', obj, x)}
            />
            <SelectCT
              name="mitralValveStatus"
              className="mt16"
              title="Mitral valve status"
              placeholder="Select..."
              data={MitralValveStatusData}
              value={mitralValveStatus}
              onChange={onHeartValeChange}
            />
          </>
        );
      default:
        return null;
    }
  };


  const renderAddition = () => {
    switch (type) {
      case BASELINE_DIAGNOSED_CONDITIONS_TYPE.AtrialFibrillation:
        return (
          <div className="diagnosed-extra-input">
            <SelectCT
              name="pattern"
              title="Atrial Fibrillation pattern"
              placeholder="Select..."
              data={BASELINE_PATTERNS}
              value={pattern}
              onChange={onChange}
            />
          </div>
        );
      case BASELINE_DIAGNOSED_CONDITIONS_TYPE.Other:
        return (
          <div className="diagnosed-extra-input">
            <InputCT
              name="othersConditions"
              placeholder="Enter condition..."
              value={othersConditions}
              onChange={onChange}
              errMes={props.errMes}
              errMesClassName="div-small-incorrect-mes"
              maxLengthInput={65}
            />
          </div>
        );
      case BASELINE_DIAGNOSED_CONDITIONS_TYPE.ValvularHeartDisease:
        return (
          <div className="diagnosed-extra-input">
            {showIssueDetails('1')}
          </div>
        );
      case BASELINE_DIAGNOSED_CONDITIONS_TYPE.HeartValveReplaceMent:
        return (
          <div className="diagnosed-extra-input">
            {/* <SelectCT
              name="heartValveIssue"
              className="mv8"
              title="Issues"
              placeholder="Select..."
              data={HeartValveIssuseData}
              value={heartValveIssue}
              onChange={onHeartValeChange}
            /> */}
            {showIssueDetails('2')}
          </div>
        );
      default:
        return null;
    }
  };


  const renderBiofluxStatus = () => {
    let biofluxMsg = '';
    let icon = <></>;
    let msgClassName = 'bioflux-msg';
    switch (biofluxStatus) {
      case BIOFLUX_LOADING:
        biofluxMsg = BIOFLUX_LOADING_MSG;
        icon = <LoadingOutlined className="bioflux-loading-icon" />;
        msgClassName += ' bioflux-msg-loading';
        break;
      case BIOFLUX_SUCCESS:
        biofluxMsg = BIOFLUX_SUCCESS_MSG;
        icon = <CheckCircleOutlined className="bioflux-success-icon" />;
        msgClassName += ' bioflux-msg-success';
        break;
      case BIOFLUX_FAILED:
        biofluxMsg = BIOFLUX_FAILED_MSG;
        icon = <CloseCircleFilled className="bioflux-failed-icon" />;
        msgClassName += ' bioflux-msg-failed';
        break;
      default:
        break;
    }
    return (
      <div className="bioflux-msg-container">
        {icon}
        <div className={msgClassName}>
          <span>{biofluxMsg}</span>
        </div>
      </div>
    );
  };

  const renderViaBioflux = () => {
    switch (type) {
      case BASELINE_DIAGNOSED_CONDITIONS_TYPE.AtrialFibrillation:
        return (
          <div>
            {
              type === BASELINE_DIAGNOSED_CONDITIONS_TYPE.AtrialFibrillation && confirmedVia === 'Bioflux' && (

                <>
                  {isFacilities && (
                    <SelectCT
                      className="mt8"
                      title="Search and select the facility providing the heart study using Bioflux device."
                      name="biofluxService"
                      data={facilitiesData}
                      placeholder="Select facility"
                      value={biofluxService}
                      onChange={onChangeSelectBiofluxFacility}
                      showSearch={false}
                    />
                  )}
                  {biofluxStatus && renderBiofluxStatus()}
                </>
              )
            }
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={classnames('diagnosed-conditions', className)}>

      <div className="diagnosed-conditions-index">
        <span>{`#${index + 1}`}</span>

        <CustomButton
          // disabled={disabledDelete}
          className="diagnosed-conditions-index-btn"
          icon={<CloseOutlined />}
          onClick={() => onClickDelete(index)}
        />
      </div>

      <div className="diagnosed-conditions-body">
        {/* <SelectCT
          name="type"
          // className="mt16"
          title="Diagnosed conditions"
          placeholder="Select..."
          data={selectData}
          value={type}
          onChange={onChange}
        /> */}
        <InputTitle title="Diagnosed conditions" />
        <AsyncSelectInput
          name="pastMedicalHistory"
          placeholder="Search and select a condition..."
          value={state.pastMedicalHistory}
          onChange={onChangePastMedication}
          isSearchable
          loadOptions={promiseOptions}
          options={state.pastMedicalHistoryOptions}
          onInputChange={onInputChange}
          clearOptions={clearOptions}
          onBlur={clearOptions}
          maxLength={65}
          isInputLabel
        />

        {renderAddition()}

        <DatePickerCT
          name="onsetDate"
          className="mt16"
          title="Onset date"
          value={onsetDate}
          onChange={onChange}
          disabledDate="PAST"
          suffixIcon={<CalendarOutlined />}
          disabled={!type}
        />

        <SelectCT
          name="confirmedVia"
          className="mt16"
          title="Confirmed via"
          placeholder="Select..."
          data={AfibConfirmData}
          value={confirmedVia}
          onChange={onChangeConfirmVia}
          disabled={!type}
        />
        {renderViaBioflux()}
      </div>

    </div>
  );
};
DiagnosedConditions.defaultProps = {
  className: '',
  errMes: '',
  data: {},
  index: 0,
  onChange: () => { },
  disabledDelete: false,
  onClickDelete: () => { },
  selectData: [],
  onChangeMultiCheckbox: () => { },
  onHeartValeChange: () => { },
  heartValveReplacement: [],
  heartValveIssue: undefined,
  valvularHeartDisease: null,
  mitralValveStatus: null,
  searchBioFluxInfo: {},
  patientData: {},
  diagnosedConditions: [],
};
DiagnosedConditions.propTypes = {
  className: PropTypes.string,
  errMes: PropTypes.string,
  data: PropTypes.shape(),
  index: PropTypes.number,
  onChange: PropTypes.func,
  disabledDelete: PropTypes.bool,
  onClickDelete: PropTypes.func,
  selectData: PropTypes.arrayOf(PropTypes.string),
  onChangeMultiCheckbox: PropTypes.func,
  heartValveReplacement: PropTypes.arrayOf(PropTypes.shape({})),
  heartValveIssue: PropTypes.string,
  valvularHeartDisease: PropTypes.string,
  mitralValveStatus: PropTypes.string,
  onHeartValeChange: PropTypes.func,
  searchBioFluxInfo: PropTypes.shape({}),
  patientData: PropTypes.shape(),
  diagnosedConditions: PropTypes.arrayOf(),
};
export default DiagnosedConditions;
