import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { useMergeState } from '../../Helpers/customHooks';
import RadioCT from '../Input/radioCT';
import { EHRA_SCORE } from '../../Constants';
import FullWidthButtons from '../Button/fullWidthButtons';

const InputBaselineInfoStep8 = (props) => {
  const [state, setState] = useMergeState({
    ehraScore: EHRA_SCORE[4],
  });

  const {
    className, onClickLeft, onClickRight, type, data,
  } = props;

  useEffect(() => {
    const { ehraScore } = data;
    if (ehraScore && !_.isEmpty(ehraScore)) {
      setState({ ehraScore: _.find(EHRA_SCORE, x => x.title === ehraScore.title) });
    }
  }, []);

  const { ehraScore } = state;

  const onChange = (key, value) => setState({ [key]: value });

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
    <div className={classnames('input-baseline-info-step8-wrapper', className)}>

      <div>
        <div className={classnames('size-16-b-g9', 'mb8')}>
          <span>EHRA score</span>
        </div>

        <RadioCT
          name="ehraScore"
          data={EHRA_SCORE}
          value={ehraScore}
          onChange={onChange}
          type="SCORE"
          radioItemClassName="mt16"
        />
      </div>


      <div className="midle-ct" />

      {showFooterButtons()}

    </div>
  );
};

InputBaselineInfoStep8.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => {},
  onClickRight: () => { },
  data: {},
};

InputBaselineInfoStep8.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
};
export default InputBaselineInfoStep8;
