import createClient from '../../apolloClient';
import ADD_BULK_PATIENT_BY_TECHNICIAN from '../../Mutations/addBulkPatientByTechnician';

const handleAddBulkPatientByTechnician = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: ADD_BULK_PATIENT_BY_TECHNICIAN,
      variables,
    });
    const { addBulkPatientByTechnician } = result?.data || {};
    if (!addBulkPatientByTechnician?.isSuccess) {
      throw addBulkPatientByTechnician;
    }
    return addBulkPatientByTechnician;
  } catch (error) {
    throw error;
  }
};
export default handleAddBulkPatientByTechnician;
