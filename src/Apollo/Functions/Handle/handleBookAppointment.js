import createClient from '../../apolloClient';
import CALENDAR_BOOK_APPOINTMENT from '../../Mutations/bookAppointment';

const handleBookAppointment = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: CALENDAR_BOOK_APPOINTMENT,
      variables,
    });
    const { bookAppointment } = result?.data;
    if (!bookAppointment?.isSuccess) {
      throw bookAppointment.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleBookAppointment;
