import gql from 'graphql-tag';

const MARK_INBOX_MUTATION = gql`
  mutation Bioflux0markInbox($input: Bioflux0MarkInboxInput) {
    Bioflux0markInbox(input: $input) {
      isSuccess
      message
    }
  }
`;

export default MARK_INBOX_MUTATION;
