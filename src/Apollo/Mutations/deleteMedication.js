import gql from 'graphql-tag';

const DELETE_MEDICATION = gql`
  mutation deleteMedication($_id: ID!) {
    deleteMedication(_id: $_id) {
      isSuccess
      message
    }
  }
`;

export default DELETE_MEDICATION;
