import _ from 'lodash';
import moment from 'moment';
import fetchBiofluxClinicStudies from '../Apollo/Functions/Fetch/fetchBioflux0clinicStudies';
import fetchUsers from '../Apollo/Functions/Fetch/fetchUsers';
import { ROLES, TableNames } from '../Constants';
import { SORT_BY_ENUM, SORT_FIELD_ENUM } from '../Constants/enum';
import { getFullName, getUserAvatars } from '../Helpers';
import auth from '../Helpers/auth';
import consoleLog from '../Helpers/consoleLog';
import { getFullNameId } from './patientsTable';

const { CLINIC_TECHNICIAN, CLINIC_PHYSICIAN } = ROLES;

const {
  NewAssigned, NewRegistered, Active, Inactive, NewMD,
} = TableNames;

export const getQueryKey = (hyperName = '', isMD = '') => {
  let queryKey = 0; // new-regiestered
  switch (hyperName) {
    case NewRegistered: {
      queryKey = 1;
      break;
    }
    case NewAssigned: {
      queryKey = 2;
      break;
    }
    case NewMD: {
      queryKey = 3;
      break;
    }
    case Active:
    case Inactive: {
      if (isMD) {
        queryKey = 4;
      } else {
        queryKey = 5;
      }
      break;
    }
    default: {
      break;
    }
  }
  return queryKey;
};

export const replaceNewURL = (status = '', pathName = '', hyperName = '') => {
  const lowerPathName = pathName.toLowerCase();
  const lowerStatus = status?.toLowerCase();
  let path = '';
  let isPush = false;

  if (status === '') {
    path = `/patients/${hyperName?.includes('new') ? 'new' : hyperName}`;
    isPush = true;
    return { path, isPush };
  }
  if (!lowerPathName.includes(`/${lowerStatus}/`)) {
    path = `/patients/${lowerStatus}`;
    return { path, isPush };
  }
  return { path, isPush };
};


export const formatUserData2 = (users = [], assignUser = {}) => {
  if (users.length === 0) {
    return [];
  }
  const userId = auth.userId();
  const userData = [];
  _.forEach(users, (x) => {
    userData.push({
      userId: x._id,
      roles: x?.roles,
      title: x?.title,
      firstName: x?.firstName,
      lastName: x?.lastName,
      email: x?.contact?.email,
      photo: x?.photo,
      facility: x?.currentFacility?._id || '',
      facilityName: x?.currentFacility?.name || '',
      fullName: getFullNameId(x, userId),
      disabled: x?.availableAppointment,
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

export const fetchingUsersData = async (facilityId = '', isNurse = false, assignUser = {}) => {
  const sendingData = {
    filter: {
      facilityId: facilityId || undefined,
      role: isNurse ? CLINIC_TECHNICIAN : CLINIC_PHYSICIAN,
      cursor: undefined,
      sortOrder: SORT_BY_ENUM.ASC,
      sortField: SORT_FIELD_ENUM.ID,
    },
    limit: 999,
  };
  try {
    const data = await fetchUsers(sendingData);
    getUserAvatars(data);
    const formatData = formatUserData2(data, assignUser);
    return formatData;
  } catch (error) {
    consoleLog('Failed to fetch user data', error);
    return [];
  }
};

export const fetchOngoingStudy = async (carePlanId) => {
  const input = {
    filter: {
      carePlanId,
      status: 'Ongoing',
      isGetAll: true,
    },
    limit: 5,
  };
  try {
    const clinicStudies = await fetchBiofluxClinicStudies(input, 1);
    return clinicStudies.length > 0 ? clinicStudies[0].id : '';
  } catch (error) {
    consoleLog('Failed to fetch current study: ', error);
    return '';
  }
};


export const getCountDisabled = (state = {}) => {
  if (_.isEmpty(state)) return 0;
  let count = 0;
  _.forEach(Object.keys(state), (x) => {
    count += state?.[x]?.length;
  });
  return count;
};
