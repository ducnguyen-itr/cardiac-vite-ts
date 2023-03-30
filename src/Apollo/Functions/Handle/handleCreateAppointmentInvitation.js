import createClient from '../../apolloClient';
import CREATE_APPOINTMENT_INVITATION from '../../Mutations/createAppointmentInvitation';

const handleCreateAppointmentInvitation = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: CREATE_APPOINTMENT_INVITATION,
    variables,
  });
  const { createAppointmentInvitation } = result?.data || {};
  return createAppointmentInvitation;
};

export default handleCreateAppointmentInvitation;
