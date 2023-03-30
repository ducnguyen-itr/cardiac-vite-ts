import { fork, put, take } from 'redux-saga/effects';

import AppFlowActions from '../../Constants/appFlowActions';

export function* subcriptionSendMessage() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.SUBCRIPTION_SEND_MESSAGE);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data: {
        data,
      },
    });
  }
}

export function* subcriptionDeleteMessage() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.SUBCRIPTION_DELETE_MESSAGE);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data: {
        data,
      },
    });
  }
}

export function* subcriptionAddMemberMessage() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.SUBCRIPTION_ADD_MEMBER);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data: {
        data,
      },
    });
  }
}

export function* subcriptionRemoveMemberMessage() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.SUBCRIPTION_REMOVE_MEMBER);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data,
    });
  }
}


export function* subcriptionLeaveRoomMessage() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.SUBCRIPTION_LEAVE_ROOM);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data,
    });
  }
}

export function* subcriptionUpdateMessageData() {
  const INFINITE = true;
  while (INFINITE) {
    const request = yield take(AppFlowActions.UPDATE_MESSAGE_SUBCRIPTION);
    const { data } = request;
    yield put({
      type: AppFlowActions.UPDATE_CONVERSATION_COMPLETE,
      data,
    });
  }
}

export default function* subcriptionMessageFlow() {
  yield fork(subcriptionSendMessage);
  yield fork(subcriptionDeleteMessage);
  yield fork(subcriptionAddMemberMessage);
  yield fork(subcriptionRemoveMemberMessage);
  yield fork(subcriptionLeaveRoomMessage);
  yield fork(subcriptionUpdateMessageData);
}
