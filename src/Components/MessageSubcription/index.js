import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import subcribeOnDeleteMessage from '../../Amplify/Functions/Subcribe/subcribeOnDeleteMessage';
import subcribeOnSendMessage from '../../Amplify/Functions/Subcribe/subcribeOnSendMessage';
import consoleLog from '../../Helpers/consoleLog';
import { useActions, useMergeState } from '../../Helpers/customHooks';
import { updateMessageDataRequest } from '../../Redux/Actions/messages';
import { subcriptionListener } from '../MessageActionSubcription/helper';
import { formatDeleteData, formatNewMessageConversation } from './helper';

function MessageSubcription(props) {
  const [state, setState] = useMergeState({ id: 0 });
  const { conversations, roomDataDetails } = useSelector(state => state.messages) || {};
  const conversationsRef = useRef(conversations);
  const roomDataDetailsRef = useRef(roomDataDetails);
  const onSendMessageSubRef = useRef();
  const onDeleteMessSubRef = useRef();

  const actions = useActions({
    updateMessageDataRequest,
  }, []);

  const onSendMessageSubcriotion = (response) => {
    const { message } = response?.data?.onSendMessage || {};
    const { newConversations, newRoomDataDetails } = formatNewMessageConversation(message, conversationsRef.current, roomDataDetailsRef.current);
    actions.updateMessageDataRequest({ conversations: newConversations, roomDataDetails: newRoomDataDetails });
  };

  const onDeleteMessageSubcriotion = (response) => {
    const { onDeleteMessage } = response?.data || {};
    const { newConversations, newRoomDataDetails } = formatDeleteData(conversationsRef.current, onDeleteMessage, roomDataDetailsRef.current);
    actions.updateMessageDataRequest({ conversations: newConversations, roomDataDetails: newRoomDataDetails });
  };

  const subscribe = async () => {
    try {
      const promises = [subcribeOnSendMessage(), subcribeOnDeleteMessage()];
      const result = await Promise.all(promises);
      if (result[0]) { onSendMessageSubRef.current = subcriptionListener(result[0], onSendMessageSubcriotion); }
      if (result[1]) { onDeleteMessSubRef.current = subcriptionListener(result[1], onDeleteMessageSubcriotion); }
      setState({ id: 1 });
    } catch (error) {
      consoleLog(error);
    }
  };

  useEffect(() => {
    subscribe();
    return () => {
      if (onSendMessageSubRef.current) { onSendMessageSubRef.current.unsubscribe(); }
      if (onDeleteMessSubRef.current) { onDeleteMessSubRef.current.unsubscribe(); }
    };
  }, []);

  useEffect(() => {
    conversationsRef.current = conversations;
    roomDataDetailsRef.current = roomDataDetails;
  }, [conversations, roomDataDetails]);

  return (
    <div id={state.id} />
  );
}
MessageSubcription.defaultProps = {};

MessageSubcription.propTypes = {};

export default MessageSubcription;
