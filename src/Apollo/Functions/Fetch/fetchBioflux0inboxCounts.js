import createClient from '../../apolloClient';
import BIOFLUX_INBOX_COUNTS from '../../Queries/Bioflux0inboxCounts';

const fetchBioflux0inboxCounts = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: BIOFLUX_INBOX_COUNTS,
    variables,
  });
  const { data } = result;
  const { Bioflux0inboxCounts } = data;
  return Bioflux0inboxCounts;
};

export default fetchBioflux0inboxCounts;
