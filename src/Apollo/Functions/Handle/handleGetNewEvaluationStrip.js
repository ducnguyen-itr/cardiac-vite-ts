import createClient from '../../apolloClient';
import GET_EVALUATION_STRIP from '../../Mutations/bioflux0getEvaluationEvent';

const handleGetNewEvaluationStrip = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: GET_EVALUATION_STRIP,
      variables,
    });
    const { Bioflux0getEvaluationEvent } = result?.data;
    if (!Bioflux0getEvaluationEvent?.isSuccess) {
      throw Bioflux0getEvaluationEvent.message;
    }
  } catch (error) {
    throw error;
  }
};

export default handleGetNewEvaluationStrip;
