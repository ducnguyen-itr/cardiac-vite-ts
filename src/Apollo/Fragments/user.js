import gql from 'graphql-tag';

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

export const ROLE_USER_NAME = gql`
  {
    _id
    roles
    title
    roles
    firstName
    lastName
  }
`;


export const ID_NAME = gql`
{
  _id
  firstName
  lastName
}
`;

export const ID_FULL_NAME = gql`
{
  _id
  firstName
  lastName
  middleName
}
`;

export const ID_NAME_PHOTO = gql`
{
  _id
  firstName
  lastName
  middleName
  photo
}
`;

export const ID_NAME_PHOTO_ROLE = gql`
{
  _id
  firstName
  lastName
  middleName
  photo
  roles
}
`;
