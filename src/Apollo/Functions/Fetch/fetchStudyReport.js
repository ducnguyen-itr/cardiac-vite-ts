import createClient from '../../apolloClient';
import STUDY_REPORT from '../../Queries/studyReport';

const fetchStudyReport = async (variables) => {
  try {
    const client = await createClient();
    const reportResult = await client.query({
      query: STUDY_REPORT,
      variables,
    });
    const { data } = reportResult;
    return data.studyReport;
  } catch (error) {
    throw error;
  }
};

export default fetchStudyReport;
