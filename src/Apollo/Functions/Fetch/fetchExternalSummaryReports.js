

import createClient from '../../apolloClient';
import BIOHEART_EXTERNAL_SUMMARY_REPORTS from '../../Queries/externalSummaryReports';

const fetchExternalSummaryReports = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOHEART_EXTERNAL_SUMMARY_REPORTS,
      variables,
    });
    const { externalSummaryReports } = result?.data || {};
    return externalSummaryReports;
  } catch (error) {
    throw error;
  }
};

export default fetchExternalSummaryReports;
