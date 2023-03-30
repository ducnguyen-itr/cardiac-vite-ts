import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ON_SEND_MESSAGE from '../../Subscription/onSendMessage';

const subcribeOnSendMessage = async (variables) => {
  try {
    const subscription = await graphqlWrapper(
      graphqlOperation(ON_SEND_MESSAGE, variables),
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};
export default subcribeOnSendMessage;
