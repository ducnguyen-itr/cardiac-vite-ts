import _ from 'lodash';
import moment from 'moment';
import auth from '../../Helpers/auth';

export const formatNewMessageConversation = (message = {}, conversations = [], roomDataDetails = {}) => {
  const cloneConversations = _.cloneDeep(conversations);
  const newConversation = _.find(cloneConversations, x => x?.roomId === message?.toRoomId);
  const cloneConversation = _.cloneDeep(newConversation);

  if (newConversation) {
    _.remove(cloneConversations, newConversation);

    const lastModified = moment(message?.createdAt).format('MM/DD/YYYY');
    const content = JSON.parse(message.content);
    const isUnread = message?.fromUserId !== auth.getLoginData()?.cognitoId && message?.fromUserId?.length > 13;

    cloneConversation.messages.items.unshift(message);
    _.assign(cloneConversation, {
      lastModified, lastMessage: content?.text, isUnread, lastMessageSent: message?.createdAt, isDeleted: false,
    });
    cloneConversations.unshift(cloneConversation);
  }

  const conversationData = roomDataDetails[message?.toRoomId];
  if (conversationData) {
    conversationData.messageData.unshift(message);
  }

  return { newConversations: cloneConversations, newRoomDataDetails: { ...roomDataDetails, [message?.toRoomId]: conversationData } };
};

export const formatDeleteData = (conversations, onDeleteMessage, roomDataDetails) => {
  const cloneConversations = _.cloneDeep(conversations);
  const updatedRoom = _.find(cloneConversations, x => x.roomId === onDeleteMessage.roomId);
  if (onDeleteMessage.messageCreatedAt === updatedRoom.lastMessageSent) {
    _.assign(updatedRoom, { isDeleted: true });
    // dispatch(updateMessageDataRequest({ conversations: cloneConversations }));
  }

  const conversationData = roomDataDetails[onDeleteMessage.roomId];
  if (conversationData) {
    const updateMessage = conversationData.messageData.find(item => item.createdAt === onDeleteMessage.messageCreatedAt);
    updateMessage.deletedAt = 'deleted';
  }
  return {
    newConversations: cloneConversations,
    newRoomDataDetails: { ...roomDataDetails, [onDeleteMessage.roomId]: conversationData },
  };
};
