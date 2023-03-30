import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Divider } from 'antd';
import { useMergeState } from '../../Helpers/customHooks';
import CheckboxCT from '../Input/checkboxCT';
import InputCT from '../Input/inputCT';
import YesNoRadio from '../Input/yesNoRadio';
import PairInput from '../Input/pairInput';
import FullWidthButtons from '../Button/fullWidthButtons';
import FooterScore from '../UI/footerScore';
import { getStateData } from '../../Utils';
import { calcStep9 } from '../../Utils/baselineInfo';
import SelectCT from '../Input/selectCT';
import { GENERAL_INFOMATION_DATA } from '../../Constants/newPatientData';

const { GenderDataSelect } = GENERAL_INFOMATION_DATA;

const FRAMINGHAM = {
  ENSURE: 'The patient is from 30 to 79 years of age with no prior history of coronary heart disease, intermittent claudication, or diabetes',
  BLOOD: 'Blood pressure being treated with medication',
};

const InputBaselineInfoStep9 = (props) => {
  const {
    className, onClickLeft, onClickRight, type, data, genderAge, patientData,
  } = props;

  const {
    patientAge, demoGender,
  } = patientData;

  const [state, setState] = useMergeState({
    isEnsurePatientAge: true,
    frsGender: '',
    frsAge: '',
    smoker: 'No',
    totalCholesterol: '',
    HDLCholesterol: '',
    systolicBP: '',
    bloodPressure: 'No',
    //
    step9TotalScore: 0,
    cvgRisk: undefined,
    heartRate: undefined,
    risk: undefined,
    // Err
    totalCholesterolErr: '',
    HDLCholesterolErr: '',
    systolicBPErr: '',
    ageErr: '',
  });


  const onChange = (key, value) => {
    setState({
      [key]: value,
      totalCholesterolErr: '',
      HDLCholesterolErr: '',
      systolicBPErr: '',
      ageErr: '',
    });
  };


  useEffect(() => {
    const {
      isEnsurePatientAge, smoker, gender, age, frsAge, frsGender,
      totalCholesterol, HDLCholesterol, systolicBP, bloodPressure,
    } = data;
    const isCheckEnsurePatientAge = (frsAge = {}, isEnsurePatientAge = false) => {
      if (type === 'EDIT') return isEnsurePatientAge;
      if (frsAge >= 30 && frsAge <= 79) return true;
      return isEnsurePatientAge;
    };

    const tempArr = {
      isEnsurePatientAge: isCheckEnsurePatientAge(patientAge, isEnsurePatientAge),
      smoker,
      totalCholesterol,
      HDLCholesterol,
      systolicBP,
      bloodPressure,
      frsGender: frsGender || demoGender || gender || null,
      frsAge: !_.isNil(frsAge) ? frsAge : !_.isNil(patientAge) ? patientAge : age || '',
    };
    setState(getStateData(tempArr));
  }, [props.genderAge]);
  const {
    isEnsurePatientAge, frsGender, frsAge, smoker,
    totalCholesterol, HDLCholesterol, systolicBP, bloodPressure,
    step9TotalScore, cvgRisk, heartRate, risk,
    totalCholesterolErr,
    HDLCholesterolErr,
    systolicBPErr,
    ageErr,
  } = state;

  useEffect(() => {
    setState(calcStep9({
      frsAge, frsGender, smoker, totalCholesterol, HDLCholesterol, systolicBP, bloodPressure,
    }));
  }, [state.totalCholesterol, state.HDLCholesterol, state.systolicBP, state.bloodPressure, state.smoker, state.frsAge, state.frsGender]);


  const isDisabled = () => {
    if (!isEnsurePatientAge) {
      return false;
    }
    if (!totalCholesterol || !HDLCholesterol || !systolicBP || !frsAge || !frsGender) {
      return true;
    }
    return false;
  };

  const handleRightClick = () => {
    if (!_.isNil(totalCholesterol) && isEnsurePatientAge) {
      if (parseFloat(totalCholesterol) < 0) {
        setState({ totalCholesterolErr: 'The value is no less than 0' });
        return;
      }
    }
    if (!_.isNil(HDLCholesterol) && isEnsurePatientAge) {
      if (parseFloat(HDLCholesterol) < 0) {
        setState({ HDLCholesterolErr: 'The value is no less than 0' });
        return;
      }
    }
    if (!_.isNil(systolicBP) && isEnsurePatientAge) {
      if (parseInt(systolicBP, 10) < 0) {
        setState({ systolicBPErr: 'The value is no less than 0' });
        return;
      }
    }
    if (!_.isNil(systolicBP) && isEnsurePatientAge) {
      if (parseInt(systolicBP, 10) < 0) {
        setState({ systolicBPErr: 'The value is no less than 0' });
        return;
      }
    }
    if (!_.isNil(frsAge) && isEnsurePatientAge) {
      if (parseInt(frsAge, 10) < 30 || parseInt(frsAge, 10) > 79) {
        setState({ ageErr: 'Invalid value' });
        return;
      }
    }
    onClickRight(state);
  };

  const showInputNumbers = () => {
    const inputArr = [
      {
        title: 'Total cholesterol (mmol/L)',
        value: totalCholesterol,
        key: 'totalCholesterol',
        errMes: totalCholesterolErr,
      },
      {
        title: 'HDL cholesterol (mmol/L)',
        value: HDLCholesterol,
        key: 'HDLCholesterol',
        errMes: HDLCholesterolErr,
      },
      {
        title: 'Systolic BP (mmHg)',
        value: systolicBP,
        key: 'systolicBP',
        decimalScale: 0,
        errMes: systolicBPErr,
      },
    ];
    return (
      _.map(inputArr, (x, i) => (
        <InputCT
          inputClassName={x?.errMes ? 'err-border' : ''}
          name={x.key}
          key={i}
          className="mt16"
          title={x.title}
          placeholder="--"
          value={x.value}
          onChange={onChange}
          type="NUMBER"
          decimalScale={x.decimalScale}
          errMes={x?.errMes}
          errMesClassName="div-small-incorrect-mes"
        />
      ))
    );
  };

  const showFooterButtons = () => {
    const rightTitle = type === 'INPUT' ? 'Finish' : 'Save';
    const leftTitle = type === 'INPUT' ? 'Previous step' : 'Cancel';
    return (
      <FullWidthButtons
        rightTitle={rightTitle}
        leftTitle={leftTitle}
        disabled={isDisabled()}
        onClickLeft={() => onClickLeft(state)}
        onClickRight={handleRightClick}
      />
    );
  };

  return (
    <div className={classnames('input-baseline-info-step7-wrapper', className)}>
      <div>
        <div className="size-16-b-g9">
          <span>Framingham risk score (FRS)</span>
        </div>
        <CheckboxCT
          name="isEnsurePatientAge"
          className="mt24"
          data={FRAMINGHAM.ENSURE}
          isCheck={isEnsurePatientAge}
          onChange={onChange}
        />

        {isEnsurePatientAge ? (
          <div>

            <div className="pair-input mt24">
              <SelectCT
                title="Gender"
                placeholder="Select gender"
                name="frsGender"
                value={frsGender}
                onChange={onChange}
                data={GenderDataSelect}
              />
              <InputCT
                title="Age"
                placeholder="Enter age"
                name="frsAge"
                value={frsAge}
                onChange={onChange}
                type="NUMBER"
                errMes={ageErr}
                errMesClassName="div-small-incorrect-mes"
              />
            </div>
            <YesNoRadio
              name="smoker"
              className="mt16"
              value={smoker}
              title="Smoker"
              onChange={onChange}
            />

            {showInputNumbers()}

            <YesNoRadio
              name="bloodPressure"
              className="mt16"
              value={bloodPressure}
              title={FRAMINGHAM.BLOOD}
              onChange={onChange}
            />

            <Divider />

            <FooterScore
              totalScore={step9TotalScore}
              arrayData={[
                {
                  title: '10 years CVD risk (%)',
                  value: cvgRisk,
                },
                {
                  title: 'Heart age (years)',
                  value: heartRate,
                },
                {
                  title: 'Risk',
                  value: risk,
                },
              ]}
            />
          </div>
        ) : null}

      </div>


      <div className="midle-ct" />

      {showFooterButtons()}

    </div>
  );
};

InputBaselineInfoStep9.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  genderAge: {},
  patientData: {},
};

InputBaselineInfoStep9.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  genderAge: PropTypes.shape(),
  patientData: PropTypes.shape(),
};
export default InputBaselineInfoStep9;
