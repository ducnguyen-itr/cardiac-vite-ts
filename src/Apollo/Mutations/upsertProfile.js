import gql from 'graphql-tag';

const UPSERT_PROFILE = gql`
  mutation upsertProfile($email: String!, $profile: ProfileInput) {
    upsertProfile(email: $email, profile: $profile) {
      isSuccess
      message
    }
  }
`;

export default UPSERT_PROFILE;
