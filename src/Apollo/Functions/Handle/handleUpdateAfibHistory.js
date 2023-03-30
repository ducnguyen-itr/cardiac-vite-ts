import gql from 'graphql-tag';
import createClient from '../../apolloClient';

const UPDATE_AFIB_HISTORY = gql`
  mutation updateAfibHistory($carePlanId: ID!, $afibHistory: AfibHistoryInput) {
    updateAfibHistory(carePlanId: $carePlanId, afibHistory: $afibHistory) {
      isSuccess
      message
    }
  }
`;

const handleUpdateAfibHistory = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: UPDATE_AFIB_HISTORY,
      variables,
    });
    const { updateAfibHistory } = result?.data;
    if (!updateAfibHistory?.isSuccess) {
      throw updateAfibHistory.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleUpdateAfibHistory;
