import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ON_ADD_MEMBERS from '../../Subscription/onAddMembers';

const subcribeOnAddMembers = async (variables) => {
  try {
    const subscription = await graphqlWrapper(
      graphqlOperation(ON_ADD_MEMBERS, variables),
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};
export default subcribeOnAddMembers;
