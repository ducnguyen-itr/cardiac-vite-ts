import createClient from '../../apolloClient';
import UPDATE_PATIENT_PROFILE_BY_TECHNICIAN from '../../Mutations/updatePatientProfileByTechnician';

const handleUpdatePatientProfileByTechnician = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_PATIENT_PROFILE_BY_TECHNICIAN,
      variables,
    });
    const { updatePatientProfileByTechnician } = result?.data;
    if (!updatePatientProfileByTechnician?.isSuccess) {
      throw updatePatientProfileByTechnician.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdatePatientProfileByTechnician;
