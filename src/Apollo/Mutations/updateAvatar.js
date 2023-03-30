import gql from 'graphql-tag';

const UPDATE_AVATAR = gql`
  mutation updateAvatar($avatarPath: String) {
    updateAvatar(avatarPath: $avatarPath) {
      isSuccess
      message
      user {
        photo
      }
    }
  }
`;

export default UPDATE_AVATAR;
