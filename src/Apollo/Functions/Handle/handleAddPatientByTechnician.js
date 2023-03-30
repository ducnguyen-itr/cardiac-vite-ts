import createClient from '../../apolloClient';
import ADD_PATIENT_BY_TECHNICIAN from '../../Mutations/addPatientByTechnician';

const handleAddPatientByTechnician = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: ADD_PATIENT_BY_TECHNICIAN,
      variables,
    });
    const { addPatientByTechnician } = result?.data || {};
    if (!addPatientByTechnician?.isSuccess) {
      throw addPatientByTechnician.message;
    }
  } catch (error) {
    throw error;
  }
};
export default handleAddPatientByTechnician;
