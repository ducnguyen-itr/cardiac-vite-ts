
import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import UPDATE_CONVERSATION from '../../Mutations/updateConversation';

const handleUpdateConversation = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(UPDATE_CONVERSATION, variables));
  const { updateConversation } = result?.data || {};
  if (!updateConversation?.isSuccess) throw updateConversation.error;
  return updateConversation;
};

export default handleUpdateConversation;
