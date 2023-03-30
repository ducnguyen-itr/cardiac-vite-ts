import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import QUERY_MESSAGES from '../../Queries/messages';

const fetchMessages = async (variables, key) => {
  const result = await graphqlWrapper(graphqlOperation(QUERY_MESSAGES(key), variables));
  const { conversation } = result?.data || {};
  return conversation;
};
export default fetchMessages;
