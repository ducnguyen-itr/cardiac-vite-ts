import gql from 'graphql-tag';

const heartValveBaseline = gql`
  {
    status
    valvularDisease
    whichValve
    mitralValveStatus
  }
`;

const pastMedicalBaseline = gql`
  {
    hypertension
    diabetes
    myocardialInfarction
    miniStroke
    chfOrLvd
    obesity
    obstructiveSleepApnea
    cardiothoracicSurgery
    smoke
    hyperthyroidismOrHypothyroidism
    familyHistoryOfAfib
    other
  }
`;

const cha2ds2vascBaseline = gql`
  {
    congestiveHeartFailure
    hypertension
    age2
    age1
    diabetesMellitus
    stroke
    vascularDisease
    sexFemale
  }
`;

const frsBaseline = gql`
  {
    smoker
    totalCholesterol
    hdlCholesterol
    systolicBP
    bloodTreatedMedicines
    gender
    age
  }
`;

const hasBledBaseline = gql`
  {
    hypertension
    abnormalLiverFunction
    abnormalRenalFunction
    stroke
    bleeding
    labileInrs
    elderly65
    drugs
    alcohol
  }
`;

const medicalTestResult = gql`
  {
    _id
    type
    date
    summary
    attachments
    title
  }
`;

const DIAGNOSED_CONDITIONS_BASELINE = gql`
{
  type
  pattern
  onsetDate
  confirmedVia
  othersConditions
  flag
  valvularDisease 
  heartValveReplacement {
    whichValve
    mitralValveStatus
  }
  bioflux {
    studyId
    facilityName
    reportPath
    technicianComment
  }
}`;

const AT_RISK_CONDITIONS = gql`
{
  type
  # notes
  othersConditions
  flag
}`;

const BASELINE_INFO = gql`
{
  afibConfirmed
  afibPattern
  echocardiogramDate
  echocardiogramLVEF
  cha2ds2vasc {
    ...${cha2ds2vascBaseline}
  }
  hasBled {
    ...${hasBledBaseline}
  }
  ehra
  frs {
    ...${frsBaseline}
  }
  stressMedicalTest {
    ...${medicalTestResult}
  }
  bloodMedicalTest {
    ...${medicalTestResult}
  }
  liverMedicalTest {
    ...${medicalTestResult}
  }
  leadEcgMedicalTest {
    ...${medicalTestResult}
  }
  diagnosedConditions {
    ...${DIAGNOSED_CONDITIONS_BASELINE}
  }
  atRiskConditions {
    ...${AT_RISK_CONDITIONS}
  }
  notesAtRiskConditions
}
`;

export default BASELINE_INFO;
