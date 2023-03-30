import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import DOWNLOAD_ITEMS from '../../Mutations/downloadItems';

const handleDownloadItems = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(DOWNLOAD_ITEMS, variables));
  const { downloadItems } = result?.data || {};
  if (!downloadItems?.isSuccess) throw downloadItems.error;
  return downloadItems;
};

export default handleDownloadItems;
