/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Checkbox, Drawer, Radio } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import fetchGetBiofluxPatientReport from '../../../Apollo/Functions/Fetch/fetchGetBiofluxPatientReport';
import fetchMedications from '../../../Apollo/Functions/Fetch/fetchMedications';
import { CONFIRMATION_LAYOUT_TYPES } from '../../../Constants';
import { AFIB_ICD_CODES } from '../../../Constants/baseline';
import EMITTER_CONSTANTS from '../../../Constants/emitter';
import { AFibStatusQuestion } from '../../../Constants/newPatientData';
import { getFormatedPhone } from '../../../Helpers';
import auth from '../../../Helpers/auth';
import consoleLog from '../../../Helpers/consoleLog';
import { useEmitter, useMergeState } from '../../../Helpers/customHooks';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import CustomButton from '../../Button/customButton';
import NormalInput from '../../Input/NormalInput';
import NormalSelect from '../../Input/NormalSelect';
import ConfirmViaSelect from './ConfirmViaSelect';
import { renderBiofluxStatus } from './handlerUI';
import {
  acuityOptions,
  COMFIRM_VIA_OPTIONS,
  createNewDiagnosis,
  diagnosedTypeOptions,
  updateDiagnosis,
} from './helper';
import ICDSelect from './ICDSelect';
import MedicationList from './MedicationList';

import './style.scss';

const { BIOFLUX_LOADING, BIOFLUX_SUCCESS, BIOFLUX_FAILED } = AFibStatusQuestion;

