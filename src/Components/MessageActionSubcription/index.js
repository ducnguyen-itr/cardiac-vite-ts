import _ from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import subcribeOnAddMembers from '../../Amplify/Functions/Subcribe/subcribeOnAddMembers';
import subcribeOnLeaveRoom from '../../Amplify/Functions/Subcribe/subcribeOnLeaveRoom';
import subcribeOnRemoveMembers from '../../Amplify/Functions/Subcribe/subcribeOnRemoveMembers';
import consoleLog from '../../Helpers/consoleLog';
import { useActions } from '../../Helpers/customHooks';
import { updateMessageDataRequest } from '../../Redux/Actions/messages';
import { getNewConversation, subcriptionListener } from './helper';

function MessageActionSubcription(props) {
  const { conversations, roomDataDetails } = useSelector(state => state.messages) || {};
  const conversationsRef = useRef(conversations);
  const roomDataDetailsRef = useRef(roomDataDetails);

  const actions = useActions({
    updateMessageDataRequest,
  }, []);

  const addMemberSubRef = useRef();
  const removeMemberSubRef = useRef();
  const leaveRoomSubRef = useRef();


  const onAddMemberSubcription = async (response) => {
    const { onAddMembers } = response?.data || {};
    const cloneConversations = _.clone(conversationsRef.current);
    const updatedRoom = _.find(cloneConversations, x => x.roomId === onAddMembers.room?.id);
    if (updatedRoom) {
      _.assign(updatedRoom, { members: onAddMembers?.room?.members, memberIds: onAddMembers?.memberIds });
      actions.updateMessageDataRequest({ conversations: cloneConversations });
    } else { // The user who has been added to the chat
      const { newConversation, roomDataDetail } = await getNewConversation(onAddMembers);
      const cloneRoomDataDetails = _.clone(roomDataDetailsRef.current);
      if (!_.isEmpty(newConversation)) {
        cloneConversations.unshift(newConversation);
      }
      if (!_.isEmpty(roomDataDetail)) {
        _.assign(cloneRoomDataDetails, roomDataDetail);
      }
      actions.updateMessageDataRequest({ conversations: cloneConversations, roomDataDetails: cloneRoomDataDetails });
    }
  };

  const onRemoveMemberSubcription = (response) => {
    const { onRemoveMembers } = response?.data || {};
    const cloneConversations = _.clone(conversationsRef.current);
    const updatedRoom = _.find(cloneConversations, x => x.roomId === onRemoveMembers.room?.id);
    if (updatedRoom) {
      _.assign(updatedRoom, { members: onRemoveMembers?.room?.members, memberIds: onRemoveMembers?.memberIds });
      actions.updateMessageDataRequest({ conversations: cloneConversations });
    }
  };

  const onLeaveRoomSubcription = (response) => {
    const { onLeaveRoom } = response?.data || {};
    const cloneConversations = _.clone(conversationsRef.current);
    const updatedRoom = _.find(cloneConversations, x => x.roomId === onLeaveRoom.room?.id);
    if (updatedRoom) {
      _.assign(updatedRoom, { members: onLeaveRoom?.room?.members, memberIds: onLeaveRoom?.memberIds });
      actions.updateMessageDataRequest({ conversations: cloneConversations });
    }
  };

  const subscribe = async () => {
    try {
      const promises = [subcribeOnAddMembers(), subcribeOnRemoveMembers(), subcribeOnLeaveRoom()];
      const result = await Promise.all(promises);
      if (result[0]) { addMemberSubRef.current = subcriptionListener(result[0], onAddMemberSubcription); }
      if (result[1]) { removeMemberSubRef.current = subcriptionListener(result[1], onRemoveMemberSubcription); }
      if (result[2]) { leaveRoomSubRef.current = subcriptionListener(result[2], onLeaveRoomSubcription); }
    } catch (error) {
      consoleLog(error);
    }
  };

  useEffect(() => {
    subscribe();
    return () => {
      if (addMemberSubRef.current) { addMemberSubRef.current.unsubscribe(); }
      if (removeMemberSubRef.current) { removeMemberSubRef.current.unsubscribe(); }
      if (leaveRoomSubRef.current) { leaveRoomSubRef.current.unsubscribe(); }
    };
  }, []);
  useEffect(() => {
    conversationsRef.current = conversations;
    roomDataDetailsRef.current = roomDataDetails;
  }, [conversations, roomDataDetails]);


  return (
    <div />
  );
}
MessageActionSubcription.defaultProps = {};

MessageActionSubcription.propTypes = {};

export default MessageActionSubcription;
