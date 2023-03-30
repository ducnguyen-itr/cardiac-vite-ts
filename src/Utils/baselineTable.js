import _ from 'lodash';
import { mutateDate } from '.';
import { BASELINE_DIAGNOSED_CONDITIONS_AFIB } from '../Constants/baseline';

const checkIsEmptyObject = (object) => {
  let flag = true;
  _.forEach(Object.keys(object), (x) => {
    if (!_.isNil(object[x])) {
      flag = false;
    }
  });
  return flag;
};

const isEmptyData = (key1, key2, key3, key4) => {
  if (_.isEmpty(key1) && _.isEmpty(key2) && _.isEmpty(key3) && _.isEmpty(key4)) return true;
  return false;
};

export const formatBaselineStep8 = ({
  ehraScore,
}) => {
  const res = ehraScore?.title;
  return res?.split(' ')?.[0];
};

const formatMutationDiagnosedConditions = (diagnosedConditions = [], heartValveIssue,
  valvularHeartDisease, heartValveReplacement, mitralValveStatus) => {
  if (diagnosedConditions?.length === 0) {
    return [];
  }
  const tempArr = [];
  _.forEach(diagnosedConditions, (x) => {
    if (x?.type === 'Valvular heart disease') {
      tempArr.push({
        type: x?.type,
        othersConditions: undefined,
        pattern: x?.type === BASELINE_DIAGNOSED_CONDITIONS_AFIB ? x?.pattern : undefined,
        onsetDate: x?.onsetDate ? mutateDate(x?.onsetDate) : undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag || undefined,
        valvularDisease: valvularHeartDisease || x?.valvularDisease || undefined,
      });
      return;
    }
    if (x?.type === 'Heart valve replacement') {
      tempArr.push({
        type: x?.type,
        othersConditions: undefined,
        pattern: x?.type === BASELINE_DIAGNOSED_CONDITIONS_AFIB ? x?.pattern : undefined,
        onsetDate: x?.onsetDate ? mutateDate(x?.onsetDate) : undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag || undefined,
        heartValveReplacement: heartValveReplacement ? {
          whichValve: heartValveReplacement?.[0]?.isCheck && heartValveReplacement?.[1]?.isCheck
            ? 'Left, Right' : heartValveReplacement?.[0]?.isCheck ? 'Left'
              : heartValveReplacement?.[1]?.isCheck ? 'Right' : undefined,
          mitralValveStatus,
        } : {
          mitralValveStatus: x?.heartValveReplacement?.mitralValveStatus,
          whichValve: x?.heartValveReplacement?.whichValve,
        },
      });
      return;
    }
    if (x?.type === 'Atrial Fibrillation') {
      tempArr.push({
        // type: formatMutationBaselineConditions(x?.type),
        type: x?.type,
        othersConditions: undefined,
        // pattern: formatMutationBaselinePatterns(x?.pattern),
        pattern: x?.type === BASELINE_DIAGNOSED_CONDITIONS_AFIB ? x?.pattern : undefined,
        onsetDate: x?.onsetDate ? mutateDate(x?.onsetDate) : undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag || undefined,
        studyId: x?.studyId || undefined,
      });
      return;
    }
    if (x?.type === 'Other') {
      tempArr.push({
        // type: formatMutationBaselineConditions(x?.type),
        type: 'Others',
        othersConditions: x?.othersConditions || undefined,
        // pattern: formatMutationBaselinePatterns(x?.pattern),
        pattern: x?.type === BASELINE_DIAGNOSED_CONDITIONS_AFIB ? x?.pattern : undefined,
        onsetDate: x?.onsetDate ? mutateDate(x?.onsetDate) : undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag || undefined,
      });
      return;
    }
    if (x?.type) {
      tempArr.push({
        // type: formatMutationBaselineConditions(x?.type),
        type: x?.type,
        othersConditions: undefined,
        // pattern: formatMutationBaselinePatterns(x?.pattern),
        pattern: x?.type === BASELINE_DIAGNOSED_CONDITIONS_AFIB ? x?.pattern : undefined,
        onsetDate: x?.onsetDate ? mutateDate(x?.onsetDate) : undefined,
        confirmedVia: x?.confirmedVia || undefined,
        flag: x?.flag || undefined,
      });
    }
  });
  return tempArr;
};

