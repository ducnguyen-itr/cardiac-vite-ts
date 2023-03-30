import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import DELETE_MESSAGE from '../../Mutations/deleteMessage';

const handleDeleteMessage = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(DELETE_MESSAGE, variables));
  const { deleteMessage } = result?.data || {};
  if (!deleteMessage?.isSuccess) throw deleteMessage.error;
  return deleteMessage;
};

export default handleDeleteMessage;
