import gql from 'graphql-tag';
import CONTACT from '../Fragments/contact';

const ADD_BULK_PATIENT_BY_TECHNICIAN = gql`
  mutation addBulkPatientByTechnician($input: AddBulkPatientByTechnicianInput!) {
    addBulkPatientByTechnician(input: $input) {
      isSuccess
      message
      patientsError {
        templateId
        email
        firstName
        lastName
        dateOfBirth
        gender
        contact {
          ...${CONTACT}
        }
        height
        weight
      }
    }
  }
`;
export default ADD_BULK_PATIENT_BY_TECHNICIAN;
