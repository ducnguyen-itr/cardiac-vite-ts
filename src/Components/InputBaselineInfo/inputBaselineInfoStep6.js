import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { Divider } from 'antd';
import { useMergeState } from '../../Helpers/customHooks';
import MultipleCheckbox from '../Input/multipleCheckbox';
import { CHA2DS2VASCScoreData, AdjustedStrokeRateData } from '../../Constants';
import { setMultipleCheckboxData } from '../../Utils';
import { calcStep6 } from '../../Utils/baselineInfo';
import FullWidthButtons from '../Button/fullWidthButtons';
import FooterScore from '../UI/footerScore';

const InputBaselineInfoStep6 = (props) => {
  const [state, setState] = useMergeState({
    cha2ds2VascScore: [],
    step6TotalScore: 0,
    cha2ds2VascFinalScore: '',
  });

  useEffect(() => {
    setState(calcStep6(state.cha2ds2VascScore));
  }, [state.cha2ds2VascScore]);

  const onChangeMultiCheckbox = (keyValue, obj, x) => {
    const cha2dsData = _.cloneDeep(state[keyValue]);
    const item = _.find(cha2dsData, x => x.value === obj.value);

    if (item.value === CHA2DS2VASCScoreData[2].value && x) {
      const item2 = _.find(cha2dsData, x => x.value === CHA2DS2VASCScoreData[3].value);
      _.assign(item2, { isCheck: !x });
    } else if (item.value === CHA2DS2VASCScoreData[3].value && x) {
      const item2 = _.find(cha2dsData, x => x.value === CHA2DS2VASCScoreData[2].value);
      _.assign(item2, { isCheck: !x });
    }
    _.assign(item, { isCheck: x });
    setState({ cha2ds2VascScore: _.cloneDeep(cha2dsData) });
  };

  const {
    className, onClickLeft, onClickRight, type, data,
  } = props;

  useEffect(() => {
    const { cha2ds2VascScore } = data;
    if (type === 'INPUT' && !_.isEmpty(props.defaultScored)) {
      setState({ cha2ds2VascScore: props.defaultScored?.cha2ds2VascScore });
      return;
    }
    if (!cha2ds2VascScore || _.isEmpty(cha2ds2VascScore)) {
      setState({ cha2ds2VascScore: setMultipleCheckboxData(CHA2DS2VASCScoreData) });
      return;
    }

    setState({ cha2ds2VascScore });
  }, []);

  const { cha2ds2VascScore, step6TotalScore, cha2ds2VascFinalScore } = state;

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
    <div className={classnames('input-baseline-info-step6-wrapper', className)}>
      <div>
        <div className="size-16-b-g9">
          <span>CHA2DS2-VASc score</span>
        </div>

        <MultipleCheckbox
          className="mt24"
          rowClassName="mt16"
          data={cha2ds2VascScore}
          onChange={(obj, x) => onChangeMultiCheckbox('cha2ds2VascScore', obj, x)}
        />

        <Divider />

        <FooterScore
          totalScore={step6TotalScore}
          arrayData={[{
            title: 'CHA2DS2-VASc clinical risk estimation (%)',
            value: cha2ds2VascFinalScore,
          }]}
        />
      </div>


      <div className="midle-ct" />

      {showFooterButtons()}

    </div>
  );
};
InputBaselineInfoStep6.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  defaultScored: {},
};
InputBaselineInfoStep6.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  defaultScored: PropTypes.PropTypes.shape({}),
};
export default InputBaselineInfoStep6;
