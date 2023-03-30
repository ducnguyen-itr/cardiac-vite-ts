import gql from 'graphql-tag';
import BASELINE_INFO from '../Fragments/baseline';
import { INVITATION } from '../Fragments/invitation';
import {
  AFIB_HISTORY, FACILITY, PATIENT_EMAIL_PHONE, PATIENT_INFO, PATIENT_INFO_DETAIL_FRAGMENT, SF_36_RESULT,
} from '../Fragments/patient';
import PATIENT_DEMOGRAPHIC from '../Fragments/patientDemographic';
import SIGN_CMM_CONSENT from '../Fragments/signCMMConsent';
import { ROLE_USER_NAME, USER_NAME } from '../Fragments/user';

const biofluxBaseline = gql`
  {
    diagnosis
    comment
    attachments
  }
`;

const BIOHEART_MONITOR = gql`
{
  isEnabled
  reportFrequency
  deviceId
  setUpDate
}
`;

const CAREPLAN_OVERVIEW = gql`
  {
    equipmentProvided {
      deviceName
      displayName
      deviceId
      setUpDate
    }
    frequencyOfBloodTest
    nextBloodTest
    typesOfBloodTests
    timeUnitOfBloodTest
    frequencyOfStressTest
    nextStressTest
    timeUnitOfStressTest
    frequencyOfFollowUp
    nextDueOnFollowUp
    notes
    currentDiseases
    monitoredDiseases
  }
`;

const CAREPLAN_PRESCRIPTION = gql`
  {
    carePlan
    startDate
    stopDate
    medications {
      name
      quantity
      frequency
      time
      notes
      unit
    }
  }
`;

export const CAREPLANE_REPORT_SETTING = gql`
  {
    isReportAccessNurse
    isEnableBloodPressure
    minBloodPressureDenominator
    minBloodPressureNumerator
    maxBloodPressureNumerator
    maxBloodPressureDenominator
    isEnableInr
    minInr
    maxInr
    isEnableHeartRate
    minHeartRate
    maxHeartRate
    isEnableOxygenSaturation
    minOxygenSaturation
    maxOxygenSaturation
    isEnableBodyTemperature
    minBodyTemperature
    maxBodyTemperature
    isEnableSleepLevel
    sleepLevel
    consecutiveSleepDisturbance
    isEnableEhraScore
    minEhraScore
    maxEhraScore
    consecutiveEhra
    isEnableMedicationCompliance
    isEnableMedicationOverdose
    medicationOverdose
    medicationComplianceNurse
    medicationCompliancePhysician
    isEnableShortnessOfBreath
    shortnessOfBreath
    isEnableChestPain
    chestPain
    isEnableAbnormalBleed
    abnormalBleed
    isEnableLightHeadedness
    lightHeadedness
    isEnablePalpitations
    palpitations
    notes
    weightLoss {
      enable
      dayThreshold
      weekThreshold
    }
    weightGain {
      enable
      dayThreshold
      weekThreshold
    }

    # maxEhraScore
    # medicationCompliancePhysician
    # minHeartRate
    # maxHeartRate
    # sleepDisturbanceChange
  }
`;

const CP_PATIENT_INFO = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      friendlyId
      status
      startDate
      source
      createdAt
      prescription {
        medications {
          name
        }
      }
      deletedDate
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      patient {
        ...${PATIENT_INFO}
        bioheartMonitor {
          isAuthorized
        }
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      reason
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      programType
    }
  }
`;

const CAREPLAN_NEW_REGISTERED = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      status
      friendlyId
      source
      signCMMConsent {
       ...${SIGN_CMM_CONSENT}
      }
      startDate
      nurseStatus
      createdAt
      patient {
        ...${PATIENT_INFO_DETAIL_FRAGMENT}
        bioheartMonitor {
          isAuthorized
        }
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      sf36Result {
        ...${SF_36_RESULT}
      }
      afibHistory {
        ...${AFIB_HISTORY}
      }
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      allergies
    }
  }
`;

