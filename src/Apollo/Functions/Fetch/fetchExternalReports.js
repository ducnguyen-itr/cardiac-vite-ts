import createClient from '../../apolloClient';
import EXTERNAL_REPORTS from '../../Queries/externalReports';

const fetchExternalReports = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: EXTERNAL_REPORTS,
    variables,
  });

  const { externalReports } = result.data || {};
  return externalReports;
};
export default fetchExternalReports;
