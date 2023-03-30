import gql from 'graphql-tag';

const ARCHIVE_MEDICATIONS = gql`
query archiveMedications($carePlanId: ID!) {
  archiveMedications(carePlanId: $carePlanId) {
    name
    quantity
    frequency
    unit
    time
    notes
    status
    createdAt
    prescribeAt
    updatedAt
  }
}
`;

export default ARCHIVE_MEDICATIONS;
