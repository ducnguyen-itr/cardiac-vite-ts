import createClient from '../../apolloClient';
import UPDATE_APPOINTMENT from '../../Mutations/updateAppointment';

const handleUpdateAppointment = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_APPOINTMENT,
      variables,
    });
    const { updateAppointment } = result?.data;
    if (!updateAppointment?.isSuccess) {
      throw updateAppointment.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateAppointment;
