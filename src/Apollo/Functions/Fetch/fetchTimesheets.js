import createClient from '../../apolloClient';
import TIME_SHEETS from '../../Queries/timesheets';

const fetchTimesheets = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_SHEETS,
      variables,
    });
    return result?.data?.timesheets;
  } catch (error) {
    throw error;
  }
};
export default fetchTimesheets;
