import gql from 'graphql-tag';

const AUTO_MESSAGE_FRAGMENT = gql`
  {
    _id
    carePlan {
      _id
    }
    message
    timeOfDay
    status
    triggerType
    duration {
      from 
      to
    }
    frequency
    condition
    createdBy
  }
`;

export default AUTO_MESSAGE_FRAGMENT;
