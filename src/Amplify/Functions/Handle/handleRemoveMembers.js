import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import REMOVE_MEMBERS from '../../Mutations/removeMembers';


const handleRemoveMembers = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(REMOVE_MEMBERS, variables));
  const { removeMembers } = result?.data || {};
  if (!removeMembers?.isSuccess) throw removeMembers.error;
  return removeMembers;
};

export default handleRemoveMembers;
