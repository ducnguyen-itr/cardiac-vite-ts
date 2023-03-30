import gql from 'graphql-tag';

const CALENDAR_UPDATE_MY_EVENT = gql`
  mutation updateMyEvent($_id: ID!, $input: UpdateMyEventInput!) {
    updateMyEvent(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_UPDATE_MY_EVENT;
