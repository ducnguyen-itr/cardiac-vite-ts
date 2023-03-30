import createClient from '../../apolloClient';
import TEMPLATES_QUERY from '../../Queries/templates';

const fetchTemplates = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: TEMPLATES_QUERY,
      variables,
    });
    const { data } = result;
    const { templates } = data;
    return templates;
  } catch (error) {
    throw error;
  }
};

export default fetchTemplates;
