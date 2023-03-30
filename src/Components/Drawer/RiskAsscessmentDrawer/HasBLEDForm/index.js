import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import CustomButton from '../../../Button/customButton';
import {
  calculateHasBLEDScore, handleAddHasBLEDData, handleDisabledSaveHasBLED, HASBLEDClinicalCharacteristic, RISK_ASSESSMENT,
} from '../helper';
import MultiCheckbox from '../MultiCheckbox';
import './style.scss';

const HasBLEDForm = (props) => {
  const [hasBLED, setHasBLED] = useState([]);
  const [summaryScore, setSummaryScore] = useState();

  const onChange = (event) => {
    const clonedState = _.cloneDeep(hasBLED);
    const findTargetIndex = clonedState.findIndex(item => item.key === event.target.name);
    clonedState[findTargetIndex].isChecked = event.target.checked;
    setHasBLED(clonedState);
    setSummaryScore(calculateHasBLEDScore(clonedState));
    props.onChange();
  };

  const onSaveAndAddAnother = async () => {
    props.onAdd({ type: RISK_ASSESSMENT.HASBLED, data: handleAddHasBLEDData({ hasBLED }), isAddAnother: true });
  };

  const onAdd = async () => {
    props.onAdd({ type: RISK_ASSESSMENT.HASBLED, data: handleAddHasBLEDData({ hasBLED }) });
  };

  const onSave = async () => {
    props.onSave({ type: RISK_ASSESSMENT.HASBLED, data: handleAddHasBLEDData({ hasBLED }), isAddAnother: true });
  };

  useEffect(() => {
    if (!_.isEmpty(props.hasBLEDData)) {
      const data = HASBLEDClinicalCharacteristic.map(item => ({
        ...item,
        isChecked: props.hasBLEDData[item.key],
      }));
      setHasBLED(data);
      setSummaryScore(calculateHasBLEDScore(data));
    } else {
      let data;
      if (!props.isEditing) {
        const { age } = props.patientData;
        data = HASBLEDClinicalCharacteristic.map((item) => {
          let isChecked = false;
          if (item.key === 'elderly65' && age > 65) {
            isChecked = true;
          }
          return {
            ...item,
            isChecked,
          };
        });
      } else {
        data = HASBLEDClinicalCharacteristic.map(item => ({
          ...item,
          isChecked: false,
        }));
      }
      setHasBLED(data);
      setSummaryScore(calculateHasBLEDScore(data));
    }
  }, [props.hasBLEDData]);
  return (
    <div className={classnames('had-bled-form', props.className)}>
      <MultiCheckbox data={hasBLED} onChange={onChange} />
      <div className="had-bled-summary">
        {summaryScore
          && (
            <>
              <div className="had-bled-summary-score total">
                <div className="title">
                  Total score:
                </div>
                <div className="value">
                  {summaryScore.totalScore}
                </div>
              </div>
              <div className="had-bled-summary-score">
                {`${summaryScore.finalScore}`}
              </div>
            </>
          )}
      </div>
      <div className="had-bled-footer">
        {_.isEmpty(props.hasBLEDData) ? (
          <>
            <CustomButton
              className="had-bled-footer-btn"
              label="Save & add another"
              onClick={onSaveAndAddAnother}
              loading={props?.loading?.saveAndAddAnother}
              type="primary"
              ghost
            />
            <CustomButton
              className="had-bled-footer-btn"
              label="Add"
              type="primary"
              onClick={onAdd}
              loading={props?.loading?.add}
            />
          </>
        ) : (
          <CustomButton
            className="had-bled-footer-btn"
            label="Save"
            type="primary"
            disabled={handleDisabledSaveHasBLED(props.hasBLEDData, hasBLED)}
            onClick={onSave}
            loading={props?.loading?.save}
          />
        )}
      </div>
    </div>
  );
};

HasBLEDForm.defaultProps = {
  className: undefined,
  isEditing: false,
  hasBLEDData: {},
  patientData: {},
  loading: {},
  onAdd: () => { },
  onSave: () => { },
  onChange: () => { },
};

HasBLEDForm.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** is edit or add new */
  isEditing: PropTypes.bool,
  /** has bled data */
  hasBLEDData: PropTypes.shape(),
  /** patient data */
  patientData: PropTypes.shape(),
  /** loading */
  loading: PropTypes.shape(),
  /** add event */
  onAdd: PropTypes.func,
  /** save event */
  onSave: PropTypes.func,
  /** Change event */
  onChange: PropTypes.func,
};

export default HasBLEDForm;