const CAREPLAN_NEW_ASSIGNED = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      status
      friendlyId
      source
      createdAt
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
      startDate
      patient {
        ...${PATIENT_INFO_DETAIL_FRAGMENT}
        bioheartMonitor {
          isAuthorized
        }
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      reason
      info {
        ...${CAREPLAN_OVERVIEW}
      }
      prescription {
        ...${CAREPLAN_PRESCRIPTION}
      }
      reportSetting {
        ...${CAREPLANE_REPORT_SETTING}
      }
      sf36Result {
        ...${SF_36_RESULT}
      }
      afibHistory {
        ...${AFIB_HISTORY}
      }
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      allergies
      programType
    }
  }
`;

const CAREPLAN_NEW_MD = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      status
      physicianStatus
      friendlyId
      source
      createdAt
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
      startDate
      patient {
        ...${PATIENT_INFO_DETAIL_FRAGMENT}
        bioheartMonitor {
          isAuthorized
        }
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      reason
      info {
        ...${CAREPLAN_OVERVIEW}
      }
      prescription {
        ...${CAREPLAN_PRESCRIPTION}
      }
      reportSetting {
        ...${CAREPLANE_REPORT_SETTING}
      }
      sf36Result {
        ...${SF_36_RESULT}
      }
      afibHistory {
        ...${AFIB_HISTORY}
      }
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      allergies
      programType
    }
  }
`;

const ACTIVE_NURSE_CAREPLAN_QUERY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      status
      friendlyId
      startDate
      createdAt
      source
      createdAt
      activityHistory {
        fromDate
        toDate
      }
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
      stopDate
      patient {
        ...${PATIENT_INFO_DETAIL_FRAGMENT}
        bioheartMonitor {
          isAuthorized
        }
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      reason
      info {
        ...${CAREPLAN_OVERVIEW}
      }
      reportSetting {
        ...${CAREPLANE_REPORT_SETTING}
      }
      sf36Result {
        ...${SF_36_RESULT}
      }
      afibHistory {
        ...${AFIB_HISTORY}
      }
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      allergies
      programType
    }
  }
`;

const ACTIVE_MD_CAREPLAN_QUERY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      status
      friendlyId
      startDate
      stopDate
      source
      createdAt
      activityHistory {
        fromDate
        toDate
      }
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
      patient {
        ...${PATIENT_INFO_DETAIL_FRAGMENT}
        bioheartMonitor {
          isAuthorized
        }
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      info {
        ...${CAREPLAN_OVERVIEW}
      }
      reason
      reportSetting {
        ...${CAREPLANE_REPORT_SETTING}
      }
      sf36Result {
        ...${SF_36_RESULT}
      }
      afibHistory {
        ...${AFIB_HISTORY}
      }
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      allergies
    }
  }
`;

const CAPEPLAN_ID = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      friendlyId
    }
  }
`;

const CAPEPLAN_FACILITY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      facility {
        _id
        name
        canUseBiofluxDirect
      }
    }
  }
`;

const CAPEPLAN_APPOINTMENT_DATA = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      friendlyId
      status
      startDate
      source
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
      patient {
        ...${PATIENT_INFO}
      }
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      facility {
        ...${FACILITY}
      }
      physician {
        ...${USER_NAME}
      }
      nurse {
        ...${USER_NAME}
      }
      info {
        frequencyOfFollowUp
        nextDueOnFollowUp
      }
    }
  }
`;

const CAPEPLAN_BIOHEART_DATA = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      bioheartMonitor {
        ...${BIOHEART_MONITOR}
      }
      patient {
        bioheartMonitor {
          isAuthorized
        }
      }
    }
  }
`;
const CAPEPLAN_STUDY_DATA = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      programType
      _id
      friendlyId
      patientDemographic {
        ...${PATIENT_DEMOGRAPHIC}
      }
      patient {
        ...${PATIENT_EMAIL_PHONE}
      }
      facility {
        ...${FACILITY}
      }
      nurse {
        ...${ROLE_USER_NAME}
      }
      physician {
        ...${ROLE_USER_NAME}
      }
      startDate
      prescription {
        medications {
          name
        }
      }
      info {
        frequencyOfFollowUp
        nextDueOnFollowUp
      }
    }
  }
