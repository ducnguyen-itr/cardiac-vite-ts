import gql from 'graphql-tag';

const DAILY_INPUT_CALENDAR = gql`
  query dailyInputCalendar($carePlanId: ID!, $start: Date!, $end: Date!) {
    dailyInputCalendar(carePlanId: $carePlanId, start: $start, end: $end) {
      _id
      date
      sleepQuality
      sleepDuration
      activityDuration
      activityLevel
      mood
      weights {
        _id
        time
        result
      }
      bmi
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
      bloodPressures {
        _id
        systolic
        diastolic
        type
        time
      }
      symptoms {
        chestPain
        palpitations
        lightHeadedness
        shortnessOfBreath
        abnormalBleeding
        faintingEpisodes
        numbnessInArmOrLeg
        painfulUrination
        poorCirculation
        anginaOrChestDiscomfort
        stroke
      }
      EHRA
      notes
    }
  }
`;
const DAILY_INPUT_CALENDAR_DATE = gql`
  query dailyInputCalendar($carePlanId: ID!, $start: Date!, $end: Date!) {
    dailyInputCalendar(carePlanId: $carePlanId, start: $start, end: $end) {
      _id
      date
    }
  }
`;


const QUERY_DAILY_INPUT_CALENDAR = (key = 0) => {
  switch (key) {
    case 0: {
      return DAILY_INPUT_CALENDAR;
    }
    case 1: {
      return DAILY_INPUT_CALENDAR_DATE;
    }

    default: {
      return DAILY_INPUT_CALENDAR;
    }
  }
};
export default QUERY_DAILY_INPUT_CALENDAR;
