import createClient from '../../apolloClient';
import REQUEST_FILE_UPLOAD from '../../Queries/requestFileUpload';

const fetchRequestFileUpload = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: REQUEST_FILE_UPLOAD,
      variables,
    });
    const { data } = result;
    const { requestFileUpload } = data;
    return requestFileUpload.urls;
  } catch (error) {
    throw error;
  }
};

export default fetchRequestFileUpload;
