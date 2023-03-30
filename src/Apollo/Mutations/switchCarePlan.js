import gql from 'graphql-tag';

const SWITCH_CAREPLAN = gql`
  mutation switchCarePlan($_id: ID!, $programType: ProgramTypeEnum!) {
    switchCarePlan(_id: $_id, programType: $programType) {
      isSuccess
      message
      carePlan {
        _id
        status
      }
    }
  }
`;

export default SWITCH_CAREPLAN;
