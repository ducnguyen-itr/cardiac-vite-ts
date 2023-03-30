import gql from 'graphql-tag';

const CONTACT = gql`
{
  address
  city
  state
  stateCode
  zip
  country
  phone1
  phone2
  nightPhone
  fax
  faxes
}`;
export default CONTACT;
