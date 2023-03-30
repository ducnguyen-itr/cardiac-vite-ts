import gql from 'graphql-tag';

const CALENDAR_JOIN_CALL = gql`
  mutation joinCall($eventId: ID!) {
    joinCall(eventId: $eventId) {
      isSuccess
      message
      attendee {
        ExternalUserId
        AttendeeId
        JoinToken
      }
      meeting {
        MeetingId
        ExternalMeetingId
        MediaRegion
        MediaPlacement {
          AudioHostUrl
          AudioFallbackUrl
          ScreenDataUrl
          ScreenSharingUrl
          ScreenViewingUrl
          SignalingUrl
          TurnControlUrl
        }
      }
    }
  }
`;

export default CALENDAR_JOIN_CALL;
