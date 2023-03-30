import gql from 'graphql-tag';

const QUERY_MEDICATIONS = gql`
  query medications($filter: MedicationFilterInput!, $limit: Int!) {
    medications(filter: $filter, limit: $limit) {
      isSuccess
      message
      medications {
        _id
        type
        status
        name
        quantity
        frequency
        time
        unit
        notes
        updatedAt
        stopDate
        startDate
        associatedConditions {
          code
          description
          diagnosisId
        }
      }
    }
  }
`;

export default QUERY_MEDICATIONS;