const formatMutationAtRiskConditions = (atRiskConditions = [],
  othersConditions = '', flagArr = [], flagConditions = []) => {
  if (atRiskConditions?.length === 0) {
    return [];
  }
  const tempArr = [];
  _.forEach(atRiskConditions, (x) => {
    if (x.includes('Other: ')) {
      const other = x.slice(7);
      const otherFlagCondition = _.find(flagConditions, x => (x?.type === 'Others' || x?.type === 'Other') && x?.othersConditions === other);
      tempArr.push({
        type: 'Others',
        othersConditions: other,
        flag: otherFlagCondition?.flag || undefined,
      });
    } else {
      const flagCondition = _.find(flagConditions, z => z?.type === x);
      tempArr.push({
        type: x,
        othersConditions: undefined,
        flag: flagCondition?.flag || undefined,
      });
    }
  });
  return tempArr;
};


export const formatBaselineStep1 = ({
  // afibConfirm, afibPattern,
  heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
  diagnosedConditions, notesAtRiskConditions,
  atRiskConditions, othersConditions, flagArr, flagCondition,
}) => {
  if (!heartValveIssue && !valvularHeartDisease && !heartValveReplacement && !mitralValveStatus
    && !diagnosedConditions && !notesAtRiskConditions
    && !atRiskConditions && !othersConditions && !flagArr) return undefined;

  return {
    diagnosedConditions: (diagnosedConditions || heartValveIssue
      || valvularHeartDisease || heartValveReplacement || mitralValveStatus)
      ? formatMutationDiagnosedConditions(diagnosedConditions,
        heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus) : [],
    notesAtRiskConditions: notesAtRiskConditions || undefined,
    atRiskConditions: (atRiskConditions || othersConditions || flagArr)
      ? formatMutationAtRiskConditions(atRiskConditions, othersConditions, flagArr, flagCondition) : [],
    // afibConfirmed: afibConfirm,
    // afibPattern,
  };
};

export const formatBaselineStep2 = ({
  bloodMedicalTest,
  liverMedicalTest,
  leadEcgMedicalTest,

  completeBloodCountDate,
  liverFunctionTestDate,
  leadECGDate,
  completeBloodCountSummary,
  liverFunctionTestSummary,
  leadECGSummary,

  completeBloodCountAttachment,
  liverFunctionTestAttachment,
  leadECGAttachment,
}) => {
  if (!bloodMedicalTest
    && !liverMedicalTest
    && !leadEcgMedicalTest

    && !completeBloodCountDate
    && !liverFunctionTestDate
    && !leadECGDate
    && !completeBloodCountSummary
    && !liverFunctionTestSummary
    && !leadECGSummary

    && !completeBloodCountAttachment
    && !liverFunctionTestAttachment
    && !leadECGAttachment) return undefined;

  return {
    bloodMedicalTest: !isEmptyData(bloodMedicalTest,
      completeBloodCountDate, completeBloodCountSummary, completeBloodCountAttachment)
      ? {
        ...bloodMedicalTest,
        type: 'CBC',
        date: completeBloodCountDate ? mutateDate(completeBloodCountDate) : undefined,
        summary: completeBloodCountSummary || undefined,
        attachments: completeBloodCountAttachment || undefined,
      } : undefined,
    liverMedicalTest: !isEmptyData(liverMedicalTest,
      liverFunctionTestDate, liverFunctionTestSummary, liverFunctionTestAttachment)
      ? {
        ...liverMedicalTest,
        type: 'Liver',
        date: liverFunctionTestDate ? mutateDate(liverFunctionTestDate) : undefined,
        summary: liverFunctionTestSummary || undefined,
        attachments: liverFunctionTestAttachment || undefined,
      } : undefined,
    leadEcgMedicalTest: !isEmptyData(leadEcgMedicalTest, leadECGDate, leadECGSummary, leadECGAttachment) ? {
      ...leadEcgMedicalTest,
      type: 'LeadECG',
      date: leadECGDate ? mutateDate(leadECGDate) : undefined,
      summary: leadECGSummary || undefined,
      attachments: leadECGAttachment || undefined,
    } : undefined,
  };
};


