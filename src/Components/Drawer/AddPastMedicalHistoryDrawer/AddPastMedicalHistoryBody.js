import { CalendarOutlined, CloseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';

import { useParams } from 'react-router';
import handleAddAfibHistory from '../../../Apollo/Functions/Handle/handleAddAfibHistory';
import handleUpdateAfibHistory from '../../../Apollo/Functions/Handle/handleUpdateAfibHistory';
import { AFIB_HISTORY_DATA } from '../../../Constants/newPatientData';
import { CURRENT_SYMPTOMS_DATA, PALPITATIONS_CHILDREN_DATA } from '../../../Constants/newTemplate';
import consoleLog from '../../../Helpers/consoleLog';
import { useMergeState } from '../../../Helpers/customHooks';
import { isDisabledNextStep2 } from '../../../Pages/Patients/CreateNewPatient/NewPatientStep2/helper';
import { configRadioBoolData } from '../../../Utils';
import { showFailedMsg } from '../../../Utils/showNotification';
import CustomButton from '../../Button/customButton';
import DatepickerCT from '../../Input/datepickerCT';
import InputCT from '../../Input/inputCT';
import RadioCT from '../../Input/radioCT';
import SelectCT from '../../Input/selectCT';
import { formatInitData, formatPastMedicalHistory, handleDisabledAfibHistory } from './helper';
import './style.scss';

const {
  AFibStatusQuestion,
  CardioversionQuestion,
  ElectricalShockQuestion,
  CurrentSymptomsQuestion,
  HospitalizedQuestion,
  OtherOptions,
  ChestPain,
  chestPainData,
} = AFIB_HISTORY_DATA;

const {
  afibStatusdata,
  BIOFLUX_LOADING,

} = AFibStatusQuestion;
const { cardioversionTitle, cardioversiondata } = CardioversionQuestion;
const { electricalTitle, electricaldata } = ElectricalShockQuestion;
const {
  CHEST_PAIN_FREQUENCY, CHEST_PAIN_TIMES,
} = CurrentSymptomsQuestion;

const { hospitalizedTitle, hospitalizeddata } = HospitalizedQuestion;

const AddPastMedicalHistoryBody = (props) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const initState = {
    cardioversion: configRadioBoolData(false, cardioversiondata, 1),
    electricalShock: configRadioBoolData(false, electricaldata, 1),

    // CURRENT SYMPTOMS
    currentSymptoms: [],
    chestPainTimePerWeek: undefined,
    increasingFrequencyOfChestPain: configRadioBoolData(false, chestPainData, 1),
    palpitationTriggers: [],
    palpitationOther: '',

    hospitalized: configRadioBoolData(false, hospitalizeddata, 1),
    hospitalizedDate: undefined,

    chestPainTimePerWeekErr: '',
  };
  const [state, setState] = useMergeState(props?.initData ? formatInitData(props?.initData) : _.cloneDeep(initState));


  const {
    cardioversion, electricalShock,
    currentSymptoms, palpitationTriggers, palpitationOther,
    hospitalized, hospitalizedDate,
    chestPainTimePerWeek, increasingFrequencyOfChestPain,
    chestPainTimePerWeekErr,
  } = state;

  const onChange = (key, value) => {
    if (key === 'biofluxService') {
      if (state.biofluxService !== value?.value) {
        setState({
          [key]: value?.value, biofluxFacilityId: value._id || '', biofluxStatus: BIOFLUX_LOADING, chestPainTimePerWeekErr: '',
        });
      }
      return;
    }
    if (key === 'afibStatus' && value.title === afibStatusdata[2]?.title) {
      setState({
        [key]: value, biofluxFacilityId: '', biofluxStatus: '', chestPainTimePerWeekErr: '', biofluxService: undefined, biofluxOptions: null,
      });
      return;
    }
    setState({ [key]: value, chestPainTimePerWeekErr: '' });
  };

  const isChestPain = _.find(currentSymptoms, x => x?.value === ChestPain);
  const triggerItem = _.find(palpitationTriggers, x => x?.value === OtherOptions);

  const onSubmit = async () => {
    setLoading(true);
    try {
      const sendingData = formatPastMedicalHistory({ carePlanId: params?.carePlanId, state });
      if (props?.isAddAFib) {
        await handleAddAfibHistory(sendingData);
      } else {
        await handleUpdateAfibHistory(sendingData);
      }
      props.onClose();
    } catch (error) {
      consoleLog('Failed to mutate initial intake info', error);
      showFailedMsg(props?.isAddAFib ? 'Failed to add initial intake info!' : 'Failed to update initial intake info!');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (props?.initData) {
      const newData = formatInitData(props?.initData);
      setState(newData);
    }
  }, [props?.initData]);

  const showCurrentSymptoms = () => (
    <div className="medical-history-select">
      <SelectCT
        name="currentSymptoms"
        className="mt16"
        title="Current symptoms"
        placeholder="Select..."
        data={CURRENT_SYMPTOMS_DATA}
        value={currentSymptoms}
        onChange={onChange}
        mode="multiple"
      />

      {(currentSymptoms.includes('Chest pain') || currentSymptoms.includes('Palpitations')) && (
        <div className="medical-history-select-expend-input">
          {currentSymptoms.includes('Chest pain') && (
            <div className="padl24">
              <InputCT
                name="chestPainTimePerWeek"
                title={CHEST_PAIN_TIMES}
                type="NUMBER"
                placeholder="--"
                onChange={onChange}
                value={chestPainTimePerWeek}
                decimalScale={0}
                inputClassName={chestPainTimePerWeekErr ? 'err-border' : ''}
                errMes={chestPainTimePerWeekErr}
                errMesClassName="div-small-incorrect-mes"
              />

              <RadioCT
                name="increasingFrequencyOfChestPain"
                titleClassName="fw-normal"
                className="mt8"
                title={CHEST_PAIN_FREQUENCY}
                data={chestPainData}
                value={increasingFrequencyOfChestPain}
                onChange={onChange}
                type="QUESTION"
              />
            </div>
          )}
          {currentSymptoms.includes('Palpitations') && (
            <div className="mt4-padl24">
              <SelectCT
                name="palpitationTriggers"
                className={currentSymptoms.includes('Chest pain') ? 'mt16' : 'mt4'}
                title="What triggers the patient's palpitations?"
                placeholder="Select..."
                data={PALPITATIONS_CHILDREN_DATA}
                value={palpitationTriggers}
                onChange={onChange}
                mode="multiple"
              />
              {palpitationTriggers.includes('Others') && (
                <InputCT
                  name="palpitationOther"
                  className="mt4"
                  placeholder="Enter others"
                  onChange={onChange}
                  value={palpitationOther}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const showRadioQuestions = () => (
    <>
      <RadioCT
        name="cardioversion"
        className="mt24"
        title={cardioversionTitle}
        data={cardioversiondata}
        value={cardioversion}
        onChange={onChange}
        type="QUESTION"
      />

      <RadioCT
        name="electricalShock"
        className="mt24"
        title={electricalTitle}
        data={electricaldata}
        value={electricalShock}
        onChange={onChange}
        type="QUESTION"
      />
    </>
  );

  const showHospitalizedQuestion = () => (
    <>
      <RadioCT
        name="hospitalized"
        className="mt24"
        title={hospitalizedTitle}
        data={hospitalizeddata}
        value={hospitalized}
        onChange={onChange}
        type="QUESTION"
      />
      {
        hospitalized?.title === hospitalizeddata?.[0]?.title && (
          <DatepickerCT
            name="hospitalizedDate"
            className="mt24"
            title="When was the last hospital visit?"
            onChange={onChange}
            value={hospitalizedDate}
            disabledDate="PAST"
            placeholder="MM/DD/YYYY"
            suffixIcon={<CalendarOutlined />}
            titleClass="b"
          />
        )
      }
    </>
  );

  return (
    <>
      <div className="add-past-medical-history-drawer-header">
        <div className="add-past-medical-history-drawer-title">
          {`${props?.isAddAFib ? 'Add' : 'Edit'} past medical history`}
        </div>
        <CustomButton
          className="add-past-medical-history-drawer-close-btn"
          onClick={props.onClose}
          icon={<CloseOutlined className="add-past-medical-history-drawer-close-icon" />}
          type="text"
        />
      </div>
      <div className="add-past-medical-history-drawer-content">
        {showCurrentSymptoms()}
        {showRadioQuestions()}
        {showHospitalizedQuestion()}
        <CustomButton
          type="primary"
          className="add-past-medical-history-drawer-submit-btn"
          loading={loading}
          onClick={onSubmit}
          disabled={isDisabledNextStep2(state, {
            triggerItem, isChestPain,
          }) || handleDisabledAfibHistory(props?.initData, state, props?.isAddAFib)}
          label={props?.isAddAFib ? 'Add' : 'Save'}
        />
      </div>
    </>
  );
};

AddPastMedicalHistoryBody.defaultProps = {
  isAddAFib: false,
  initData: {},
  onClose: () => { },
};

AddPastMedicalHistoryBody.propTypes = {
  /** is add new */
  isAddAFib: PropTypes.bool,
  /** component init data */
  initData: PropTypes.shape(),
  /** event cancel */
  onClose: PropTypes.func,
};

export default AddPastMedicalHistoryBody;
