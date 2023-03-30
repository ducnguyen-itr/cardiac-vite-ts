import AppFlowActions from '../../Constants/appFlowActions';
import initialState from './initialState';
import { convertLoginData } from '../../Utils';
import auth from '../../Helpers/auth';

const login = (state = initialState.login, action) => {
  switch (action.type) {
    case AppFlowActions.LOGIN_COMPLETE: {
      auth.login(action.data);
      const formattedData = convertLoginData(action.data);
      auth.setLoginData(formattedData);
      return { ...action.data, photo: action.data.user.photo };
    }
    case AppFlowActions.UPDATED_AVATAR: {
      auth.updateAvatar(action.data.photo);
      return { ...state, photo: action.data.photo };
    }
    default: {
      return state;
    }
  }
};

export default login;
