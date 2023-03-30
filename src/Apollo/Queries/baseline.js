import gql from 'graphql-tag';

const QUERY_BASELINE_DIAGNOSIS = gql`
  query baseline($carePlanId: ID!) {
    baseline(carePlanId: $carePlanId) {
      _id
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
  }
`;

const QUERY_BASELINE_RISK_ASSESSMENT = gql`
  query baseline($carePlanId: ID!) {
    baseline(carePlanId: $carePlanId) {
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
    }
  }
`;

const QUERY_BASELINE = (key = 0) => {
  switch (key) {
    case 0: {
      return QUERY_BASELINE_DIAGNOSIS;
    }
    case 1: {
      return QUERY_BASELINE_RISK_ASSESSMENT;
    }

    default: {
      return QUERY_BASELINE_DIAGNOSIS;
    }
  }
};

export default QUERY_BASELINE;
