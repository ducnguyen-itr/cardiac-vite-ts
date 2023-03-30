import createClient from '../../apolloClient';
import COUNT_NOTIFICATION_REPORT from '../../Queries/countNotificationReport';

const fetchCountNotificationReport = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: COUNT_NOTIFICATION_REPORT,
      variables,
    });
    return result?.data?.countNotificationReport?.count;
  } catch (error) {
    throw error;
  }
};

export default fetchCountNotificationReport;
