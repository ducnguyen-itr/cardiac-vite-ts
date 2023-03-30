import gql from 'graphql-tag';

const TEMPLATE_MESSAGE_QUERY = gql`
  query templateMessage($_id: ID!) {
    templateMessage(_id: $_id) {
      _id
      body
      createdBy
      createdAt
    }
  }
`;

export default TEMPLATE_MESSAGE_QUERY;
