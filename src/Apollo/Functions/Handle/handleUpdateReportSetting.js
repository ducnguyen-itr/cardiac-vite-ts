import createClient from '../../apolloClient';
import UPDATE_REPORT_SETTING from '../../Mutations/updateReportSetting';

const handleUpdateRerportSetting = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_REPORT_SETTING,
      variables,
    });
    const { updateReportSetting } = result?.data;
    return updateReportSetting;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateRerportSetting;
