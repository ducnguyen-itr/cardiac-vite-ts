import gql from 'graphql-tag';

const SIGN_CMM_CONSENT = gql`
{
  _id
  signatures {
    type
    url 
    date
    extension 
    fileName
  }
  attachments {
    _id
    type
    url
    extension
    fileName
  }
  uploadBy
}`;
export default SIGN_CMM_CONSENT;
