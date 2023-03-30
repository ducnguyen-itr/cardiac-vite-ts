import gql from 'graphql-tag';

const DiagnosisFragment = gql`
   {
      primary
      otherPrimary
      second
      otherSecond
      physiciansNote
      patientMedications
   }
`;

export default DiagnosisFragment;
