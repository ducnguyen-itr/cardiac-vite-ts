import _ from 'lodash';
import fetchUsers from '../../Apollo/Functions/Fetch/fetchUsers';
import { ROLES } from '../../Constants';
import { SORT_BY_ENUM, SORT_FIELD_ENUM } from '../../Constants/enum';
import { getUserAvatars } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { getFullNameId } from '../../Utils/patientsTable';

const { CLINIC_TECHNICIAN, CLINIC_PHYSICIAN } = ROLES;
export const formatUserData = (users = [], assignUser = {}) => {
  if (users.length === 0) {
    return [];
  }
  const userId = auth.userId();
  const userData = [];
  _.forEach(users, (x) => {
    userData.push({
      userId: x._id,
      roles: x?.roles,
      firstName: x?.firstName,
      lastName: x?.lastName,
      fullName: getFullNameId(x, userId),
      label: getFullNameId(x, userId),
      value: x._id,
    });
  });
  const userSort = _.orderBy(userData, x => x?.firstName?.toLocaleLowerCase());
  const ownUser = _.find(userSort, x => x.userId === assignUser._id);
  const currentUser = _.find(userSort, x => x.userId === userId);
  if (currentUser) {
    _.remove(userSort, currentUser);
    userSort.unshift(currentUser);
  }
  if (ownUser && (ownUser?.userId !== currentUser?.userId)) {
    _.remove(userSort, ownUser);
    userSort.unshift(ownUser);
  }
  return userSort;
};

export const fetchingUsersData = async (data) => {
  const {
    facilityId = '', isNurse = false,
    assignUser = {}, hasAvatar = false,
    isLoadMore = false, state, searchValue,
  } = data || {};
  const { userCursor, options } = state;
  const sendingData = {
    filter: {
      facilityId: facilityId || undefined,
      role: isNurse ? CLINIC_TECHNICIAN : CLINIC_PHYSICIAN,
      userCursor: isLoadMore ? userCursor || undefined : undefined,
      sortOrder: SORT_BY_ENUM.ASC,
      sortField: SORT_FIELD_ENUM.ID,
      name: searchValue || undefined,
    },
    limit: 10,
  };
  try {
    const data = await fetchUsers(sendingData);
    if (hasAvatar) {
      getUserAvatars(data);
    }
    const formatData = formatUserData(data, assignUser);
    return {
      options: isLoadMore ? [...options, ...formatData] : formatData,
      userCursor: formatData[formatData?.length - 1]?._id || '',
      isEndLoadMore: formatData?.length < 10,
    };
  } catch (error) {
    consoleLog('Failed to fetch user data', error);
    return [];
  }
};
