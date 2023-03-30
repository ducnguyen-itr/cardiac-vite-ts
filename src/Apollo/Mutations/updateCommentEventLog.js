
import gql from 'graphql-tag';

const UPDATE_COMMENT_EVENT_LOG = gql`
  mutation updateCommentEventLog($_id: ID!, $comment: String) {
    updateCommentEventLog(_id: $_id, comment: $comment) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_COMMENT_EVENT_LOG;
