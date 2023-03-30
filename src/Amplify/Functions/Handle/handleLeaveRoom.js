import { graphqlOperation } from 'aws-amplify';
import graphqlWrapper from '../../graphqlWrapper';
import LEAVE_ROOM from '../../Mutations/leaveRoom';


const handleLeaveRoom = async (variables) => {
  const result = await graphqlWrapper(graphqlOperation(LEAVE_ROOM, variables));
  const { leaveRoom } = result?.data || {};
  if (!leaveRoom?.isSuccess) throw leaveRoom.error;
  return leaveRoom;
};

export default handleLeaveRoom;
