import createClient from '../../apolloClient';
import GET_STUDY_REPORTS from '../../Queries/getStudyReports';

const fetchGetStudyReports = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: GET_STUDY_REPORTS,
      variables,
    });
    const { getStudyReports } = result?.data || {};
    return getStudyReports;
  } catch (error) {
    throw error;
  }
};

export default fetchGetStudyReports;
