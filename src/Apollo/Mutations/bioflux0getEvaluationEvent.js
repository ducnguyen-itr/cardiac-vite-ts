import gql from 'graphql-tag';

const GET_EVALUATION_STRIP = gql`
  mutation Bioflux0getEvaluationEvent($studyId: ID!) {
    Bioflux0getEvaluationEvent(studyId: $studyId) {
      isSuccess
      message
    }
  }
`;

export default GET_EVALUATION_STRIP;
