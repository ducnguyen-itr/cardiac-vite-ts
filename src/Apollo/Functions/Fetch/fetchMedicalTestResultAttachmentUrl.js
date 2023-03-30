import createClient from '../../apolloClient';
import QUERY_MEDICAL_TEST_RESULT_ATTACHMENT_URL from '../../Queries/medicalTestResultAttachmentUrl';

const fetchMedicalTestResultAttachmentUrl = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: QUERY_MEDICAL_TEST_RESULT_ATTACHMENT_URL,
      variables,
    });
    return result?.data?.medicalTestResultAttachmentUrl;
  } catch (error) {
    throw error;
  }
};

export default fetchMedicalTestResultAttachmentUrl;
