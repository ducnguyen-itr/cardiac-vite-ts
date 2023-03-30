import gql from 'graphql-tag';
import { FACILITY } from '../Fragments/patient';
import { ID_NAME_PHOTO } from '../Fragments/user';

const USERS_INFO = gql`
query users($filter: UserFilterInput!, $limit: Int) {
  users(filter: $filter, limit: $limit) {
    ...${ID_NAME_PHOTO}
    roles
    title
    currentFacility {
      ...${FACILITY}
    }
    email
    facilities {
      _id
      name
    }
  }
}
`;

const USERS_INFO_1 = gql`
query users($filter: UserFilterInput!, $limit: Int) {
  users(filter: $filter, limit: $limit) {
    _id
    firstName
    lastName
  }
}
`;

const USERS_BASIC_INFO = gql`
query users($filter: UserFilterInput!, $limit: Int) {
  users(filter: $filter, limit: $limit) {
    _id
    firstName
    lastName
    photo
  }
}
`;

const MESSAGE_INFO = gql`
query users($filter: UserFilterInput!, $limit: Int) {
  users(filter: $filter, limit: $limit) {
    _id
    firstName
    cognitoId
    lastName
    photo
    roles
  }
}
`;

const USER_NAME_INFO = gql`
query users($filter: UserFilterInput!, $limit: Int) {
  users(filter: $filter, limit: $limit) {
    _id
    firstName
    lastName
    roles
  }
}
`;

const USERS = (key = 0) => {
  switch (key) {
    case 0:
      return USERS_INFO;
    case 1:
      return USERS_INFO_1;
    case 2:
      return USERS_BASIC_INFO;
    case 3:
      return MESSAGE_INFO;
    case 4:
      return USER_NAME_INFO;
    default:
      return USERS_INFO;
  }
};

export default USERS;
