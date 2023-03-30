import createClient from '../../apolloClient';
import STUDY_REPORTS from '../../Queries/studyReports';

const fetchStudyReports = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: STUDY_REPORTS,
      variables,
    });
    const { studyReports } = result?.data || {};
    return studyReports;
  } catch (error) {
    throw error;
  }
};

export default fetchStudyReports;
