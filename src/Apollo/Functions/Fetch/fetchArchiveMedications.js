import createClient from '../../apolloClient';
import ARCHIVE_MEDICATIONS from '../../Queries/archiveMedications';

const fetchArchiveMedications = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: ARCHIVE_MEDICATIONS,
      variables,
    });
    const { archiveMedications } = result?.data || [];
    return archiveMedications;
  } catch (error) {
    throw error;
  }
};

export default fetchArchiveMedications;
