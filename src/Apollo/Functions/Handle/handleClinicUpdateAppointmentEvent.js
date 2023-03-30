import createClient from '../../apolloClient';
import CALENDAR_CLINIC_UPDATE_APPOINTMENT from '../../Mutations/clinicUpdateAppointmentEvent';

const handleClinicUpdateAppointmentEvent = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_CLINIC_UPDATE_APPOINTMENT,
      variables,
    });
    const { clinicUpdateAppointmentEvent } = result?.data;
    if (!clinicUpdateAppointmentEvent?.isSuccess) {
      throw clinicUpdateAppointmentEvent.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleClinicUpdateAppointmentEvent;
