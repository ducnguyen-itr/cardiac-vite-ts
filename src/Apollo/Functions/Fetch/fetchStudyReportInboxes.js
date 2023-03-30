import createClient from '../../apolloClient';
import BIOFLUX_INBOXES from '../../Queries/Bioflux0inboxes';

const fetchStudyReportInboxes = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BIOFLUX_INBOXES,
      variables,
    });
    const { Bioflux0inboxes } = result?.data || {};
    return Bioflux0inboxes;
  } catch (error) {
    throw error;
  }
};

export default fetchStudyReportInboxes;
