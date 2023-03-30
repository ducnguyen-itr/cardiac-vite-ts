import gql from 'graphql-tag';

const DAILY_ENTRY = gql`
  query dailyEntry($carePlanId: ID!, $start: Date!, $end: Date!) {
    dailyEntry(carePlanId: $carePlanId, start: $start, end: $end) {
      date
      dailyInfo {
        _id
      date
      mood
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
      medication {
        _id
        date
        prescribedMedications {
          name
          quantity
          actualQuantity
          frequency
          time
          actualTime
          unit
          notes
          isTaken
        }
        otherMedications {
          name
          quantity
          actualQuantity
          frequency
          time
          actualTime
          unit
          notes
          isTaken
        }
      }
    }
  }
`;
const DAILY_INPUT_ENTRY_DATE = gql`
  query dailyEntry($carePlanId: ID!, $start: Date!, $end: Date!) {
    dailyEntry(carePlanId: $carePlanId, start: $start, end: $end) {
      date
    }
  }
`;


const QUERY_DAILY_ENTRY = (key = 0) => {
  switch (key) {
    case 0: {
      return DAILY_ENTRY;
    }
    case 1: {
      return DAILY_INPUT_ENTRY_DATE;
    }

    default: {
      return DAILY_ENTRY;
    }
  }
};
export default QUERY_DAILY_ENTRY;
