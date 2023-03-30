import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import QUERY_LIST_CONVERSATION from '../../Queries/conversations';

const fetchConversations = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(QUERY_LIST_CONVERSATION, variables));
  const { conversations } = result?.data || {};
  if (!conversations?.isSuccess) throw conversations.error;
  return conversations;
};
export default fetchConversations;
