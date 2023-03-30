import gql from 'graphql-tag';

const DAILY_INFO_AGGREGATIONS = gql`
  query dailyInfoAggregations($filter: DailyInfoAggregationFilterInput!) {
    dailyInfoAggregations(filter: $filter) {
      _id
      date
      interval
      bloodPressure {
        count
        min {
          systolic
          diastolic
        }
        max {
          systolic
          diastolic
        }
        sum {
          systolic
          diastolic
        }
      }
      heartRate {
        min
        max
        sum
        count
      }
      oxygenSaturation {
        min
        max
        sum
        count
      }
      bodyTemperature {
        min
        max
        sum
        count
      }
      bmi {
        min
        max
        sum
        count
      }
      weight {
        min
        max
        sum
        count
      }
      sleep {
        sum
        count
      }
      activity {
        sum
        count
      }
      medication {
        actualQuantity
        quantity
      }
    }
  }
`;

export default DAILY_INFO_AGGREGATIONS;
