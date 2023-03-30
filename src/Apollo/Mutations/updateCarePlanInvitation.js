import gql from 'graphql-tag';

const UPDATE_CAREPLAN_INVITATION = gql`
  mutation updateCarePlanInvitation($_id: ID!, $input: UpdateCarePlanInvitationInput!) {
    updateCarePlanInvitation(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_CAREPLAN_INVITATION;
