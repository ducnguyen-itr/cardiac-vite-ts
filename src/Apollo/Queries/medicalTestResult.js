import gql from 'graphql-tag';

const QUERY_MEDICAL_TEST_RESULT = gql`
  query medicalTestResult($_id: ID!) {
    medicalTestResult(_id: $_id) {
      _id
      type
      date
      summary
      title
      result
      attachments {
        _id
        url
        fileName
        extension
      }
      analyzes {
        _id
        name
        value
        unit
        abnormalFlag
        note
      }
    }
  }
`;

export default QUERY_MEDICAL_TEST_RESULT;
