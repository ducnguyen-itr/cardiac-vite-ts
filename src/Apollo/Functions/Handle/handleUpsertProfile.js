import createClient from '../../apolloClient';
import UPSERT_PROFILE from '../../Mutations/upsertProfile';

const handleUpsertProfile = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPSERT_PROFILE,
      variables,
    });
    const { upsertProfile } = result?.data;
    if (!upsertProfile?.isSuccess) throw upsertProfile.message;
  } catch (error) {
    throw error;
  }
};

export default handleUpsertProfile;
