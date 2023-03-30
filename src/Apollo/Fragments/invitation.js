import gql from 'graphql-tag';

export const INVITATION = gql`
  {
    firstName
    lastName
    phoneNumber
    email
    isLinked
  }
`;


export const USER_NAME = gql`
  {
    _id
    photo
    roles
    title
    roles
    firstName
    lastName
  }
`;