export const formatBaselineStep2CBC = ({
  bloodMedicalTest,
  completeBloodCountDate,
  completeBloodCountSummary,
  completeBloodCountAttachment,
}) => ({
  bloodMedicalTest: !isEmptyData(bloodMedicalTest,
    completeBloodCountDate, completeBloodCountSummary, completeBloodCountAttachment)
    ? {
      ...bloodMedicalTest,
      type: 'CBC',
      date: completeBloodCountDate ? mutateDate(completeBloodCountDate) : undefined,
      summary: completeBloodCountSummary,
      attachments: completeBloodCountAttachment,
    } : undefined,
});


export const formatBaselineStep2Liver = ({
  liverMedicalTest,
  liverFunctionTestDate,
  liverFunctionTestSummary,
  liverFunctionTestAttachment,
}) => {
  if (!liverMedicalTest
    && !liverFunctionTestDate
    && !liverFunctionTestSummary
    && !liverFunctionTestAttachment
  ) return undefined;

  return {
    liverMedicalTest: !isEmptyData(liverMedicalTest,
      liverFunctionTestDate, liverFunctionTestSummary, liverFunctionTestAttachment)
      ? {
        ...liverMedicalTest,
        type: 'Liver',
        date: liverFunctionTestDate ? mutateDate(liverFunctionTestDate) : undefined,
        summary: liverFunctionTestSummary || undefined,
        attachments: liverFunctionTestAttachment || undefined,
      } : undefined,
  };
};

export const formatBaselineStep2Lead = ({
  leadEcgMedicalTest,
  leadECGDate,
  leadECGSummary,
  leadECGAttachment,
}) => {
  if (
    !leadEcgMedicalTest
    && !leadECGDate
    && !leadECGSummary
    && !leadECGAttachment) return undefined;
  return {
    leadEcgMedicalTest: !isEmptyData(leadEcgMedicalTest, leadECGDate, leadECGSummary, leadECGAttachment) ? {
      ...leadEcgMedicalTest,
      type: 'LeadECG',
      date: leadECGDate ? mutateDate(leadECGDate) : undefined,
      summary: leadECGSummary || undefined,
      attachments: leadECGAttachment || undefined,
    } : undefined,
  };
};


export const formatBaselineStep3 = ({
  stressMedicalTest,
  exerciseStressTestingDate,
  exerciseStressTestingSummary,
  exerciseStressTestingAttachment,
  echocardiogramDate,
  echocardiogramLVEF,
}) => {
  if (_.isEmpty(stressMedicalTest) && !exerciseStressTestingDate && !exerciseStressTestingSummary
    && !exerciseStressTestingAttachment && !echocardiogramDate && !echocardiogramLVEF) return undefined;

  return {
    stressMedicalTest: !isEmptyData(stressMedicalTest,
      exerciseStressTestingDate, exerciseStressTestingSummary, exerciseStressTestingAttachment)
      ? {
        ...stressMedicalTest,
        type: 'Stress',
        date: exerciseStressTestingDate ? mutateDate(exerciseStressTestingDate) : undefined,
        summary: exerciseStressTestingSummary || undefined,
        attachments: exerciseStressTestingAttachment || undefined,
      } : undefined,
    echocardiogramDate: echocardiogramDate ? mutateDate(echocardiogramDate) : undefined,
    echocardiogramLVEF: echocardiogramLVEF && !_.isNil(echocardiogramLVEF) ? parseFloat(echocardiogramLVEF) : undefined,
  };
};

