import gql from 'graphql-tag';

const DAILY_MEDICATION = gql`
query dailyMedication($filter: DailyMedicationFilterInput!) {
  dailyMedication(filter: $filter) {
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
    date
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
`;

export default DAILY_MEDICATION;
