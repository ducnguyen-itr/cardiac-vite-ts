import gql from 'graphql-tag';

const DELETE_DIAGNOSIS = gql`
  mutation deleteDiagnosis($_id: ID!, $diagnosisId: ID!) {
    deleteDiagnosis(_id: $_id, diagnosisId: $diagnosisId){
      isSuccess
      message
    }
  }
`;

export default DELETE_DIAGNOSIS;
