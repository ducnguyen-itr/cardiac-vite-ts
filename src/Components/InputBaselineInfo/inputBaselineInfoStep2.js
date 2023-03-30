import { Divider } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useMergeState } from '../../Helpers/customHooks';
import { getStateData } from '../../Utils';
import FullWidthButtons from '../Button/fullWidthButtons';
import DateSummaryAttachment from '../Form/dateSummaryAttachment';
import { ALL_EDITABLE_KEYS } from '../../Pages/PatientDetails/Baseline/helper';

const {
  CBloodCount, LFunctionTest, LECG,
} = ALL_EDITABLE_KEYS;

const InputBaselineInfoStep2 = (props) => {
  const [state, setState] = useMergeState({
    completeBloodCountDate: undefined,
    completeBloodCountSummary: '',
    completeBloodCountAttachment: [],

    liverFunctionTestDate: undefined,
    liverFunctionTestSummary: '',
    liverFunctionTestAttachment: [],

    leadECGDate: undefined,
    leadECGSummary: '',
    leadECGAttachment: [],
  });

  const {
    className, onClickLeft, onClickRight, type, data,
    Step2Titles, editKey,
  } = props;

  const {
    completeBloodCountDate, liverFunctionTestDate, leadECGDate,
    completeBloodCountSummary, liverFunctionTestSummary, leadECGSummary,
    completeBloodCountAttachment, liverFunctionTestAttachment, leadECGAttachment,
  } = state;

  useEffect(() => {
    const {
      completeBloodCountDate, liverFunctionTestDate, leadECGDate,
      completeBloodCountSummary, liverFunctionTestSummary, leadECGSummary,
      completeBloodCountAttachment, liverFunctionTestAttachment, leadECGAttachment,
    } = data;
    const tempArr = {
      completeBloodCountDate,
      liverFunctionTestDate,
      leadECGDate,
      completeBloodCountSummary,
      liverFunctionTestSummary,
      leadECGSummary,
      completeBloodCountAttachment,
      liverFunctionTestAttachment,
      leadECGAttachment,
    };
    setState(getStateData(tempArr));
  }, []);

  const isDisabled = () => {
    if (type === 'EDIT') {
      switch (editKey) {
        case CBloodCount:
          if (!completeBloodCountDate && !completeBloodCountSummary) {
            return true;
          }
          return false;
        case LFunctionTest:
          if (!liverFunctionTestDate && !liverFunctionTestSummary) {
            return true;
          }
          return false;
        case LECG:
          if (!leadECGDate && !leadECGSummary) {
            return true;
          }
          return false;
        default:
          return false;
      }
    }
    return false;
  };

  const onChange = (key = '', value = '', i = -1) => {
    let head = '';
    switch (i) {
      case 0:
        head = 'completeBloodCount';
        break;
      case 1:
        head = 'liverFunctionTest';
        break;
      case 2:
        head = 'leadECG';
        break;
      default:
        break;
    }
    const keyCT = `${head}${key}`;
    if (key === 'Attachment') {
      const arr = state[keyCT] ? [..._.cloneDeep(state[keyCT])] : [];
      _.forEach(value, (item) => {
        arr.push(item);
      });
      setState({ [keyCT]: _.cloneDeep(arr) });
    } else {
      setState({ [keyCT]: value });
    }
  };

  const onClickDelete = (key = '', value = '', i = -1) => {
    let head = '';
    switch (i) {
      case 0:
        head = 'completeBloodCount';
        break;
      case 1:
        head = 'liverFunctionTest';
        break;
      case 2:
        head = 'leadECG';
        break;
      default:
        break;
    }
    const keyCT = `${head}${key}`;
    const arr = state[keyCT] ? [...state[keyCT]] : [];
    _.remove(arr, x => _.isEqual(x, value));
    setState({ [keyCT]: arr });
  };

  const dates = [completeBloodCountDate, liverFunctionTestDate, leadECGDate];
  const summaries = [completeBloodCountSummary, liverFunctionTestSummary, leadECGSummary];
  const attachments = [completeBloodCountAttachment, liverFunctionTestAttachment, leadECGAttachment];

  const showFooterButtons = () => {
    const rightTitle = type === 'INPUT' ? 'Next step' : 'Save';
    const leftTitle = type === 'INPUT' ? 'Previous step' : 'Cancel';
    return (
      <FullWidthButtons
        rightTitle={rightTitle}
        leftTitle={leftTitle}
        disabled={isDisabled()}
        onClickLeft={() => onClickLeft(state)}
        onClickRight={() => onClickRight(state)}
      />
    );
  };

  return (
    <div className={classnames('input-baseline-info-step2-wrapper', className)}>
      <div>
        {
          _.map(Step2Titles, (x, i) => (
            x ? (
              <div key={i}>
                <DateSummaryAttachment
                  onChange={(key, value) => {
                    onChange(key, value, i);
                  }}
                  onClickDelete={(key, value) => {
                    onClickDelete(key, value, i);
                  }}
                  title={x}
                  date={dates[i]}
                  summary={summaries[i]}
                  attachment={attachments[i]}
                />

                {
                  i !== Step2Titles.length - 1 && !Step2Titles.includes('') && <Divider />
                }
              </div>
            ) : null
          ))
        }
      </div>

      <div className="midle-ct" />

      {showFooterButtons()}
    </div>
  );
};

InputBaselineInfoStep2.defaultProps = {
  className: undefined,
  type: '',
  onClickLeft: () => { },
  onClickRight: () => { },
  data: {},
  Step2Titles: ['Complete blood count', 'Liver function test', '12 leads ECG'],
  editKey: '',
};

InputBaselineInfoStep2.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
  Step2Titles: PropTypes.arrayOf(PropTypes.string),
  editKey: PropTypes.string,
};

export default InputBaselineInfoStep2;
