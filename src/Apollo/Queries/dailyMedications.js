import gql from 'graphql-tag';

const DAILY_MEDICATIONS = gql`
  query dailyMedications($filter: DailyMedicationFilter!, $limit: Int) {
    dailyMedications(filter: $filter, limit: $limit) {
      isSuccess
      message
      dailyMedications {
        date
        prescribedMedications {
          time
          actualQuantity
          quantity
          isTaken
        }
      }
    }
  }
`;

export default DAILY_MEDICATIONS;
