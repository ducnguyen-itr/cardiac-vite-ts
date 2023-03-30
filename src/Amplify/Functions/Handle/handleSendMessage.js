import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import SEND_MESSAGE from '../../Mutations/sendMessage';

const handleSendMessage = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(SEND_MESSAGE, variables));
  const { sendMessage } = result?.data || {};
  if (!sendMessage?.isSuccess) throw sendMessage.error;
  return sendMessage;
};

export default handleSendMessage;
