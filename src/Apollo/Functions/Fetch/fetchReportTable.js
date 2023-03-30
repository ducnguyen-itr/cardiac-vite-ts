import createClient from '../../apolloClient';
import REPORT_TABLE_QUERY from '../../Queries/reportTable';

const fetchReportTable = async (_id, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: REPORT_TABLE_QUERY(key),
      variables: { _id },
    });
    return result?.data?.report;
  } catch (error) {
    throw error;
  }
};

export default fetchReportTable;
