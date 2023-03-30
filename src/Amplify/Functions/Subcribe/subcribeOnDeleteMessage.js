import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ON_DELETE_MESSAGE from '../../Subscription/onDeleteMessage';

const subcribeOnDeleteMessage = async (variables) => {
  try {
    const subscription = await graphqlWrapper(
      graphqlOperation(ON_DELETE_MESSAGE, variables),
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};
export default subcribeOnDeleteMessage;
