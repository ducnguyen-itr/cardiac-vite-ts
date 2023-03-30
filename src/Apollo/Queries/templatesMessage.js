import gql from 'graphql-tag';

const TEMPLATES_MESSAGE_QUERY = gql`
  query templatesMessage($filter: TemplateMessageFilterInput!, $limit: Int) {
    templatesMessage(filter: $filter, limit: $limit) {
      isSuccess
      message
      templatesMessage {
        _id
        body
        createdBy
        createdAt
      }
      cursor
    }
  }
`;

export default TEMPLATES_MESSAGE_QUERY;
