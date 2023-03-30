import _ from 'lodash';
import moment from 'moment';
import fetchMessages from '../../Amplify/Functions/Fetch/fetchMessages';
import fetchLatestCarePlanByCognitoIds from '../../Apollo/Functions/Fetch/fetchLatestCarePlanByCognitoIds';
import { getFullName } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';

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

export const subcriptionListener = (observable, onNext = () => { }, onError = () => { }) => observable.subscribe({
  next: ({ value }) => onNext(value),
  error: error => onError(error),
});

const a = {
  isSuccess: true,
  error: null,
  userId: '837028b6-45f1-4f91-9dae-cdeeea99c409',
  room: {
    id: '0f1adc15-0c44-4229-be24-1124f76d74c4',
    name: null,
    memberIds: [
      '0f1adc15-0c44-4229-be24-1124f76d74c4',
      '837028b6-45f1-4f91-9dae-cdeeea99c409',
      'd31e4950-723f-4c05-ae98-120172f9a122',
      'd9b39005-a7a2-4bc6-9de8-58a5dfbae612',
    ],
    membersRecord: [
      '02970bee-8df9-4018-97b2-4ba0ce3f741d',
      '0f1adc15-0c44-4229-be24-1124f76d74c4',
      '2ce8d457-4962-47e9-9df3-7ecb4c811612',
      '837028b6-45f1-4f91-9dae-cdeeea99c409',
      'd31e4950-723f-4c05-ae98-120172f9a122',
      'd9b39005-a7a2-4bc6-9de8-58a5dfbae612',
      'dd1160b7-1da1-4589-80b6-f9cdaafccb85',
    ],
    members: [
      {
        firstName: 'Uyen7',
        id: '0f1adc15-0c44-4229-be24-1124f76d74c4',
        lastName: 'Nguyen',
        roles: [
          'Patient',
        ],
        status: null,
      },
      {
        firstName: 'Alex',
        id: '837028b6-45f1-4f91-9dae-cdeeea99c409',
        lastName: 'Palmer',
        roles: [
          'Clinic Technician',
        ],
        status: null,
      },
      {
        firstName: 'Clinic',
        id: 'd31e4950-723f-4c05-ae98-120172f9a122',
        lastName: 'Physician 01',
        roles: [
          'Clinic Physician',
        ],
        status: null,
      },
      {
        firstName: 'Bob',
        id: 'd9b39005-a7a2-4bc6-9de8-58a5dfbae612',
        lastName: 'Smoak',
        roles: [
          'Clinic Physician',
        ],
        status: null,
      },
    ],
    patientId: '0f1adc15-0c44-4229-be24-1124f76d74c4',
    hash: '907abab46a9538f9dd4cff9da4e050ba6fbc995f5236a54aedd45dc6a8d1c4cf',
    createdById: 'Bioflux_5aa92ab02eb772181f029ff5',
    updatedAt: '2022-08-31T09:30:59.732607422Z',
    createdAt: '2022-08-31T09:30:59.732607422Z',
  },
  memberIds: [
    '0f1adc15-0c44-4229-be24-1124f76d74c4',
    '837028b6-45f1-4f91-9dae-cdeeea99c409',
    'd31e4950-723f-4c05-ae98-120172f9a122',
    'd9b39005-a7a2-4bc6-9de8-58a5dfbae612',
  ],
};


const formatConversation = (conversation) => {
  if (_.isEmpty(conversation)) return {};

  const {
    room, lastMessageSent, messages,
  } = conversation || {};
  const lastMessage = messages?.items[0];
  const patient = room?.members?.find(x => x?.roles?.includes('Patient'));
  const lastMessageSend = JSON.parse(lastMessage?.content);
  return {
    ...conversation,
    firstName: patient?.firstName,
    lastName: patient?.lastName,
    patientId: patient?.id,
    lastModified: moment(lastMessageSent).format('MM/DD/YYYY'),
    lastMessage: lastMessageSend?.text || '',
    hasFile: !_.isEmpty(lastMessage?.sharedFiles?.items),
    isDeleted: !!lastMessage?.deletedAt,
    isUnread: !conversation?.read,
    roomId: room?.id,
    members: room?.members,
    memberIds: room?.members?.map(x => x.id),
    isFlag: conversation?.pin,
  };
};

const formatPatientData = (patientData = []) => {
  if (_.isEmpty(patientData)) return [];
  return _.map(patientData, x => ({
    ...x,
    facilityName: x.facility?.name,
    patientId: x.patient?.cognitoId,
    photo: x?.patient?.photo || '',
    firstName: x.patientDemographic?.firstName,
    lastName: x.patientDemographic?.lastName,
    fullName: getFullName(x.patientDemographic),
    carePlanId: x?._id,
    patientSortId: x?.patient?._id || '',
    patientName: `${x.patientDemographic?.firstName} ${x.patientDemographic?.lastName}`,
  }));
};

export const getNewConversation = async (data = {}) => {
  const { room } = data || {};
  const userId = auth.getLoginData()?.cognitoId;
  const patientInfo = room?.members?.find(x => x.roles?.includes('Patient'));
  try {
    const sendingData = {
      userId, roomId: room?.id,
    };
    const patientFilter = {
      cognitoIds: [patientInfo?.id],
    };
    const promises = [fetchMessages(sendingData, 1), fetchLatestCarePlanByCognitoIds(patientFilter)];
    const result = await Promise.all(promises);
    const conversationData = formatConversation(result[0]);
    const patientData = formatPatientData(result[1]);

    const newConversation = { ...(conversationData || {}), ...(patientData?.[0] || {}) };
    const roomDataDetail = {
      [room?.id]: {
        messageData: result[0]?.messages?.items,
        messageNextToken: result[0]?.messages?.nextToken,
      },
    };
    return { newConversation, roomDataDetail };
  } catch (error) {
    consoleLog(error);
    return { newConversation: {}, roomDataDetail: {} };
  }
};
