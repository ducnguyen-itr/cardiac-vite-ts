import createClient from '../../apolloClient';
import FOLLOW_UPS_QUERY from '../../Queries/followUps';

const fetchFollowUps = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: FOLLOW_UPS_QUERY(key),
      variables,
    });
    const { followUps } = result?.data;
    return followUps;
  } catch (error) {
    throw error;
  }
};

export default fetchFollowUps;
