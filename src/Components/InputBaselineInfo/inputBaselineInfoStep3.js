import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import { CalendarOutlined } from '@ant-design/icons';

// import { checkNoData, getStateData } from '../../Utils';
import { useMergeState } from '../../Helpers/customHooks';

import InputCT from '../Input/inputCT';
import DatePickerCT from '../Input/datepickerCT';
import FullWidthButtons from '../Button/fullWidthButtons';
import DateSummaryAttachment from '../Form/dateSummaryAttachment';
import { ALL_EDITABLE_KEYS } from '../../Pages/PatientDetails/Baseline/helper';

const { Text } = Typography;
const {
  EStressTesting, Echocar,
} = ALL_EDITABLE_KEYS;

const InputBaselineInfoStep3 = (props) => {
  const [state, setState] = useMergeState({
    exerciseStressTestingDate: props.data?.exerciseStressTestingDate || undefined,
    exerciseStressTestingSummary: props.data?.exerciseStressTestingSummary || undefined,
    exerciseStressTestingAttachment: props.data?.exerciseStressTestingAttachment || [],
    echocardiogramDate: props.data?.echocardiogramDate || undefined,
    echocardiogramLVEF: props.data?.echocardiogramLVEF || undefined,
    errMes: '',
  });

  const {
    className, onClickRight, type, Step3Titles, // data, onClickLeft,
    editKey,
  } = props;
  const {
    exerciseStressTestingDate, exerciseStressTestingSummary, exerciseStressTestingAttachment,
    echocardiogramDate, echocardiogramLVEF,
    errMes,
  } = state;

  const onChangeDSA = (key = '', value = '', head = '') => {
    const keyCT = `${head}${key}`;
    if (key === 'Attachment') {
      const arr = state[keyCT] ? [...state[keyCT]] : [];
      _.forEach(value, (item) => {
        arr.push(item);
      });
      setState({ [keyCT]: arr });
    } else {
      setState({ [keyCT]: value });
    }
  };

  const onClickDelete = (key = '', value = '', head = -1) => {
    const keyCT = `${head}${key}`;
    const arr = state[keyCT] ? [...state[keyCT]] : [];
    _.remove(arr, x => _.isEqual(x, value));
    setState({ [keyCT]: arr });
  };

  const onChange = (key, value) => setState({ [key]: value, errMes: '' });

  const isDisabled = () => {
    if (type === 'EDIT') {
      switch (editKey) {
        case EStressTesting:
          if (!exerciseStressTestingDate && !exerciseStressTestingSummary) {
            return true;
          }
          return false;
        case Echocar:
          if (!echocardiogramDate && !echocardiogramLVEF) {
            return true;
          }
          return false;
        default:
          return false;
      }
    }
    return false;
  };

  const onClickLeft = () => {
    props.onClickLeft(state);
  };

  const onClickRighBtn = () => {
    if (!_.isNil(echocardiogramLVEF)) {
      if (parseFloat(echocardiogramLVEF) > 100 || parseFloat(echocardiogramLVEF) < 0) {
        if (parseFloat(echocardiogramLVEF) > 100) {
          setState({ errMes: 'The value is no greater than 100%' });
          return;
        }
        if (parseFloat(echocardiogramLVEF) < 0) {
          setState({ errMes: 'The value is no less than 0%' });
          return;
        }
      }
    }
    onClickRight(state);
  };

  const showEchocardiogram = () => {
    const title = 'Echocardiogram';
    return (
      <>
        <Text strong>{title}</Text>

        <DatePickerCT
          name="echocardiogramDate"
          className="mt16"
          title="Date"
          value={echocardiogramDate}
          onChange={onChange}
          disabledDate="PAST"
          suffixIcon={<CalendarOutlined />}
        />

        <InputCT
          name="echocardiogramLVEF"
          className="mt16"
          title="LVEF (%)"
          type="NUMBER"
          placeholder="Enter a number"
          value={echocardiogramLVEF}
          errMes={errMes}
          inputClassName={errMes ? 'err-border' : ''}
          errMesClassName="div-small-incorrect-mes"
          onChange={onChange}
        />
      </>
    );
  };

  const showFooterButtons = () => {
    const rightTitle = type === 'INPUT' ? 'Next step' : 'Save';
    const leftTitle = type === 'INPUT' ? 'Previous step' : 'Cancel';
    return (
      <FullWidthButtons
        rightTitle={rightTitle}
        leftTitle={leftTitle}
        disabled={isDisabled()}
        onClickLeft={onClickLeft}
        onClickRight={onClickRighBtn}
      />
    );
  };

  return (
    <div className={classnames('input-baseline-info-step3-wrapper', className)}>
      <div>
        {
          Step3Titles.includes('Exercise stress testing') && (
            <DateSummaryAttachment
              onChange={(key, value) => onChangeDSA(key, value, 'exerciseStressTesting')}
              onClickDelete={(key, value) => onClickDelete(key, value, 'exerciseStressTesting')}
              title="Previous cardiac monitor results"
              subTitle="Exercise stress testing"
              date={exerciseStressTestingDate}
              summary={exerciseStressTestingSummary}
              attachment={exerciseStressTestingAttachment}
            />
          )}

        {
          Step3Titles.includes('') ? null : <Divider />
        }

        {
          Step3Titles.includes('Echocardiogram') ? showEchocardiogram() : null
        }
      </div>

      <div className="midle-ct" />

      {showFooterButtons()}
    </div>
  );
};

InputBaselineInfoStep3.defaultProps = {
  className: undefined,
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  Step3Titles: ['Exercise stress testing', 'Echocardiogram'],
  editKey: '',
};

InputBaselineInfoStep3.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  Step3Titles: PropTypes.arrayOf(PropTypes.string),
  editKey: PropTypes.string,
};

export default InputBaselineInfoStep3;