const AddDiagnosisDrawer = (props) => {
  const facilityOptions = auth
    .getFacilities()
    .map(item => ({ value: item._id, label: item.name }));
  const [state, setState] = useState({
    acuity: 'UNKNOWN',
    diagnosedTypes: [],
    onsetDate: undefined,
    diagnosedDate: undefined,
    confirmedVia: undefined,
    medicationIds: [],
    note: '',
    studyId: undefined,
  });

  const [loadingState, setLoading] = useState({
    addLoading: false,
    addAnotherLoading: false,
    saveLoading: false,
    medicationLoading: false,
  });
  const [isChanged, setChanged] = useState(false);

  const [isShowConfirmLayout, setShowConfirmLayout] = useState(false);

  const [icdInfo, setIcdInfo] = useState({});

  // options
  const [associatedMedications, setAssociatedMedications] = useState([]);

  const [isUseCustomIcd, setUseCustomIcd] = useState(false);

  // check bioflux case
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [biofluxStatus, setBiofluxStatus] = useState();

  const initICD10Option = useRef();

  const isFetchMedicationRef = useRef(false);

  const resetState = () => {
    setState({
      acuity: 'UNKNOWN',
      diagnosedTypes: [],
      onsetDate: undefined,
      diagnosedDate: undefined,
      confirmedVia: undefined,
      medicationIds: [],
      note: '',
    });
    setIcdInfo({});
    if (facilityOptions.length > 1) {
      setSelectedFacility(null);
    }
    setUseCustomIcd(false);
  };

  const onChange = () => {
    if (!isChanged) {
      setChanged(true);
    }
  };

  const toggleUseCustomIcd = (value) => {
    setUseCustomIcd(value);
    onChange();
  };

  const onSelectMedication = (name, option) => {
    setState({ ...state, medicationIds: [...state.medicationIds, option.option] });
    onChange();
  };

  const onSelectBiofluxFacility = (name, option) => {
    setSelectedFacility(option.value);
    onChange();
  };

  const onChangeIcdInfo = (icd) => {
    setIcdInfo(icd);
    onChange();
  };

  const onChangeCustomIcd = (name, value) => {
    setIcdInfo({ ...icdInfo, [name]: value });
    onChange();
  };

  const onChangeInput = (name, value) => {
    onChange();
    if (name === 'acuity' && value === 'CHRONIC') {
      if (!state.diagnosedTypes.includes('Monitored')) {
        setState({
          ...state,
          diagnosedTypes: [...state.diagnosedTypes, 'Monitored'],
          [name]: value,
        });
        return;
      }
    }
    setState({ ...state, [name]: value });
  };

  const onDeleteMedication = (med) => {
    setState({
      ...state,
      medicationIds: state.medicationIds.filter(item => item.value !== med.value),
    });
    onChange();
  };

  const isDisabled = useMemo(() => _.isEmpty(icdInfo), [icdInfo]);


  const toggleLeaveModal = () => {
    setShowConfirmLayout(prev => !prev);
  };

  const toggleClick = () => {
    toggleLeaveModal();
    props.onClose();
  };

  const onClose = () => {
    if (isChanged) {
      toggleLeaveModal();
    } else {
      props.onClose();
    }
  };

  const onSave = async (type) => {
    if (type === 'ADD') {
      setLoading({ ...loadingState, addLoading: true });
    }
    if (type === 'ADD_ANOTHER') {
      setLoading({ ...loadingState, addAnotherLoading: true });
    }
    if (type === 'SAVE') {
      setLoading({ ...loadingState, saveLoading: true });
    }
    const input = {
      carePlanId: type === 'SAVE' ? undefined : props.carePlanId,
      diagnosisId: type === 'SAVE' ? props.diagnosisData._id : undefined,
      medicationIds: state.medicationIds.map(med => med.value),
      note: state.note,
      acuity: state.acuity,
      customCode: isUseCustomIcd,
      diagnosedTypes: state.diagnosedTypes.length
        ? state.diagnosedTypes.map((type) => {
          const target = diagnosedTypeOptions.find(
            option => option.value === type,
          );
          return target.label;
        })
        : [],
      confirmedVia: state.confirmedVia || undefined,
      onsetDate: state.onsetDate
        ? moment(state.onsetDate).format('YYYY-MM-DD')
        : undefined,
      diagnosedDate: state.diagnosedDate
        ? moment(state.diagnosedDate).format('YYYY-MM-DD')
        : undefined,
      studyId: biofluxStatus === BIOFLUX_SUCCESS && state.confirmedVia === 'Bioflux' ? state?.studyId || undefined : null,
    };
    if (isUseCustomIcd) {
      Object.assign(input, {
        valid: 0,
        code: icdInfo?.code || null,
        description: icdInfo.value,
      });
    } else {
      Object.assign(input, {
        valid: icdInfo.valid,
        code: icdInfo.codeNameDisplay || null,
        description: icdInfo.longDescription,
      });
    }

    let result;
    if (type === 'SAVE') {
      result = await updateDiagnosis({ _id: props.baselineId, input });
    } else {
      result = await createNewDiagnosis({ input });
    }
    if (result.isSuccess) {
      props.afterUpdateSuccess(_.cloneDeep(state), _.cloneDeep(icdInfo));
      if (type === 'ADD' || type === 'SAVE') {
        props.onClose();
      }
      resetState();
      setChanged(false);
    }
    setLoading({
      addLoading: false,
      addAnotherLoading: false,
      saveLoading: false,
    });
  };

  const getAssociatedMedications = async () => {
    setLoading({ ...loadingState, medicationLoading: true });
    const result = await fetchMedications({
      filter: {
        carePlanId: props.carePlanId,
        type: 'PRESCRIPTION',
        sortField: 'PRESCRIBE_AT',
        sortOrder: 'asc',
        currentDate: moment().toISOString(),
      },
      limit: 999,
    });
    isFetchMedicationRef.current = true;
    if (result.isSuccess) {
      const convertToLabelValueMedication = result.medications.map(med => ({ value: med._id, label: med.name }));
      setAssociatedMedications(convertToLabelValueMedication);
    }
    setLoading({ ...loadingState, medicationLoading: false });
  };

  const checkBioflux = async () => {
    setBiofluxStatus(BIOFLUX_LOADING);
    const sendingData = {
      input: {
        facilityId: props.patientData.facilityId,
        biofluxFacility: selectedFacility?.value || selectedFacility,
        firstName: props.patientData.firstName,
        lastName: props.patientData.lastName,
        dob: props.patientData.dateOfBirth || undefined,
        phone: props.patientData.phone ? getFormatedPhone(props.patientData.phone) : undefined,
      },
    };
    try {
      const studyId = await fetchGetBiofluxPatientReport(sendingData);
      if (studyId) {
        setState({ ...state, studyId });
        setBiofluxStatus(BIOFLUX_SUCCESS);
        return;
      }
      setBiofluxStatus(BIOFLUX_FAILED);
    } catch (error) {
      consoleLog('Failed to check bioflux patient report', error);
      setBiofluxStatus(BIOFLUX_FAILED);
    }
  };
  const handleUpdateListener = (data) => {
    const { carePlan, _id } = data;
    if (carePlan === props.carePlanId || _id === props.carePlanId) {
      getAssociatedMedications();
    }
  };

  useEffect(() => {
    if (facilityOptions.length === 1) {
      setSelectedFacility(facilityOptions[0]);
    }
  }, []);

  useEffect(() => {
    if (props.open) {
      if (!associatedMedications.length && !isFetchMedicationRef.current) {
        getAssociatedMedications();
      }
      if (!_.isEmpty(props.diagnosisData)) {
        setState({
          ...props.diagnosisData,
          diagnosedTypes: props.diagnosisData.diagnosedTypes.length
            ? props.diagnosisData.diagnosedTypes.map((type) => {
              const target = diagnosedTypeOptions.find(
                option => option.label === type,
              );
              return target.value;
            })
            : [],
          medicationIds: associatedMedications.filter(med => props.diagnosisData.associatedMedications.find(name => med.label === name)),
        });
        const tmpICDInfo = props.diagnosisData.customCode ? {
          code: props.diagnosisData.code,
          isCustom: true,
          valid: props.diagnosisData.valid,
          value: props.diagnosisData.description,
        }
          : {
            codeNameDisplay: props.diagnosisData.code,
            isCustom: false,
            valid: props.diagnosisData.valid,
            longDescription: props.diagnosisData.description,
            shortDescription: props.diagnosisData.description,
            label: `(${props.diagnosisData.code}) ${props.diagnosisData.description}`,
          };
        setIcdInfo(tmpICDInfo);
        setUseCustomIcd(props.diagnosisData.customCode);
        const { biofluxReport } = props.diagnosisData || {};
        if (!_.isEmpty(biofluxReport)) {
          const facility = _.find(facilityOptions, x => x.label === biofluxReport?.facilityName);
          setSelectedFacility(facility);
        }
      }
    } else {
      props.clearEdittingDiagnosisRef();
      resetState();
      setChanged(false);
    }
  }, [props.open, associatedMedications, isFetchMedicationRef.current]);

  useEffect(() => {
    if (
      !_.isEmpty(icdInfo)
      && !icdInfo.isCustom
      && state.confirmedVia === 'Bioflux'
      && AFIB_ICD_CODES.includes(icdInfo.codeNameDisplay)
      && !_.isEmpty(selectedFacility)
    ) {
      checkBioflux();
    }
  }, [icdInfo, state.confirmedVia, selectedFacility]);

  useEmitter(EMITTER_CONSTANTS.ON_ADD_MEDICATION, handleUpdateListener, [props.carePlanId]);
  useEmitter(EMITTER_CONSTANTS.ON_UPDATE_MEDICATION, handleUpdateListener, [props.carePlanId]);
  useEmitter(EMITTER_CONSTANTS.ON_PRESCRIPTION, handleUpdateListener, [props.carePlanId]);
  useEmitter(EMITTER_CONSTANTS.ON_MEDICATION_DELETED, handleUpdateListener, [props.carePlanId]);

  return (
    <>
      <Drawer
        className={classnames('diagnosis-drawer', props.className)}
        visible={props.open}
        title={
          !_.isEmpty(props.diagnosisData) ? 'Edit diagnosis' : 'Add diagnosis'
        }
        onClose={onClose}
        maskClosable={false}
      >
        <ICDSelect
          className="icd-select"
          isUseCustomIcd={isUseCustomIcd}
          icdInfo={icdInfo}
          open={props.open}
          onChangeIcdInfo={onChangeIcdInfo}
          onChangeCustomIcd={onChangeCustomIcd}
          toggleUseCustomIcd={toggleUseCustomIcd}
        />
        <div className="diagnosis-row acuity">
          <div className="title">Acuity</div>
          <div className="acuity-type">
            <Radio.Group
              options={acuityOptions}
              name="acuity"
              onChange={event => onChangeInput('acuity', event.target.value)}
              value={state.acuity}
            />
          </div>
        </div>
        <div className="diagnosis-row icd-type">
          <div className="title">Flag</div>
          <div className="flag">
            <Checkbox.Group
              options={['Monitored', 'At-risk', 'Historical']}
              value={state.diagnosedTypes}
              name="diagnosedTypes"
              onChange={checkedValue => onChangeInput('diagnosedTypes', checkedValue)
              }
            />
          </div>
        </div>
        <NormalInput
          className="diagnosis-row onset-date"
          name="onsetDate"
          type="date"
          title="On-set date"
          onChange={onChangeInput}
          disabledDate={current => current.isAfter(moment())}
          value={state.onsetDate ? moment(state.onsetDate) : undefined}
          placeholder="Select..."
        />
        <NormalInput
          className="diagnosis-row diagnosis-date"
          name="diagnosedDate"
          type="date"
          title="Diagnosis date"
          disabledDate={current => current.isAfter(moment())}
          onChange={onChangeInput}
          value={state.diagnosedDate ? moment(state.diagnosedDate) : undefined}
          placeholder="Select..."
        />

        <ConfirmViaSelect
          className="diagnosis-row confirm-via"
          value={state.confirmedVia}
          onChangeInput={onChangeInput}
        />

        {state.confirmedVia
          && state.confirmedVia === 'Bioflux'
          && !_.isEmpty(icdInfo)
          && !icdInfo.isCustom
          && AFIB_ICD_CODES.includes(icdInfo.codeNameDisplay)
          && (facilityOptions.length === 1 ? (
            <></>
          ) : (
            <>
              <NormalSelect
                className="diagnosis-row"
                name="selectedFacility"
                title="Search and select the facility providing the heart study using Bioflux device."
                placeholder="Select..."
                options={facilityOptions}
                value={selectedFacility}
                onChange={onSelectBiofluxFacility}
                isObject
              />
            </>
          ))}
        {biofluxStatus
          && !_.isEmpty(selectedFacility)
          && state.confirmedVia === 'Bioflux'
          && AFIB_ICD_CODES.includes(icdInfo.codeNameDisplay)
          && renderBiofluxStatus(biofluxStatus)}
        <NormalSelect
          className="diagnosis-row asso-medi"
          name="medicationIds"
          title="Associated medications"
          placeholder="Select..."
          options={associatedMedications?.filter(med => !state?.medicationIds?.find(item => med.value === item.value))}
          value={null}
          onChange={onSelectMedication}
          isObject
          loading={loadingState.medicationLoading}
          disabled={loadingState.medicationLoading}
        />
        <MedicationList
          medications={state.medicationIds}
          onDeleteMedication={onDeleteMedication}
        />
        <NormalInput
          className="diagnosis-row notes"
          name="note"
          type="textarea"
          title="Notes"
          placeholder="Notes..."
          value={state.note}
          onChange={onChangeInput}
          maxLength={120}
        />
        <div className="diagnosis-footer">
          {_.isEmpty(props.diagnosisData) ? (
            <>
              <CustomButton
                className="diagnosis-footer-btn"
                label="Save & add another"
                disabled={isDisabled}
                onClick={() => onSave('ADD_ANOTHER')}
              />
              <CustomButton
                className="diagnosis-footer-btn"
                label="Add"
                type="primary"
                onClick={() => onSave('ADD')}
                disabled={isDisabled}
              />
            </>
          ) : (
            <CustomButton
              className="diagnosis-footer-btn"
              label="Save"
              type="primary"
              onClick={() => onSave('SAVE')}
              disabled={isDisabled}
            />
          )}
        </div>
      </Drawer>
      <ConfirmationLayout
        type={CONFIRMATION_LAYOUT_TYPES.LEAVE}
        visible={isShowConfirmLayout}
        toggleClick={toggleClick}
        onClick={toggleLeaveModal}
      />
    </>
  );
};

AddDiagnosisDrawer.defaultProps = {
  className: undefined,
  open: true,
  diagnosisData: {},
  carePlanId: undefined,
  baselineId: undefined,
  onClose: () => { },
  clearEdittingDiagnosisRef: () => { },
  afterUpdateSuccess: () => { },
  patientData: {},
};

AddDiagnosisDrawer.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** drawer visible */
  open: PropTypes.bool,
  /** diagnosis data */
  diagnosisData: PropTypes.shape(),
  /** carePlanId */
  carePlanId: PropTypes.string,
  /** baseline Id */
  baselineId: PropTypes.string,
  /** patient data */
  patientData: PropTypes.shape(),
  /** close drawer event */
  onClose: PropTypes.func,
  /** clear */
  clearEdittingDiagnosisRef: PropTypes.func,
  /** call back after update successfuly */
  afterUpdateSuccess: PropTypes.func,
};

export default AddDiagnosisDrawer;