`;

const CAREPLAN_MEDICAL_TEST_RESULT = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      medicalTestResults {
        _id
        type
        date
        summary
        attachments {
          key
          fileName
          extension
        }
        title
        result
      }
    }
  }
`;

const CAREPLAN_CCM_CONSENT = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      signCMMConsent {
        ...${SIGN_CMM_CONSENT}
      }
    }
  }
`;

const CAREPLAN_NOTE = gql`
query carePlan($_id: ID!) {
  carePlan(_id: $_id) {
    _id
    note {
      content
      lastUpdatedAt
      modifyBy {
        _id
        firstName
        lastName
      }
    }
  }
}
`;

const CAREPLAN_MEDICAL_RECORD = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      allergies
      programType
      baseline {
        _id
        ehra
        frs {
          smoker
          totalCholesterol
          hdlCholesterol
          systolicBP
          bloodTreatedMedicines 
          gender
          age
        }
        hasBled {
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
        cha2ds2vasc {
          congestiveHeartFailure
          hypertension
          age2
          age1
          diabetesMellitus
          stroke
          vascularDisease
          sexFemale
        }
        diagnosis {
          _id
          code
          description
          acuity
          onsetDate
          diagnosedDate
          confirmedVia
          associatedMedications 
          diagnosedTypes
          note
          customCode
          valid
          biofluxReport {
            studyId
            facilityName
            reportPath
            technicianComment
          }
        }
      }
      afibHistory {
        hadCardioversion
        electricalShock
        isHospitalized
        hospitalizedDate
        symptomHistory {
          lightHeadedness
          fatigue
          decreasingExerciseCapacity
          dyspnea
          syncope
          palpitations
          chestPainTimePerWeek
          increasingFrequencyOfChestPain
          numberInArmOrLeg
          painfulUrination
        }
      }
    }
  }
`;


const CAREPLAN_PAST_MEDICAL_HISTORY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      afibHistory {
        hadCardioversion
        electricalShock
        isHospitalized
        hospitalizedDate
        symptomHistory {
          lightHeadedness
          fatigue
          decreasingExerciseCapacity
          dyspnea
          syncope
          palpitations
          chestPainTimePerWeek
          increasingFrequencyOfChestPain
          numberInArmOrLeg
          painfulUrination
        }
      }
    }
  }
`;

const CAREPLAN_ALLERGIES = gql`
query carePlan($_id: ID!) {
  carePlan(_id: $_id) {
    _id
    allergies
  }
}
`;


const CAREPLAN = (key = 0) => {
  switch (key) {
    case 0: {
      return CP_PATIENT_INFO;
    }
    case 1: {
      return CAREPLAN_NEW_REGISTERED;
    }
    case 2: {
      return CAREPLAN_NEW_ASSIGNED;
    }
    case 3: {
      return CAREPLAN_NEW_MD;
    }
    case 4: {
      return ACTIVE_NURSE_CAREPLAN_QUERY;
    }
    case 5: {
      return ACTIVE_MD_CAREPLAN_QUERY;
    }
    case 6: {
      return CAPEPLAN_ID;
    }
    case 7: {
      return CAPEPLAN_FACILITY;
    }
    case 8: {
      return CAPEPLAN_APPOINTMENT_DATA;
    }
    case 9: {
      return CAPEPLAN_BIOHEART_DATA;
    }
    case 10: {
      return CAPEPLAN_STUDY_DATA;
    }
    case 11: {
      return CAREPLAN_MEDICAL_TEST_RESULT;
    }
    case 12: {
      return CAREPLAN_CCM_CONSENT;
    }
    case 13: {
      return CAREPLAN_MEDICAL_RECORD;
    }
    case 14: {
      return CAREPLAN_NOTE;
    }
    case 15: {
      return CAREPLAN_PAST_MEDICAL_HISTORY;
    }
    case 16: {
      return CAREPLAN_ALLERGIES;
    }
    default: {
      return CP_PATIENT_INFO;
    }
  }
};

export default CAREPLAN;
