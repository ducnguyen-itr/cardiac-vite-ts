/* eslint-disable no-restricted-globals */
import { Radio } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../Button/customButton';

import NormalInput from '../../../Input/NormalInput';
import NormalSelect from '../../../Input/NormalSelect';
import {
  calculateFRSScrore, checkIsValidFrs, GENDER_OPTIONS, handleAddFRSFormData, handleDisabledSaveFRSForm, RISK_ASSESSMENT,
} from '../helper';
import './style.scss';

const FRSForm = (props) => {
  const [state, setState] = useState({
    age: undefined,
    bloodTreatedMedicines: false,
    gender: 'Male',
    hdlCholesterol: undefined,
    smoker: false,
    systolicBP: undefined,
    totalCholesterol: undefined,
    ageError: '',
  });

  const [summaryScore, setSummaryScore] = useState({
    totalScore: -1, cvgRisk: -1, heartRate: -1, risk: -1,
  });

  const onChangeRadio = (event) => {
    setState({ ...state, [event.target.name]: event.target.value, ageError: '' });
    props.onChange();
  };

  const onChangeInput = (name, value) => {
    setState({ ...state, [name]: value, ageError: '' });
    props.onChange();
  };

  const onChangeSelect = (name, option) => {
    setState({ ...state, [name]: option.value, ageError: '' });
    props.onChange();
  };
  const checkIsValidFrs = (state) => {
    if (state?.age < 30 || state.age > 79) {
      setState({ ...state, ageError: 'Invalid value' });
      return false;
    }
    return true;
  };

  const onSaveAndAddAnother = async () => {
    const isValid = checkIsValidFrs(state);
    if (!isValid) {
      return;
    }
    props.onAdd({ type: RISK_ASSESSMENT.FRS, data: handleAddFRSFormData({ state }), isAddAnother: true });
  };


  const onAdd = async () => {
    const isValid = checkIsValidFrs(state);
    if (!isValid) {
      return;
    }
    props.onAdd({ type: RISK_ASSESSMENT.FRS, data: handleAddFRSFormData({ state }) });
  };

  const onSave = async () => {
    const isValid = checkIsValidFrs(state);
    if (!isValid) {
      return;
    }
    props.onSave({ type: RISK_ASSESSMENT.FRS, data: handleAddFRSFormData({ state }) });
  };

  useEffect(() => {
    const frsScore = calculateFRSScrore({ ...state });
    setSummaryScore(frsScore);
    // if (!isNaN(parseInt(state.age, 0)) && !isNaN(parseInt(state.hdlCholesterol, 0)) && !isNaN(parseInt(state.systolicBP, 0)) && !isNaN(parseInt(state.totalCholesterol, 0))) {
    // } else {
    //   setSummaryScore({
    //     totalScore: -1, cvgRisk: -1, heartRate: -1, risk: -1,
    //   });
    // }
  }, [state]);

  useEffect(() => {
    if (!_.isEmpty(props.FRSData)) {
      setState({ ...props.FRSData });
    } else {
      setState({ ...state, gender: props?.gender || 'Male', age: props?.age });
    }
  }, [props.FRSData]);

  return (
    <div className={classnames('frs-form', props.className)}>
      <div className="frs-row">
        Ensure the patient aged 30-79 years with no prior history of coronary heart disease, no intermittent claudication or diabetes
      </div>
      <div className="frs-row frs-flex-row">
        <NormalSelect
          className="frs-row-item frs-row-half"
          name="gender"
          title="Gender"
          isObject
          options={GENDER_OPTIONS}
          onChange={onChangeSelect}
          value={state.gender}
          placeholder="Select..."
        />
        <NormalInput
          className="frs-row-item frs-row-half"
          name="age"
          title="Age"
          value={state.age}
          isNumeric
          onChange={onChangeInput}
          placeholder="--"
          errMsg={state.ageError}
        />
      </div>
      <div className="frs-row">
        <div className="title">
          Smoker
        </div>
        <Radio.Group name="smoker" value={state.smoker} onChange={onChangeRadio}>
          <Radio value={false}>No</Radio>
          <Radio value>Yes</Radio>
        </Radio.Group>
      </div>
      <div className="frs-row">
        <NormalInput
          name="totalCholesterol"
          title="Total cholesterol (mmol/L)"
          placeholder="--"
          isNumeric
          value={state.totalCholesterol}
          onChange={onChangeInput}
        />
      </div>
      <div className="frs-row">
        <NormalInput
          name="hdlCholesterol"
          title="HDL cholesterol (mmol/L)"
          placeholder="--"
          isNumeric
          value={state.hdlCholesterol}
          onChange={onChangeInput}
        />
      </div>
      <div className="frs-row">
        <NormalInput
          name="systolicBP"
          title="Systolic BP (mmHg)"
          placeholder="--"
          isNumeric
          value={state.systolicBP}
          onChange={onChangeInput}
        />
      </div>
      <div className="frs-row">
        <div className="title">
          Blood pressure being treated with medicines
        </div>
        <Radio.Group name="bloodTreatedMedicines" value={state.bloodTreatedMedicines} onChange={onChangeRadio}>
          <Radio value={false}>No</Radio>
          <Radio value>Yes</Radio>
        </Radio.Group>
      </div>
      <div className="frs-summary">
        {(summaryScore)
          && (
            <>
              <div className="frs-summary-score total">
                <div className="title">
                  Total score:
                </div>
                <div className="value">
                  {summaryScore.totalScore === -1 ? '--' : summaryScore.totalScore}
                </div>
              </div>
              <div className="frs-summary-score">
                <div className="title">
                  10 year CVD risk (%)
                </div>
                <div className="value">
                  {summaryScore.cvgRisk === -1 ? '--' : summaryScore.cvgRisk}
                </div>
              </div>
              <div className="frs-summary-score">
                <div className="title">
                  Heart age (years)
                </div>
                <div className="value">
                  {summaryScore.heartRate === -1 ? '--' : summaryScore.heartRate}
                </div>
              </div>
              <div className="frs-summary-score">
                <div className="title">
                  Risk
                </div>
                <div className="value">
                  {summaryScore.risk === -1 ? '--' : summaryScore.risk}
                </div>
              </div>
            </>
          )}
      </div>
      <div className="frs-footer">
        {_.isEmpty(props.FRSData) ? (
          <>
            <CustomButton
              className="frs-footer-btn"
              label="Save & add another"
              onClick={onSaveAndAddAnother}
              disabled={handleDisabledSaveFRSForm(props.FRSData, state)}
              loading={props?.loading?.saveAndAddAnother}
              type="primary"
              ghost
            />
            <CustomButton
              className="frs-footer-btn"
              label="Add"
              type="primary"
              onClick={onAdd}
              disabled={handleDisabledSaveFRSForm(props.FRSData, state)}
              loading={props?.loading?.add}
            />
          </>
        ) : (
          <CustomButton
            className="frs-footer-btn"
            label="Save"
            type="primary"
            disabled={handleDisabledSaveFRSForm(props.FRSData, state, true)}
            onClick={onSave}
            loading={props?.loading?.save}
          />
        )}
      </div>
    </div>
  );
};

FRSForm.defaultProps = {
  className: undefined,
  gender: undefined,
  age: undefined,
  FRSData: {},
  loading: {},
  onAdd: () => { },
  onSave: () => { },
  onChange: () => { },
};

FRSForm.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** gender */
  gender: PropTypes.string,
  /** age */
  age: PropTypes.number,
  /** FRS Data */
  FRSData: PropTypes.shape(),
  /** loading */
  loading: PropTypes.shape(),
  /** add event */
  onAdd: PropTypes.func,
  /** save event */
  onSave: PropTypes.func,
  /** change event */
  onChange: PropTypes.func,
};

export default FRSForm;
