import gql from 'graphql-tag';

const CHECK_EXIST_USER = gql`
  query checkExistsUser($email: String!) {
    checkExistsUser(email: $email) {
      isExists
      message
    }
  }
`;

export default CHECK_EXIST_USER;
