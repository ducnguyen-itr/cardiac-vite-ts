

import createClient from '../../apolloClient';
import UPDATE_BIOHEART_MONITOR from '../../Mutations/updateBioheartMonitor';

const handleUpdateBioheartMonitor = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_BIOHEART_MONITOR,
      variables,
    });
    const { updateBioheartMonitor } = result?.data;
    if (!updateBioheartMonitor?.isSuccess) throw updateBioheartMonitor.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpdateBioheartMonitor;
