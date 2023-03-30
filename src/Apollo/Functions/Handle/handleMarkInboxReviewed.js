import createClient from '../../apolloClient';
import MARK_INBOX_MUTATION from '../../Mutations/markInbox';

const handleMarkInboxReviewed = async (input) => {
  try {
    const client = await createClient();
    const result = await client.mutate({
      mutation: MARK_INBOX_MUTATION,
      variables: {
        input,
      },
    });
    const { data } = result;
    const { Bioflux0markInbox } = data;
    if (!Bioflux0markInbox.isSuccess) {
      throw new Error(Bioflux0markInbox.message);
    }
  } catch (error) {
    throw error;
  }
};

export default handleMarkInboxReviewed;
