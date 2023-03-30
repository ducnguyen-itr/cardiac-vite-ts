import gql from 'graphql-tag';

const INDIVIDUAL_WORKING_TIME = gql`
  {
    from {
      h
      m
    }
    to {
      h
      m
    }
    excludeHoliday
  }
`;

export default INDIVIDUAL_WORKING_TIME;
