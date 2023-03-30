import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ADD_MEMBERS from '../../Mutations/addMembers';


const handleAddMembers = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(ADD_MEMBERS, variables));
  const { addMembers } = result?.data || {};
  if (!addMembers?.isSuccess) throw addMembers.error;
  return addMembers;
};

export default handleAddMembers;
