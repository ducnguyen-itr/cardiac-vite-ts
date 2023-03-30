import createClient from '../../apolloClient';
import CALENDAR_CLINIC_CANCEL_EVENTS from '../../Mutations/clinicCancelEvent';

const handleClinicCancelEvent = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_CLINIC_CANCEL_EVENTS,
      variables,
    });
    const { clinicCancelEvent } = result?.data;
    if (!clinicCancelEvent?.isSuccess) {
      throw clinicCancelEvent.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleClinicCancelEvent;
