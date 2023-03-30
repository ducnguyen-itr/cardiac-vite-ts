import gql from 'graphql-tag';

const PRESCRIPTION_HISTORY = gql`
query prescriptionHistory($carePlanId: ID!) {
  prescriptionHistory(carePlanId: $carePlanId) {
    _id
    carePlan
    startDate
    stopDate
    medications {
      name
      quantity
      frequency
      time
      notes
      unit
      status
      createdAt
      prescribeAt
      updatedAt
    }
  }
}
`;

export default PRESCRIPTION_HISTORY;
