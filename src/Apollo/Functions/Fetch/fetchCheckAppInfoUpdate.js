
import { client } from '../../apolloClient';
import CHECK_APP_INFO_UPDATE from '../../Queries/checkAppInfoUpdate';

const fetchCheckAppInfoUpdate = async (variables) => {
  try {
    // non token
    const result = await client.query({
      query: CHECK_APP_INFO_UPDATE,
      variables,
    });
    const { checkAppInfoUpdate } = result?.data || {};
    return checkAppInfoUpdate;
  } catch (error) {
    throw error;
  }
};

export default fetchCheckAppInfoUpdate;
