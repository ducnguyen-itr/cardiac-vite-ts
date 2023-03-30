import _ from 'lodash';
import moment from 'moment';
import { TableNames } from '../../Constants';

const {
  Inactive, NewRegistered, NewAssigned, NewMD, Active,
} = TableNames;

export const getShowButton = (patientData, hyperName) => {
  if (_.isEmpty(patientData) || !hyperName) return {};
  const {
    isUnLinked, nurse, physician, willDeletedAt,
  } = patientData || {};
  const isInactive = hyperName === Inactive;
  const isOverDelete = willDeletedAt && moment(willDeletedAt, 'YYYY-MM-DD').valueOf() < moment().valueOf();
  return {
    isShowReferenceCode: isUnLinked && !isInactive,
    isShowCreateApt: !isInactive,
    isShowStartCarePlan: [NewAssigned, NewMD].includes(hyperName) && nurse?._id && physician?._id,
    isShowReactivateCarePlan: isInactive && !isOverDelete,
    isShowDeleteCarePlan: [NewRegistered, NewAssigned, NewMD].includes(hyperName),
    isShowStartDate: ![NewRegistered, NewAssigned, NewMD].includes(hyperName),
    isShowStopDate: isInactive,
    isShowStopCarePlan: hyperName === Active,
  };
};

export const formatNoteData = (data = {}) => {
  const { note } = data || {};
  if (_.isEmpty(note)) return {};
  const { content, lastUpdatedAt, modifyBy } = note || {};
  return {
    content,
    date: (lastUpdatedAt && moment(lastUpdatedAt).isValid())
      ? moment(lastUpdatedAt).format('MM/DD/YYYY hh:mm A') : '',
    name: `${modifyBy?.firstName} ${modifyBy?.lastName}`,
  };
};

export const onClick = ({ key, ...props }) => {
  const {
    toggleResendReferenceModal, onClickCreateApt, onClickSwitchProgramType, handleStartHC, onClickStopHealthCareProgram, toggleReactivateCarePlanModal, onClickDeleteCarePlan,
  } = props || {};
  switch (key) {
    case '1':
      toggleResendReferenceModal();
      break;
    case '2':
      onClickCreateApt();
      break;
    case '3':
      handleStartHC(false);
      break;
    case '4':
      onClickStopHealthCareProgram();
      break;
    case '5':
      toggleReactivateCarePlanModal();
      break;
    case '6':
      onClickDeleteCarePlan();
      break;
    case '7':
      onClickSwitchProgramType();
      break;
    default: break;
  }
};
