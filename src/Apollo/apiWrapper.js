import { NO_CURRENT_USER } from '../Constants';
import emitter from '../Utils/eventEmitter';
import createClient from './apolloClient';

export const apiWrapper = async ({ type = 'query', schema, variables }) => {
  // type: query | mutate
  if (!schema) {
    throw new Error('No schema');
  }

  try {
    const client = await createClient();

    // query
    if (type === 'query') {
      const result = await client.query({
        query: schema,
        variables,
      });
      return result;
    }

    // mutate
    if (type === 'mutate') {
      const result = await client.mutate({
        mutation: schema,
        variables,
      });
      return result;
    }

    throw new Error('Wrong type');
  } catch (error) {
    // handle
    if (error === NO_CURRENT_USER) {
      emitter.emit(NO_CURRENT_USER);
    }
    throw error;
  }
};

export default apiWrapper;
