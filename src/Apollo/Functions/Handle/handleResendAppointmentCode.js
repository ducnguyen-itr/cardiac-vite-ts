import createClient from '../../apolloClient';
import RESEND_APPOINTMENT_CODE from '../../Mutations/resendAppointmentCode';

const handleResendAppointmentCode = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: RESEND_APPOINTMENT_CODE,
    variables,
  });
  const { resendAppointmentCode } = result?.data;
  return resendAppointmentCode;
};

export default handleResendAppointmentCode;
