import gql from 'graphql-tag';

const CALEBDAR_EVENT_BY_FOLLOW_UPS = gql`
  query eventsByFollowUps($followUpIds: [ID]!) {
    eventsByFollowUps(followUpIds: $followUpIds) {
      _id
      fromTime
      toTime
    }
  }
`;

export default CALEBDAR_EVENT_BY_FOLLOW_UPS;
