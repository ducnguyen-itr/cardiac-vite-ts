import createClient from '../../apolloClient';
import CHECK_EXIST_USER from '../../Queries/checkExistsUser';

const fetchCheckExistsUser = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: CHECK_EXIST_USER,
      variables,
    });
    return result.data;
  } catch (error) {
    throw error;
  }
};
export default fetchCheckExistsUser;
