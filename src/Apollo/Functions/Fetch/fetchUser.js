import createClient from '../../apolloClient';
import USER from '../../Queries/user';

const fetchUser = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: USER(key),
      variables,
    });
    return result?.data?.user;
  } catch (error) {
    throw error;
  }
};
export default fetchUser;
