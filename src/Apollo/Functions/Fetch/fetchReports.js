import createClient from '../../apolloClient';
import REPORTS_QUERY from '../../Queries/reports';

const fetchReports = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: REPORTS_QUERY(key),
      variables,
    });
    return result?.data?.reports;
  } catch (error) {
    throw error;
  }
};

export default fetchReports;