export const formatBaselineStep3Echo = ({
  echocardiogramDate,
  echocardiogramLVEF,
}) => {
  if (!echocardiogramDate && !echocardiogramLVEF) return undefined;
  return {
    echocardiogramDate: echocardiogramDate ? mutateDate(echocardiogramDate) : undefined,
    echocardiogramLVEF: echocardiogramLVEF && !_.isNil(echocardiogramLVEF) ? parseFloat(echocardiogramLVEF) : undefined,
  };
};


export const formatBaselineStep3Stress = ({
  stressMedicalTest,
  exerciseStressTestingDate,
  exerciseStressTestingSummary,
  exerciseStressTestingAttachment,

}) => {
  if (_.isEmpty(stressMedicalTest) && !exerciseStressTestingDate && !exerciseStressTestingSummary
    && !exerciseStressTestingAttachment) return undefined;

  return {
    stressMedicalTest: !isEmptyData(stressMedicalTest,
      exerciseStressTestingDate, exerciseStressTestingSummary, exerciseStressTestingAttachment)
      ? {
        ...stressMedicalTest,
        type: 'Stress',
        date: exerciseStressTestingDate ? mutateDate(exerciseStressTestingDate) : undefined,
        summary: exerciseStressTestingSummary || undefined,
        attachments: exerciseStressTestingAttachment || undefined,
      } : undefined,
  };
};

export const formatBaselineStep5 = ({
  pastMedicalHistory,
  pastMedicalOther,
  myocardialInfarction,
}) => {
  if (_.isEmpty(pastMedicalHistory) && !pastMedicalOther && !myocardialInfarction) return undefined;
  return {
    hypertension: !!pastMedicalHistory?.[0].isCheck,
    diabetes: !!pastMedicalHistory?.[1].isCheck,
    // myocardialInfarction: myocardialInfarction ? moment(myocardialInfarction).toISOString() : undefined,
    myocardialInfarction: mutateDate(myocardialInfarction),
    miniStroke: !!pastMedicalHistory?.[3].isCheck,
    chfOrLvd: !!pastMedicalHistory?.[4].isCheck,
    obesity: !!pastMedicalHistory?.[5].isCheck,
    obstructiveSleepApnea: !!pastMedicalHistory?.[6].isCheck,
    cardiothoracicSurgery: !!pastMedicalHistory?.[7].isCheck,
    smoke: !!pastMedicalHistory?.[8].isCheck,
    hyperthyroidismOrHypothyroidism: !!pastMedicalHistory?.[9].isCheck,
    familyHistoryOfAfib: !!pastMedicalHistory?.[10].isCheck,
    other: pastMedicalOther,
  };
};

export const formatBaselineStep6 = ({
  cha2ds2VascScore,
}) => ({
  congestiveHeartFailure: !!cha2ds2VascScore?.[0].isCheck,
  hypertension: !!cha2ds2VascScore?.[1].isCheck,
  age2: !!cha2ds2VascScore?.[2].isCheck,
  age1: !!cha2ds2VascScore?.[3].isCheck,
  diabetesMellitus: !!cha2ds2VascScore?.[4].isCheck,
  stroke: !!cha2ds2VascScore?.[5].isCheck,
  vascularDisease: !!cha2ds2VascScore?.[6].isCheck,
  sexFemale: !!cha2ds2VascScore?.[7].isCheck,
});

