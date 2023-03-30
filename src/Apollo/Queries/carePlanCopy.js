import gql from 'graphql-tag';
import { CONTACT, INFO_INSURANCE } from '../Fragments/patient';
import { ID_NAME } from '../Fragments/user';

const CARE_PLAN_COPY_QUERY = gql`
  query carePlan($_id: ID!) {
    carePlan(_id: $_id) {
      _id
      status
      patient {
        ...${ID_NAME}
        email
        contact {
          ...${CONTACT}
        }
        settings{
          isMetric
        }
        dateOfBirth
        height
        weight
        patientInfo {
          ...${INFO_INSURANCE}
        }
        gender
      }
      facility {
        _id
        name
        canUseBiofluxDirect
      }
    }
  }
`;

export default CARE_PLAN_COPY_QUERY;
