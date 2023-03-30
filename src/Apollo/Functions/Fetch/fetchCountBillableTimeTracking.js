import createClient from '../../apolloClient';
import COUNT_BILLABLE_TIME_TRACKING from '../../Queries/countBillableTimeTracking';

const fetchCountBillableTimeTracking = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: COUNT_BILLABLE_TIME_TRACKING,
    variables,
  });
  return result?.data?.countBillableTimeTracking?.count;
};

export default fetchCountBillableTimeTracking;
