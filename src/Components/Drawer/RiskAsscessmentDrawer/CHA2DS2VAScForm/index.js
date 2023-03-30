import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import CustomButton from '../../../Button/customButton';
import {
  calculateCha2ds2vascScore, CHA2DS2VASc, handleAddCha2ds2vascData, handleDisabledSaveCha2ds2vasc, RISK_ASSESSMENT, RISK_ASSESSMENT_ENUM,
} from '../helper';
import MultiCheckbox from '../MultiCheckbox';
import './style.scss';

const CHA2DS2VAScForm = (props) => {
  const [cha2ds2vasc, setCha2ds2vasc] = useState([]);
  const [summaryScore, setSummaryScore] = useState();

  const onChange = (event) => {
    const clonedState = _.cloneDeep(cha2ds2vasc);
    const findTargetIndex = clonedState.findIndex(item => item.key === event.target.name);
    const age1Index = clonedState.findIndex(item => item.key === 'age1');
    const age2Index = clonedState.findIndex(item => item.key === 'age2');
    if (clonedState[findTargetIndex].key === 'age1') {
      if (clonedState[age2Index].isChecked) {
        clonedState[findTargetIndex].isChecked = event.target.checked;
        clonedState[age2Index].isChecked = !event.target.checked;
      }
    }
    if (clonedState[findTargetIndex].key === 'age2') {
      if (clonedState[age1Index].isChecked) {
        clonedState[findTargetIndex].isChecked = event.target.checked;
        clonedState[age1Index].isChecked = !event.target.checked;
      }
    }
    clonedState[findTargetIndex].isChecked = event.target.checked;
    setCha2ds2vasc(clonedState);
    setSummaryScore(calculateCha2ds2vascScore(clonedState));
    props.onChange();
  };

  const onSaveAndAddAnother = async () => {
    props.onAdd({ type: RISK_ASSESSMENT.CHA2DS2VASc, data: handleAddCha2ds2vascData({ cha2ds2vasc }), isAddAnother: true });
  };

  const onAdd = async () => {
    props.onAdd({ type: RISK_ASSESSMENT_ENUM.CHA2DS2VASc, data: handleAddCha2ds2vascData({ cha2ds2vasc }) });
  };

  const onSave = async () => {
    props.onSave({ type: RISK_ASSESSMENT_ENUM.CHA2DS2VASc, data: handleAddCha2ds2vascData({ cha2ds2vasc }) });
  };

  useEffect(() => {
    // data will receive the object with format like response
    if (!_.isEmpty(props.cha2ds2vascData)) {
      const data = CHA2DS2VASc.map(item => ({
        ...item,
        isChecked: props.cha2ds2vascData[item.key],
      }));
      setCha2ds2vasc(data);
      setSummaryScore(calculateCha2ds2vascScore(data));
    } else {
      let data;
      if (!props.isEditing) {
        const { age, gender } = props.patientData;
        data = CHA2DS2VASc.map((item) => {
          let isChecked = false;
          if (item.key === 'age2' && age >= 75) {
            isChecked = true;
          }
          if (item.key === 'age1' && age >= 65 && age <= 74) {
            isChecked = true;
          }
          if (item.key === 'sexFemale' && gender === 'Female') {
            isChecked = true;
          }
          return {
            ...item,
            isChecked,
          };
        });
      } else {
        data = CHA2DS2VASc.map(item => ({
          ...item,
          isChecked: false,
        }));
      }
      setCha2ds2vasc(data);
      setSummaryScore(calculateCha2ds2vascScore(data));
    }
  }, [props.cha2ds2vascData, props.isEditing, props.patientData]);
  return (
    <div className={classnames('cha2ds2vasc-form', props.className)}>
      <MultiCheckbox data={cha2ds2vasc} onChange={onChange} />
      <div className="cha2ds2vasc-summary">
        {summaryScore
          && (
            <>
              <div className="cha2ds2vasc-summary-score total">
                <div className="title">
                  Total score:
                </div>
                <div className="value">
                  {summaryScore.totalScore}
                </div>
              </div>
              <div className="cha2ds2vasc-summary-score">
                <div className="title">
                  CHA2DS2-VASc clinical risk estimation (%)
                </div>
                <div className="value">
                  {`${summaryScore.finalScore}%`}
                </div>
              </div>

            </>
          )}
      </div>
      <div className="cha2ds2vasc-footer">
        {_.isEmpty(props.cha2ds2vascData) ? (
          <>
            <CustomButton
              className="cha2ds2vasc-footer-btn"
              label="Save & add another"
              onClick={onSaveAndAddAnother}
              loading={props?.loading?.saveAndAddAnother}
              type="primary"
              ghost
            />
            <CustomButton
              className="cha2ds2vasc-footer-btn"
              label="Add"
              type="primary"
              onClick={onAdd}
              loading={props?.loading?.add}
            />
          </>
        ) : (
          <CustomButton
            className="cha2ds2vasc-footer-btn"
            label="Save"
            type="primary"
            disabled={handleDisabledSaveCha2ds2vasc(props.cha2ds2vascData, cha2ds2vasc)}
            onClick={onSave}
            loading={props?.loading?.save}
          />
        )}
      </div>
    </div>
  );
};

CHA2DS2VAScForm.defaultProps = {
  className: undefined,
  isEditing: false,
  cha2ds2vascData: {},
  loading: {},
  onAdd: () => { },
  onSave: () => { },
  onChange: () => { },
  patientData: {},
};

CHA2DS2VAScForm.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** is edit or add new */
  isEditing: PropTypes.bool,
  /** cha2ds2vasc data */
  cha2ds2vascData: PropTypes.shape(),
  /** loading */
  loading: PropTypes.shape(),
  /** patient data */
  patientData: PropTypes.shape(),
  /** add event */
  onAdd: PropTypes.func,
  /** save event */
  onSave: PropTypes.func,
  /** change event */
  onChange: PropTypes.func,
};

export default CHA2DS2VAScForm;
