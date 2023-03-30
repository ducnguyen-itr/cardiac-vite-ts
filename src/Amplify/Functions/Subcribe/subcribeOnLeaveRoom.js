import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import ON_LEAVE_ROOM from '../../Subscription/onLeaveRoom';

const subcribeOnLeaveRoom = async (variables) => {
  try {
    const subscription = await graphqlWrapper(
      graphqlOperation(ON_LEAVE_ROOM, variables),
    );
    return subscription;
  } catch (error) {
    throw error;
  }
};
export default subcribeOnLeaveRoom;
