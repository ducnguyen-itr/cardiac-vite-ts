import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Drawer } from 'antd';
import _ from 'lodash';

import { useParams } from 'react-router';
import CustomButton from '../../Button/customButton';
import NormalSelect from '../../Input/NormalSelect';
import CHA2DS2VAScForm from './CHA2DS2VAScForm';
import {
  handleAddCha2ds2vascData, handleAddData, handleUpdateData, RISK_ASSESSMENT_ENUM, RISK_ASSESSMENT_FULLNAME_ENUM, RISK_ASSESSMENT_OPTIONS,
} from './helper';
import './style.scss';
import HasBLEDForm from './HasBLEDForm';
import EHRAForm from './EHRAForm';
import FRSForm from './FRSForm';
import { useMergeState } from '../../../Helpers/customHooks';
import handleAddBaseline from '../../../Apollo/Functions/Handle/handleAddBaseline';
import consoleLog from '../../../Helpers/consoleLog';
import handleUpdateBaseline from '../../../Apollo/Functions/Handle/handleUpdateBaseline';
import ConfirmationLayout from '../../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { CONFIRMATION_LAYOUT_TYPES } from '../../../Constants';

const RiskAsscessmentDrawer = (props) => {
  const params = useParams();
  const [riskAssessmentType, setRiskAssessmentType] = useState();

  const [isShowConfirmLayout, setShowConfirmLayout] = useState(false);
  const [isChanged, setChanged] = useState(false);
  const {
    cha2ds2vasc, ehra, frs, hasBled,
  } = props?.editingRiskAsscessment?.data || {};


  const [loading, setLoading] = useMergeState({
    add: false,
    save: false,
    saveAndAddAnother: false,
  });

  const onChange = () => {
    if (!isChanged) {
      setChanged(true);
    }
  };

  const onChangeRiskAssessmentType = (name, value) => {
    onChange();
    setRiskAssessmentType(value);
  };


  const toggleLeaveModal = () => {
    setShowConfirmLayout(prev => !prev);
  };

  const toggleClick = () => {
    toggleLeaveModal();
    props.onClose();
  };

  const onClose = () => {
    if (isChanged) {
      toggleLeaveModal();
    } else {
      props.onClose();
    }
  };

  // const onAddEditSuccess = ({ type, data }) => {
  //
  //   props.onClose();
  // };

  const onAdd = async ({ type, data, isAddAnother }) => {
    if (isAddAnother) {
      setLoading({ saveAndAddAnother: true });
    } else {
      setLoading({ add: true });
    }
    try {
      const sendingData = handleAddData({ carePlanId: params?.carePlanId, type, data });
      await handleAddBaseline(sendingData);
      if (isAddAnother) {
        setChanged(false);
        setRiskAssessmentType(null);
      } else {
        props.onClose();
      }
    } catch (error) {
      consoleLog(error);
    }
    if (isAddAnother) {
      setLoading({ saveAndAddAnother: false });
    } else {
      setLoading({ add: false });
    }
  };

  const onSave = async ({ type, data }) => {
    setLoading({ save: true });
    try {
      const sendingData = handleUpdateData({ baselineId: props?.baselineId, type, data });
      await handleUpdateBaseline(sendingData);
      props.onClose();
    } catch (error) {
      consoleLog(error);
    }
    setLoading({ save: false });
  };


  const onAddEditSuccess = ({ type, data }) => {
    props.onClose();
  };

  const onSaveAndAddAnother = ({ type, data }) => {
    setChanged(false);
    setRiskAssessmentType(null);
  };


  useEffect(() => {
    if (!_.isEmpty(props.editingRiskAsscessment)) {
      setRiskAssessmentType(_.cloneDeep(RISK_ASSESSMENT_OPTIONS).find(item => item.value === props.editingRiskAsscessment.type));
    }
  }, [props.editingRiskAsscessment]);

  useEffect(() => {
    if (!props.open) {
      setRiskAssessmentType();
      setChanged(false);
    }
  }, [props.open]);

  // risk assessment data should be props in this component
  // props will be an object includes 4 keys
  // // riskAssessmentData: {cha2ds2vasc, frs, hasBled, ehra}
  return (
    <>
      <Drawer
        className={classnames('risk-assessment-drawer', props.className)}
        visible={props.open}
        title={props.isEditing ? `Edit ${RISK_ASSESSMENT_FULLNAME_ENUM[props.editingRiskAsscessment.type]}` : 'Add cardiac risk assessment'}
        onClose={onClose}
        maskClosable={false}
      >
        {!props.isEditing && (
          <NormalSelect
            name="riskAsessmentType"
            className="risk-assessment-type-select"
            title="Risk assessment"
            placeholder="Select a risk assessment"
            options={RISK_ASSESSMENT_OPTIONS}
            isObject
            value={riskAssessmentType}
            onChange={onChangeRiskAssessmentType}
          />
        )}
        {riskAssessmentType
          ? (
            <>
              {riskAssessmentType?.value === RISK_ASSESSMENT_ENUM.CHA2DS2VASc
                && (
                  <CHA2DS2VAScForm
                    cha2ds2vascData={cha2ds2vasc}
                    loading={loading}
                    onAdd={onAdd}
                    onSave={onSave}
                    onSaveAndAddAnother={onSaveAndAddAnother}
                    patientData={props.patientData}
                    isEditing={props.isEditing}
                    onChange={onChange}
                  />
                )}
              {riskAssessmentType?.value === RISK_ASSESSMENT_ENUM.HASBLED
                && (
                  <HasBLEDForm
                    hasBLEDData={hasBled}
                    loading={loading}
                    onAdd={onAdd}
                    onSave={onSave}
                    onSaveAndAddAnother={onSaveAndAddAnother}
                    patientData={props.patientData}
                    isEditing={props.isEditing}
                    onChange={onChange}
                  />
                )}
              {riskAssessmentType?.value === RISK_ASSESSMENT_ENUM.EHRA
                && (
                  <EHRAForm
                    editingEHRA={ehra}
                    loading={loading}
                    onAdd={onAdd}
                    onSave={onSave}
                    onSaveAndAddAnother={onSaveAndAddAnother}
                    onChange={onChange}
                  />
                )}
              {riskAssessmentType?.value === RISK_ASSESSMENT_ENUM.FRS && (
                <FRSForm
                  FRSData={frs}
                  gender={props?.patientData?.gender}
                  age={props?.patientData?.age}
                  loading={loading}
                  onAdd={onAdd}
                  onSave={onSave}
                  onSaveAndAddAnother={onSaveAndAddAnother}
                  onChange={onChange}
                />
              )}
            </>
          ) : (
            <div className="risk-assessment-footer">
              <CustomButton
                className="risk-assessment-footer-btn"
                label="Save & add another"
                ghost
                disabled
              />
              <CustomButton
                className="risk-assessment-footer-btn"
                label="Add"
                type="primary"
                disabled
              />
            </div>
          )}

      </Drawer>

      <ConfirmationLayout
        type={CONFIRMATION_LAYOUT_TYPES.LEAVE}
        visible={isShowConfirmLayout}
        toggleClick={toggleClick}
        onClick={toggleLeaveModal}
      />
    </>
  );
};


RiskAsscessmentDrawer.defaultProps = {
  className: undefined,
  baselineId: '',
  open: false,
  patientData: {},
  editingRiskAsscessment: {
    type: '',
    data: {},
  },
  isEditing: false,
  onClose: () => { },
};

RiskAsscessmentDrawer.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** id of baselie that belong to */
  baselineId: PropTypes.string,
  /** is drawer open */
  open: PropTypes.bool,
  /** patient data */
  patientData: PropTypes.shape(),
  /** risk assessment data */
  editingRiskAsscessment: PropTypes.shape({
    type: PropTypes.oneOf(['cha2ds2vasc', 'frs', 'hasBled', 'ehra']),
    data: PropTypes.shape(),
  }),
  /** is editing risk assessment */
  isEditing: PropTypes.bool,
  /** onClose event */
  onClose: PropTypes.func,
};

export default RiskAsscessmentDrawer;
