import { API } from 'aws-amplify';
import EMITTER_CONSTANTS from '../Constants/emitter';
import emitter from '../Utils/eventEmitter';


const graphqlWrapper = async (variable) => {
  try {
    const graphql = await API.graphql(variable);
    return graphql;
  } catch (err) {
    if (err.toString().includes('No current user')) {
      emitter.emit(EMITTER_CONSTANTS.TOKEN_EXPIRED);
    }
    // if (JSON.stringify(err.errors[0].originalError.response).includes('Token has expired.')) {
    if (JSON.stringify(err.errors[0].originalError?.response)?.includes('UnauthorizedException')) {
      emitter.emit(EMITTER_CONSTANTS.TOKEN_EXPIRED);
    }
    throw err;
  }
};
export default graphqlWrapper;
