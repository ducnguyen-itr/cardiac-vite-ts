import gql from 'graphql-tag';

const BIOFLUX_INBOX_COUNTS = gql`
  query Bioflux0inboxCounts($filter: Bioflux0InboxFilterInput) {
    Bioflux0inboxCounts(filter: $filter) {
      eventCount
    }
  }
`;

export default BIOFLUX_INBOX_COUNTS;
