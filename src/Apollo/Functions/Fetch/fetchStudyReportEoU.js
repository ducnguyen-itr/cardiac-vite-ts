import createClient from '../../apolloClient';
import STUDY_REPORT_EOU from '../../Queries/studyReportEoU';

const fetchStudyReportEoU = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: STUDY_REPORT_EOU,
      variables,
    });
    const { studyReportEoU } = result?.data || {};
    return studyReportEoU;
  } catch (error) {
    throw error;
  }
};

export default fetchStudyReportEoU;
