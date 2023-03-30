import createClient from '../../apolloClient';
import MASTER_DATA from '../../Queries/masterData';

const fetchMasterData = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: MASTER_DATA,
      variables,
    });
    return result?.data?.masterData;
  } catch (error) {
    throw error;
  }
};

export default fetchMasterData;
