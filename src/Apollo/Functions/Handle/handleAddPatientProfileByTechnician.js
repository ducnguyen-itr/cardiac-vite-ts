import createClient from '../../apolloClient';
import ADD_PATIENT_PROFILE_BY_TECHNICIAN from '../../Mutations/addPatientProfileByTechnician';

const handleAddPatientProfileByTechnician = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADD_PATIENT_PROFILE_BY_TECHNICIAN,
      variables,
    });
    const { addPatientProfileByTechnician } = result?.data;
    if (!addPatientProfileByTechnician?.isSuccess) {
      throw addPatientProfileByTechnician.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddPatientProfileByTechnician;
