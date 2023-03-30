import gql from 'graphql-tag';

const ADD_PRESCRIBE_NEW_STUDY = gql`
  mutation addPrescribeNewStudy($input: PrescribeNewStudyInput) {
    addPrescribeNewStudy(input: $input) {
      isSuccess
      message
    }
  }
`;

export default ADD_PRESCRIBE_NEW_STUDY;
