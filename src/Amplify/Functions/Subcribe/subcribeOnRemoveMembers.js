import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ON_REMOVE_MEMBERS from '../../Subscription/onRemoveMembers';

const subcribeOnRemoveMembers = async (variables) => {
  try {
    const subscription = await graphqlWrapper(
      graphqlOperation(ON_REMOVE_MEMBERS, variables),
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};
export default subcribeOnRemoveMembers;
