import gql from 'graphql-tag';

const DAILY_INFOS = gql`
  query dailyInfos($filter: DailyInfoFilterInput!, $limit: Int) {
    dailyInfos(filter: $filter, limit: $limit) {
      isSuccess
      message
      cursor
      dailyInfos {
        _id
        date
        bloodPressures {
          _id
          systolic
          diastolic
          type
          time
        }
        oxygenSaturations {
          _id
          time
          result
        }
        heartRates {
          _id
          time
          result
        }
        bodyTemperatures {
          _id
          time
          result
        }
        sleepTime {
          _id
          bed
          wakeUp
        }
        sleepQuality
        sleepDuration
        activityDuration
        activityLevel
        bmi {
          _id
          time
          result
        }
        weights {
          _id
          time
          result
        }
      }
    }
  }
`;

export default DAILY_INFOS;
