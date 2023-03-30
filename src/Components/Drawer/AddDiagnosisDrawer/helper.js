import fetchIcdCodes from '../../../Apollo/Functions/Fetch/fetchIcdCodes';
import handleAddDiagnosis from '../../../Apollo/Functions/Handle/handleAddDiagnosis';
import handleUpdateDiagnosis from '../../../Apollo/Functions/Handle/handleUpdateDiagnosis';

export const getICDCodes = async ({ filter = undefined, pagination = { limit: 20 } }) => {
  try {
    const result = await fetchIcdCodes({ filter, pagination });
    const formatted = result.icdCodes.map(icdCode => ({
      ...icdCode,
      label: `(${icdCode.codeNameDisplay}) ${icdCode.longDescription}`,
      value: icdCode.codeNameDisplay,
      isCustom: false,
    }));
    return {
      isSuccess: true,
      data: formatted,
      cursor: result.cursor,
    };
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};

export const createNewDiagnosis = async ({ input }) => {
  try {
    const result = await handleAddDiagnosis({ input });
    return result;
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};

export const updateDiagnosis = async ({ _id, input }) => {
  try {
    const result = await handleUpdateDiagnosis({ _id, input });
    return result;
  } catch (error) {
    return {
      isSuccess: false,
      message: error,
    };
  }
};

export const COMFIRM_VIA_OPTIONS = [
  {
    value: 'Bioflux',
    label: 'Bioflux',
  },
  {
    value: 'ECG',
    label: 'ECG',
  },
  {
    value: 'Holter',
    label: 'Holter',
  },
];

export const CONFIRM_VIA_ENUMS = [

];

export const acuityOptions = [
  { label: 'Unknown', value: 'UNKNOWN' },
  { label: 'Chronic', value: 'CHRONIC' },
  { label: 'Acute', value: 'ACUTE' },
];

export const diagnosedTypeOptions = [
  {
    value: 'Monitored',
    label: 'MONITORED',
  },
  {
    value: 'At-risk',
    label: 'AT_RISK',
  },
  {
    value: 'Historical',
    label: 'HISTORICAL',
  },
];
