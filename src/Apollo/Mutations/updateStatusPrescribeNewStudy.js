import gql from 'graphql-tag';

const UPDATE_STATUS_PRESCRIBE_NEW_STUDY = gql`
  mutation updateStatusPrescribeNewStudy($_id: ID!, $status: String!) {
    updateStatusPrescribeNewStudy(_id: $_id, status: $status) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_STATUS_PRESCRIBE_NEW_STUDY;
