import gql from 'graphql-tag';

const ADD_SIGNATURE_MUTATION = gql`
  mutation addSignature($signaturePath: String) {
    addSignature(signaturePath: $signaturePath) {
      isSuccess
      message
    }
  }
`;

export default ADD_SIGNATURE_MUTATION;
