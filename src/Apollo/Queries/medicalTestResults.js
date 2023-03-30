import gql from 'graphql-tag';

const QUERY_MEDICAL_TEST_RESULTS = gql`
  query medicalTestResults($filter: MedicalTestResultFilterInput!, $limit: Int) {
    medicalTestResults(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor 
      medicalTestResults {
        _id
        type
        date
        summary
        title
        # result
        # attachments {
        #   key
        #   fileName
        # }
        # analyzes {
        #   _id
        #   name
        #   value
        #   unit
        #   abnormalFlag
        #   note
        # }
      }
    }
  }
`;

export default QUERY_MEDICAL_TEST_RESULTS;
