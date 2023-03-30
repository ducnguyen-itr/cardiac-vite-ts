import gql from 'graphql-tag';

const BIOFLUX_UNREAD_INBOX_COUNTS = gql`
  query Bioflux0unreadInboxCounts($filter: Bioflux0InboxFilterInput) {
    Bioflux0unreadInboxCounts(filter: $filter) {
      isSuccess
      message
      count {
        unreadEventCount
        unreadInterimCount
        unreadEouCount
      }
    }
  }
`;

export default BIOFLUX_UNREAD_INBOX_COUNTS;
