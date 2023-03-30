import createClient from '../../apolloClient';
import USERS from '../../Queries/users';

const fetchUsers = async (variables, key = 0) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: USERS(key),
      variables,
    });
    return result?.data?.users || [];
  } catch (error) {
    throw error;
  }
};
export default fetchUsers;
