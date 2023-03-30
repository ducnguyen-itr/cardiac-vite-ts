import createClient from '../../apolloClient';
import TIME_SHEET from '../../Queries/timesheet';

const fetchTimesheet = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_SHEET,
      variables,
    });
    return result?.data?.timesheet;
  } catch (error) {
    throw error;
  }
};
export default fetchTimesheet;
