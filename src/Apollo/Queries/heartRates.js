import gql from 'graphql-tag';

const HEART_RATES_QUERY = gql`
  query heartRates($filter: HeartRatesFilter!) {
    heartRates(filter: $filter) {
      mins {
        time
        value
      }
      maxs {
        time
        value
      }
      avgs {
        time
        value
      }
      vars {
        time
        value
      }
      endTime 
      fromTime
      interval
    }
  }
`;

const HEART_RATES_RESTING_QUERY = gql`
  query heartRates($filter: HeartRatesFilter!) {
    heartRates(filter: $filter) {
      mins {
        time
        value
      }
      maxs {
        time
        value
      }
      avgs {
        time
        value
      }
      vars {
        time
        value
      }
      endTime 
      fromTime
      interval
    }
  }
`;

const HEART_RATES_VARIABILITY_QUERY = gql`
  query heartRates($filter: HeartRatesFilter!) {
    heartRates(filter: $filter) {
      endTime 
      fromTime
      interval
      vars {
        time
        value
      }
    }
  }
`;

const ACTIVE_MINUTES_ACTIVITY_QUERY = gql`
  query heartRates($filter: HeartRatesFilter!) {
    heartRates(filter: $filter) {
      ceiledActiveMinutes {
        time
        value
      }
      avgs {
        time
        value
      }
      endTime 
      fromTime
      interval
    }
  }
`;

const DAYS_HAVE_HEART_RATE = gql`
  query heartRates($filter: HeartRatesFilter!) {
      heartRates(filter: $filter) {
        avgs {
          time
        }
        endTime 
        fromTime
      }
    }
`;

export const HeartRateQueryEnum = {
  HR: 'HR',
  RESTING_HR: 'RESTING_HR',
  HRV: 'HRV',
  ACTIVE_MINUTES: 'ACTIVE_MINUTES',
  DAYS_HAVE_HR: 'DAY_HAVE_HR',
};

const QUERY_HEART_RATES = (type = HeartRateQueryEnum.HR) => {
  switch (type) {
    case HeartRateQueryEnum.HR:
      return HEART_RATES_QUERY;
    case HeartRateQueryEnum.RESTING_HR:
      return HEART_RATES_RESTING_QUERY;
    case HeartRateQueryEnum.HRV:
      return HEART_RATES_VARIABILITY_QUERY;
    case HeartRateQueryEnum.ACTIVE_MINUTES:
      return ACTIVE_MINUTES_ACTIVITY_QUERY;
    case HeartRateQueryEnum.DAYS_HAVE_HR:
      return DAYS_HAVE_HEART_RATE;
    default:
      return HEART_RATES_QUERY;
  }
};
export default QUERY_HEART_RATES;