export const formatBaselineStep7 = ({
  hasbledClinical,
}) => ({
  hypertension: !!hasbledClinical?.[0].isCheck,
  abnormalLiverFunction: !!hasbledClinical?.[1].isCheck,
  abnormalRenalFunction: !!hasbledClinical?.[2].isCheck,
  stroke: !!hasbledClinical?.[3].isCheck,
  bleeding: !!hasbledClinical?.[4].isCheck,
  labileInrs: !!hasbledClinical?.[5].isCheck,
  elderly65: !!hasbledClinical?.[6].isCheck,
  drugs: !!hasbledClinical?.[7].isCheck,
  alcohol: !!hasbledClinical?.[8].isCheck,
});

export const formatBaselineStep9 = ({
  isEnsurePatientAge,
  smoker,
  totalCholesterol,
  HDLCholesterol,
  systolicBP,
  bloodPressure,
  frsAge,
  frsGender,
}) => {
  if (!isEnsurePatientAge
    && !smoker
    && !totalCholesterol
    && !HDLCholesterol
    && !systolicBP
    && !bloodPressure
    && !frsAge
    && !frsGender) return undefined;
  return {
    smoker: isEnsurePatientAge ? smoker === 'Yes' : undefined,
    totalCholesterol: isEnsurePatientAge && !_.isNil(totalCholesterol) ? parseFloat(totalCholesterol) : undefined,
    hdlCholesterol: isEnsurePatientAge && !_.isNil(HDLCholesterol) ? parseFloat(HDLCholesterol) : undefined,
    systolicBP: isEnsurePatientAge && !_.isNil(systolicBP) ? parseInt(systolicBP, 10) : undefined,
    bloodTreatedMedicines: isEnsurePatientAge ? bloodPressure === 'Yes' : undefined,
    gender: isEnsurePatientAge ? frsGender : undefined,
    age: isEnsurePatientAge ? parseFloat(frsAge) : undefined,
  };
};

export const formatMutateBaselineInfo = (baselineInformation = {}, lastInfor) => {
  const { flagCondition } = lastInfor || {};
  const {
    // afibConfirm, afibPattern,
    heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
    diagnosedConditions, notesAtRiskConditions,
    atRiskConditions, othersConditions,

    // // step2
    bloodMedicalTest,
    liverMedicalTest,
    leadEcgMedicalTest,

    completeBloodCountDate,
    liverFunctionTestDate,
    leadECGDate,
    completeBloodCountSummary,
    liverFunctionTestSummary,
    leadECGSummary,

    completeBloodCountAttachment,
    liverFunctionTestAttachment,
    leadECGAttachment,
    // // step3
    stressMedicalTest,
    exerciseStressTestingDate,
    exerciseStressTestingSummary,
    exerciseStressTestingAttachment,
    echocardiogramDate,
    echocardiogramLVEF,
    // // step 5
    // // step 6
    cha2ds2VascScore,
    // // step 7
    hasbledClinical,
    // // step 8
    ehraScore,
    // // step 9
    isEnsurePatientAge,
    frsAge,
    frsGender,
    smoker,
    totalCholesterol,
    HDLCholesterol,
    systolicBP,
    bloodPressure,
    flagArr,
  } = baselineInformation;

  const step1Data = formatBaselineStep1({
    // afibConfirm,
    // afibPattern,
    heartValveIssue,
    valvularHeartDisease,
    heartValveReplacement,
    mitralValveStatus,
    diagnosedConditions,
    notesAtRiskConditions,
    atRiskConditions,
    othersConditions,
    flagArr,
    flagCondition,
  });
  const step2Data = formatBaselineStep2({
    bloodMedicalTest,
    liverMedicalTest,
    leadEcgMedicalTest,

    completeBloodCountDate,
    liverFunctionTestDate,
    leadECGDate,
    completeBloodCountSummary,
    liverFunctionTestSummary,
    leadECGSummary,

    completeBloodCountAttachment,
    liverFunctionTestAttachment,
    leadECGAttachment,
  });
  const step3Data = formatBaselineStep3({
    stressMedicalTest,
    exerciseStressTestingDate,
    exerciseStressTestingSummary,
    exerciseStressTestingAttachment,
    echocardiogramDate,
    echocardiogramLVEF,
  });

  const cha2ds2vasc = !_.isEmpty(cha2ds2VascScore) ? formatBaselineStep6({
    cha2ds2VascScore,
  }) : undefined;
  const hasBled = !_.isEmpty(hasbledClinical) ? formatBaselineStep7({
    hasbledClinical,
  }) : hasbledClinical;
  const ehra = !_.isEmpty(ehraScore) ? formatBaselineStep8({
    ehraScore,
  }) : undefined;
  const frs = formatBaselineStep9({
    isEnsurePatientAge,
    smoker,
    totalCholesterol,
    HDLCholesterol,
    systolicBP,
    bloodPressure,
    frsAge,
    frsGender,
  });

  const baseline = {
    type: 'Baseline',
    ...step1Data,
    ...step2Data,
    ...step3Data,
    // ...step4Data,
    // pastMedical,
    cha2ds2vasc,
    hasBled,
    ehra,
    frs,
  };
  return baseline;
};


