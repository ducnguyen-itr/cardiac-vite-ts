import gql from 'graphql-tag';
import { SF_36_RESULT } from '../Fragments/patient';

const SF36_RESULTS = gql`
  query sf36Results($filter: SF36ResultFilterInput, $limit: Int) {
    sf36Results(filter: $filter, limit: $limit) {
      ...${SF_36_RESULT}
      date
    }
  }
`;

export default SF36_RESULTS;
