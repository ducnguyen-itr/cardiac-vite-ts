import createClient from '../../apolloClient';
import CALENDER_CLINIC_CREATE_APPOINTMENT from '../../Mutations/clinicCreateAppointment';

const handleClinicCreateAppointment = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: CALENDER_CLINIC_CREATE_APPOINTMENT,
    variables,
  });
  const { clinicCreateAppointment } = result?.data || {};
  return clinicCreateAppointment;
};

export default handleClinicCreateAppointment;
