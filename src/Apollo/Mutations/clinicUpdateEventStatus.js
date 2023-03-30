import gql from 'graphql-tag';

const CALENDAR_CLINIC_UPDATE_EVENT_STATUS = gql`
  mutation clinicUpdateEventStatus($_id: ID!, $status: EventStatusEnum!) {
    clinicUpdateEventStatus(_id: $_id, status: $status) {
      isSuccess
      message
    }
  }
`;

export default CALENDAR_CLINIC_UPDATE_EVENT_STATUS;
