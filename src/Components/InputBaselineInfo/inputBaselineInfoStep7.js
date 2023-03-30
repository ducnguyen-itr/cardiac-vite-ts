import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Typography, Button, Divider } from 'antd';
import { useMergeState } from '../../Helpers/customHooks';
import FooterScore from '../UI/footerScore';
import FullWidthButtons from '../Button/fullWidthButtons';
import MultipleCheckbox from '../Input/multipleCheckbox';
import { HASBLEDClinicalCharacteristicData, BleedsPer100PatientYears } from '../../Constants';
import { setMultipleCheckboxData } from '../../Utils';
import { calcStep7 } from '../../Utils/baselineInfo';


const InputBaselineInfoStep7 = (props) => {
  const [state, setState] = useMergeState({
    step7TotalScore: 0,
    hasbledClinical: [],
    hasbledClinicalFinalScore: '',
  });

  const {
    className, onClickLeft, onClickRight, type, data,
  } = props;

  useEffect(() => {
    setState(calcStep7(state.hasbledClinical));
  }, [state.hasbledClinical]);


  useEffect(() => {
    const { hasbledClinical } = data;
    if (type === 'INPUT' && !_.isEmpty(props.defaultScored?.hasbledClinical)) {
      setState({ hasbledClinical: props.defaultScored?.hasbledClinical });
      return;
    }
    if (!hasbledClinical || _.isEmpty(hasbledClinical)) {
      setState({ hasbledClinical: setMultipleCheckboxData(HASBLEDClinicalCharacteristicData) });
      return;
    }
    setState({ hasbledClinical });
  }, []);


  const { hasbledClinical, step7TotalScore, hasbledClinicalFinalScore } = state;

  const onChangeMultiCheckbox = (keyValue, obj, x) => {
    const data = _.cloneDeep(state[keyValue]);
    const item = _.find(data, x => x.value === obj.value);
    _.assign(item, { isCheck: x });
    setState({ hasbledClinical: _.cloneDeep(data) });
  };

  const showFooterButtons = () => {
    const rightTitle = type === 'INPUT' ? 'Next step' : 'Save';
    const leftTitle = type === 'INPUT' ? 'Previous step' : 'Cancel';
    return (
      <FullWidthButtons
        rightTitle={rightTitle}
        leftTitle={leftTitle}
        // disabled={isDisabled()}
        onClickLeft={() => onClickLeft(state)}
        onClickRight={() => onClickRight(state)}
      />
    );
  };


  return (
    <div className={classnames('input-baseline-info-step7-wrapper', className)}>

      <div>
        <div className="size-16-b-g9">
          <span>HAS-BLED clinical characteristic</span>
        </div>

        <MultipleCheckbox
          className="mt24"
          rowClassName="mt16"
          data={hasbledClinical}
          onChange={(obj, x) => onChangeMultiCheckbox('hasbledClinical', obj, x)}
        />
        <Divider />


        <FooterScore
          totalScore={step7TotalScore}
          arrayData={[{
            // title: 'HASBLED clinical risk estimation (%)',
            title: hasbledClinicalFinalScore,
          }]}
        />

      </div>


      <div className="midle-ct" />

      {showFooterButtons()}
    </div>
  );
};

InputBaselineInfoStep7.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  defaultScored: {},
};

InputBaselineInfoStep7.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  defaultScored: PropTypes.shape({}),
};
export default InputBaselineInfoStep7;
