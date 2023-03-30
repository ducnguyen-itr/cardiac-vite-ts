import gql from 'graphql-tag';
import { ID_NAME } from '../Fragments/user';

const PATIENTS = gql`
query patients($filter: PatientFilterInput!, $limit: Int) {
  patients(filter: $filter, limit: $limit) {
    _id
    firstName
    lastName
    contact {
      email
    }
    currentCarePlan {
      _id
      nurse {
        ...${ID_NAME}
      }
      physician {
        ...${ID_NAME}
      }
    }
  }
}
`;

export default PATIENTS;
