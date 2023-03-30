import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import MARK_AS_READ_CONVERSATION from '../../Mutations/markAsRead';

const handleMarkAsReadConveration = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(MARK_AS_READ_CONVERSATION, variables));
  const { markAsRead } = result?.data || {};
  if (!markAsRead?.isSuccess) throw markAsRead.error;
  return markAsRead;
};

export default handleMarkAsReadConveration;
