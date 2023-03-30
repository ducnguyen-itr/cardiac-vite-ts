import gql from 'graphql-tag';

const DELETE_TIME_SHEET = gql`
  mutation deleteTimesheet($_id: ID!) {
    deleteTimesheet(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_TIME_SHEET;
