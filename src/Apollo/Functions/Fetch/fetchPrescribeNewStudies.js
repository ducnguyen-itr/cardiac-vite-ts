
import createClient from '../../apolloClient';
import PRESCRIBE_NEW_STUDIES from '../../Queries/prescribeNewStudies';

const fetchPrescribeNewStudies = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PRESCRIBE_NEW_STUDIES,
      variables,
    });
    const { data } = result;
    const { prescribeNewStudies } = data;

    return prescribeNewStudies;
  } catch (error) {
    throw error;
  }
};

export default fetchPrescribeNewStudies;
