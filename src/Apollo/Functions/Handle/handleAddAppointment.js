import createClient from '../../apolloClient';
import ADĐ_APPOINTMENT from '../../Mutations/addAppointment';

const handleAddAppointment = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: ADĐ_APPOINTMENT,
      variables,
    });
    const { addAppointment } = result?.data;
    if (!addAppointment?.isSuccess) {
      throw addAppointment.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleAddAppointment;
