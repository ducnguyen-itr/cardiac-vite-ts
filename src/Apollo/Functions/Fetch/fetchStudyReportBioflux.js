import createClient from '../../apolloClient';
import STUDY_REPORT_BIOFLUX from '../../Queries/studyReportBioflux';

const fetchStudyReportBioflux = async (variables) => {
  try {
    const client = await createClient();
    const reportResult = await client.query({
      query: STUDY_REPORT_BIOFLUX,
      variables,
    });
    const { data } = reportResult;
    return data.Bioflux0report;
  } catch (error) {
    throw error;
  }
};

export default fetchStudyReportBioflux;
