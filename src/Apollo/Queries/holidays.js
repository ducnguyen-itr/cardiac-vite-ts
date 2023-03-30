import gql from 'graphql-tag';

const CALENDAR_HOLIDAYS = gql`
  query holidays($filter: HolidaysFilter!) {
    holidays(filter: $filter) {
      datetime
      name
      country
    }
  }
`;

export default CALENDAR_HOLIDAYS;
