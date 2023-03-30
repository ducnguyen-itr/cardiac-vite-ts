import createClient from '../../apolloClient';
import TIME_LOGGED_QUERY from '../../Queries/timeLogged';

const fetchTimeLogged = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TIME_LOGGED_QUERY,
      variables,
    });
    return result?.data?.timeLogged;
  } catch (error) {
    throw error;
  }
};
export default fetchTimeLogged;
