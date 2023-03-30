import createClient from '../../apolloClient';
import UPDATE_PATIENT_DEMOGRAPHIC from '../../Mutations/updatePatientDemographic';

const handleUpdatePatientDemographic = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: UPDATE_PATIENT_DEMOGRAPHIC,
      variables,
    });
    const { updatePatientDemographic } = result?.data || {};
    if (!updatePatientDemographic?.isSuccess) throw updatePatientDemographic.message;
    return updatePatientDemographic;
  } catch (error) {
    throw error;
  }
};

export default handleUpdatePatientDemographic;