export const formatMutateBaselineInfoV2 = (baselineInformation = {}, info = {}) => {
  const {
    // afibConfirm, afibPattern,
    heartValveIssue, valvularHeartDisease, heartValveReplacement, mitralValveStatus,
    diagnosedConditions, notesAtRiskConditions,
    atRiskConditions, othersConditions,

    // // step2
    bloodMedicalTest,
    liverMedicalTest,
    leadEcgMedicalTest,

    completeBloodCountDate,
    liverFunctionTestDate,
    leadECGDate,
    completeBloodCountSummary,
    liverFunctionTestSummary,
    leadECGSummary,

    completeBloodCountAttachment,
    liverFunctionTestAttachment,
    leadECGAttachment,
    // // step3
    stressMedicalTest,
    exerciseStressTestingDate,
    exerciseStressTestingSummary,
    exerciseStressTestingAttachment,
    echocardiogramDate,
    echocardiogramLVEF,
    // // step 5
    // // step 6
    cha2ds2VascScore,
    // // step 7
    hasbledClinical,
    // // step 8
    ehraScore,
    // // step 9
    isEnsurePatientAge,
    frsAge,
    frsGender,
    smoker,
    totalCholesterol,
    HDLCholesterol,
    systolicBP,
    bloodPressure,
    flagArr,
    flagCondition,
  } = info;
  // baselineInformation
  let step1Data = {};
  if (!checkIsEmptyObject({
    heartValveIssue: baselineInformation?.heartValveIssue,
    valvularHeartDisease: baselineInformation?.valvularHeartDisease,
    heartValveReplacement: baselineInformation?.heartValveReplacement,
    mitralValveStatus: baselineInformation?.mitralValveStatus,
    diagnosedConditions: baselineInformation?.diagnosedConditions,
    notesAtRiskConditions: baselineInformation?.notesAtRiskConditions,
    atRiskConditions: baselineInformation?.atRiskConditions,
    othersConditions: baselineInformation?.othersConditions,
    flagArr: baselineInformation?.flagArr,
  })) {
    step1Data = formatBaselineStep1({
      // afibConfirm,
      // afibPattern,
      heartValveIssue,
      valvularHeartDisease,
      heartValveReplacement,
      mitralValveStatus,
      diagnosedConditions,
      notesAtRiskConditions,
      atRiskConditions,
      othersConditions,
      flagArr,
      flagCondition,
    });
  }

  let step2Data = {};
  if (!checkIsEmptyObject({
    bloodMedicalTest: baselineInformation?.bloodMedicalTest,
    completeBloodCountDate: baselineInformation?.completeBloodCountDate,
    completeBloodCountSummary: baselineInformation?.completeBloodCountSummary,
    completeBloodCountAttachment: baselineInformation?.completeBloodCountAttachment,
  })) {
    step2Data = formatBaselineStep2CBC({
      bloodMedicalTest,
      completeBloodCountDate,
      completeBloodCountSummary,
      completeBloodCountAttachment,
    });
  }

  let step2Liver = {};
  if (!checkIsEmptyObject({
    liverMedicalTest: baselineInformation?.liverMedicalTest,
    liverFunctionTestDate: baselineInformation?.liverFunctionTestDate,
    liverFunctionTestSummary: baselineInformation?.liverFunctionTestSummary,
    liverFunctionTestAttachment: baselineInformation?.liverFunctionTestAttachment,
  })) {
    step2Liver = formatBaselineStep2Liver({
      liverMedicalTest,
      liverFunctionTestDate,
      liverFunctionTestSummary,
      liverFunctionTestAttachment,
    });
  }

  let step2Lead = {};
  if (!checkIsEmptyObject({
    leadEcgMedicalTest: baselineInformation?.leadEcgMedicalTest,
    leadECGDate: baselineInformation?.leadECGDate,
    leadECGSummary: baselineInformation?.leadECGSummary,
    leadECGAttachment: baselineInformation?.leadECGAttachment,

  })) {
    step2Lead = formatBaselineStep2Lead({
      leadEcgMedicalTest,
      leadECGDate,
      leadECGSummary,
      leadECGAttachment,
    });
  }


  let step3DataStress = {};
  if (!checkIsEmptyObject({
    stressMedicalTest: baselineInformation?.stressMedicalTest,
    exerciseStressTestingDate: baselineInformation?.exerciseStressTestingDate,
    exerciseStressTestingSummary: baselineInformation?.exerciseStressTestingSummary,
    exerciseStressTestingAttachment: baselineInformation?.exerciseStressTestingAttachment,
  })) {
    step3DataStress = formatBaselineStep3Stress({
      stressMedicalTest,
      exerciseStressTestingDate,
      exerciseStressTestingSummary,
      exerciseStressTestingAttachment,
    });
  }
  let step3DataEcho = {};
  if (!checkIsEmptyObject({
    echocardiogramDate: baselineInformation?.echocardiogramDate,
    echocardiogramLVEF: baselineInformation?.echocardiogramLVEF,
  })) {
    step3DataEcho = formatBaselineStep3Echo({
      echocardiogramDate,
      echocardiogramLVEF,
    });
  }

  const cha2ds2vasc = !_.isEmpty(baselineInformation?.cha2ds2VascScore) ? formatBaselineStep6({
    cha2ds2VascScore,
  }) : undefined;
  const hasBled = !_.isEmpty(baselineInformation?.hasbledClinical) ? formatBaselineStep7({
    hasbledClinical,
  }) : undefined;
  const ehra = !_.isEmpty(baselineInformation?.ehraScore) ? formatBaselineStep8({
    ehraScore,
  }) : undefined;

  let frs = {};
  if (!checkIsEmptyObject({
    isEnsurePatientAge: baselineInformation?.isEnsurePatientAge,
    smoker: baselineInformation?.smoker,
    totalCholesterol: baselineInformation?.totalCholesterol,
    HDLCholesterol: baselineInformation?.HDLCholesterol,
    systolicBP: baselineInformation?.systolicBP,
    bloodPressure: baselineInformation?.bloodPressure,
    age: baselineInformation?.frsAge,
    gender: baselineInformation?.frsGender,
  })) {
    frs = formatBaselineStep9({
      isEnsurePatientAge,
      smoker,
      totalCholesterol,
      HDLCholesterol,
      systolicBP,
      bloodPressure,
      frsAge,
      frsGender,
    });
  } else {
    frs = undefined;
  }
  const baseline = {
    type: 'Baseline',
    ...step1Data,
    ...step2Data,
    ...step3DataStress,
    ...step2Liver,
    ...step2Lead,
    ...step3DataEcho,
    // ...step4Data,
    // pastMedical,
    cha2ds2vasc,
    hasBled,
    ehra,
    frs,
  };
  return baseline;
};
