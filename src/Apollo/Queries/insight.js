import gql from 'graphql-tag';

const INSIGHT_QUERY = gql`
  query insight($carePlanId: ID!, $date: Date!) {
    insight(carePlanId: $carePlanId, date: $date) {
      carePlan {
        _id
      }
      startDate
      endDate
      heartRates
      bloodPressure
      bodyTemperatures
      oxygenSaturations
      bmi
      activity {
        durations
        levels
      }
    }
  }
`;

export default INSIGHT_QUERY;
