import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { CalendarOutlined } from '@ant-design/icons';
import InputCT from '../Input/inputCT';
import MultipleCheckbox from '../Input/multipleCheckbox';
import { useMergeState } from '../../Helpers/customHooks';
import { AFIB_HISTORY_DATA } from '../../Constants/newPatientData';
import { setMultipleCheckboxData } from '../../Utils';
import FullWidthButtons from '../Button/fullWidthButtons';

const {
  PastMedicalHistorQuestion,
  OtherOptions,
  Myocardial,
} = AFIB_HISTORY_DATA;

const { pastMedicalHistoryData } = PastMedicalHistorQuestion;

const PastMedicalConditions = (props) => {
  const [state, setState] = useMergeState({
    pastMedicalHistory: [],
    pastMedicalOther: '',
    myocardialInfarction: '',
  });
  const {
    className, onClickLeft, onClickRight, type, data,
  } = props;
  const { pastMedicalHistory, pastMedicalOther, myocardialInfarction } = state;

  const onChange = (keyValue, x) => { setState({ [keyValue]: x }); };

  const onChangeMultiCheckbox = (keyValue, obj, x) => {
    const data = state[keyValue];
    const item = _.find(data, x => x.value === obj.value);
    _.assign(item, { isCheck: x });
    const tempObj = { [keyValue]: data };
    if (obj?.value === OtherOptions && !x && keyValue === 'pastMedicalHistory') {
      _.assign(tempObj, { pastMedicalOther: '' });
    }
    if (obj?.value === 'Myocardial infarction' && !x && keyValue === 'pastMedicalHistory') {
      _.assign(tempObj, { myocardialInfarction: undefined });
    }
    setState(tempObj);
  };

  const isOtherPastMedi = _.find(pastMedicalHistory, x => x.value === OtherOptions);
  const isMyocar = _.find(pastMedicalHistory, x => x.value === Myocardial);

  const pastMedicalHistoryData1 = pastMedicalHistory.slice(0, 3);
  const pastMedicalHistoryData2 = pastMedicalHistory.slice(3, pastMedicalHistory.length);

  const isDisabled = () => {
    if (isMyocar?.isCheck && !myocardialInfarction) {
      return true;
    }
    if (isOtherPastMedi?.isCheck && !pastMedicalOther) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const { pastMedicalHistory, pastMedicalOther, myocardialInfarction } = data;
    if (!pastMedicalHistory || pastMedicalHistory.length === 0) {
      setState({ pastMedicalHistory: setMultipleCheckboxData(pastMedicalHistoryData) });
      return;
    }
    setState({ pastMedicalHistory, pastMedicalOther, myocardialInfarction });
  }, []);

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
    <div className={classnames('past-medical-conditions-wrapper', className)}>
      <div>
        <div className="size-16-b-g9">
          <span>Past medical conditions</span>
        </div>

        <MultipleCheckbox
          // title='Past medical conditions'
          className="mt24"
          rowClassName="mt16"
          data={pastMedicalHistoryData1}
          onChange={(obj, x) => onChangeMultiCheckbox('pastMedicalHistory', obj, x)}
        />

        {isMyocar?.isCheck ? (
          <InputCT
            name="myocardialInfarction"
            className="mt4-padl24"
            type="DATE"
            placeholder="Select date"
            onChange={onChange}
            value={myocardialInfarction}
            disabledDate="PAST"
            suffix={<CalendarOutlined />}
          />
        ) : null}

        <MultipleCheckbox
        // title='Past medical conditions'
          rowClassName="mt16"
          data={pastMedicalHistoryData2}
          onChange={(obj, x) => onChangeMultiCheckbox('pastMedicalHistory', obj, x)}
        />

        {isOtherPastMedi?.isCheck ? (
          <InputCT
            name="pastMedicalOther"
            type="TEXTAREA"
            className="mt4-padl24"
            placeholder="Enter another option"
            onChange={onChange}
            value={pastMedicalOther}
          />
        ) : null}
      </div>


      <div className="midle-ct" />

      {showFooterButtons()}

    </div>
  );
};

PastMedicalConditions.defaultProps = {
  className: '',
  type: '',
  onClickLeft: () => {},
  onClickRight: () => { },
  data: {},
};

PastMedicalConditions.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
  data: PropTypes.shape(),
};
export default PastMedicalConditions;
