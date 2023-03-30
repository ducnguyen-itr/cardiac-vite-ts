import createClient from '../../apolloClient';
import PRESCRIBE_NEW_STUDY from '../../Queries/prescribeNewStudy';

const fetchPrescribeNewStudy = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: PRESCRIBE_NEW_STUDY,
      variables,
    });
    const { prescribeNewStudy } = result?.data || {};
    return prescribeNewStudy;
  } catch (error) {
    throw error;
  }
};

export default fetchPrescribeNewStudy;
