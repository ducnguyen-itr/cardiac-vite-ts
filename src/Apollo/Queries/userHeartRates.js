import gql from 'graphql-tag';
import { HeartRateQueryEnum } from '../../Constants/bioheart';

const HEART_RATES_QUERY = gql`
  query userHeartRates($filter: UserHeartRatesFilter!) {
    userHeartRates(filter: $filter) {
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
  query userHeartRates($filter: UserHeartRatesFilter!) {
    userHeartRates(filter: $filter) {
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

const HEART_RATES_ACTIVITY_QUERY = gql`
  query userHeartRates($filter: UserHeartRatesFilter!) {
    userHeartRates(filter: $filter) {
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


const QUERY_USER_HEART_RATES = (type = HeartRateQueryEnum.HR) => {
  switch (type) {
    case HeartRateQueryEnum.HR:
      return HEART_RATES_QUERY;
    case HeartRateQueryEnum.RESTING_HR:
      return HEART_RATES_RESTING_QUERY;
    case HeartRateQueryEnum.ACTIVITY_HR:
      return HEART_RATES_ACTIVITY_QUERY;
    default:
      return HEART_RATES_QUERY;
  }
};
export default QUERY_USER_HEART_RATES;
