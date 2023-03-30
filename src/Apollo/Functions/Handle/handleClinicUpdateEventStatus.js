import createClient from '../../apolloClient';
import CALENDAR_CLINIC_UPDATE_EVENT_STATUS from '../../Mutations/clinicUpdateEventStatus';

const handleClinicUpdateEventStatus = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_CLINIC_UPDATE_EVENT_STATUS,
      variables,
    });
    const { clinicUpdateEventStatus } = result?.data;
    if (!clinicUpdateEventStatus?.isSuccess) throw clinicUpdateEventStatus.message;
  } catch (error) {
    throw error;
  }
};

export default handleClinicUpdateEventStatus;
