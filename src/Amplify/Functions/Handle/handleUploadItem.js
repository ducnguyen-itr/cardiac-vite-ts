import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import UPLOAD_ITEMS from '../../Mutations/uploadItems';

const handleUploadItems = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(UPLOAD_ITEMS, variables));
  const { uploadItems } = result?.data || {};
  if (!uploadItems?.isSuccess) throw uploadItems.error;
  return uploadItems;
};

export default handleUploadItems;
