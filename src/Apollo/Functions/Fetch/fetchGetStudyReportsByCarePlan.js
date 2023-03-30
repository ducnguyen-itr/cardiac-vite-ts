import createClient from '../../apolloClient';
import GET_STUDY_REPORTS_BY_CARE_PLAN from '../../Queries/getStudyReportsByCarePlan';

const fetchAppointment = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: GET_STUDY_REPORTS_BY_CARE_PLAN,
      variables,
    });
    const { getStudyReportsByCarePlan } = result?.data || {};
    return getStudyReportsByCarePlan;
  } catch (error) {
    throw error;
  }
};

export default fetchAppointment;
