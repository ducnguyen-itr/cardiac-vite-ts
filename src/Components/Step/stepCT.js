import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Steps } from 'antd';
import { useMergeState } from '../../Helpers/customHooks';

const { Step } = Steps;

const StepCT = (props) => {
  // const [state, setState] = useMergeState({
  //   data: [],
  // });
  const {
    className, data, current, status,
  } = props;
  return (
    <Steps
      status={status}
      direction="vertical"
      current={current}
      className={classnames('step-ct-wrapper', className)}
    >
      {_.map(data, (x, i) => (
        <Step
          key={i}
          title={x.title}
          description={x?.description}
        />
      ))}
    </Steps>
  );
};
StepCT.defaultProps = {
  className: '',
  data: [],
  current: 0,
  status: undefined,
};
StepCT.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape()),
  current: PropTypes.number,
  status: PropTypes.string, // process finish error
};

export default StepCT;
