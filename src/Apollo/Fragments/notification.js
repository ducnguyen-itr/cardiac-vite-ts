import gql from 'graphql-tag';
import { ID_NAME } from './user';

const NOTIFICATION_FRAGMENT = gql`
{
  _id
  carePlan {
    _id
    friendlyId
    status
    patient {
      ...${ID_NAME}
      willDeletedAt
    }
    patientDemographic {
      firstName
      lastName
    }
  }
  type
  priority
  report {
    _id
    type
  }
  report {
    _id
  }
  title
  body
  status
  pushTime
  createdAt
}
`;

export default NOTIFICATION_FRAGMENT;
