import createClient from '../../apolloClient';
import REPORT_QUERY from '../../Queries/report';

const fetchReport = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const reportResult = await client.query({
      query: REPORT_QUERY(key),
      variables,
    });
    const { data } = reportResult;
    return data.report;
  } catch (error) {
    throw error;
  }
};

export default fetchReport;
