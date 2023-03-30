import gql from 'graphql-tag';

const UPDATE_CAREPLAN_ASSIGNEE = gql`
  mutation updateCarePlanAssignee($input: CarePlanAssigneeInput!) {
    updateCarePlanAssignee(input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_CAREPLAN_ASSIGNEE;
