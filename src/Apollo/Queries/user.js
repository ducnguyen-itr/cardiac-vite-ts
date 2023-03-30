import gql from 'graphql-tag';
import INDIVIDUAL_WORKING_TIME from '../Fragments/individualWorkingTime';
import { CONTACT } from '../Fragments/patient';
import { ID_NAME_PHOTO } from '../Fragments/user';


const USER_0 = gql`
  query user($_id: ID) {
    user(_id: $_id) {
      ...${ID_NAME_PHOTO}
      cognitoId
      email
      dateOfBirth
      gender
      height
      weight
      roles
      signature
      facilities {
        _id
        name
        canUseBiofluxDirect
      }
      contact {
        ...${CONTACT}
      }
    }
  }
`;

const USER_1 = gql`
  query user($_id: ID) {
    user(_id: $_id) {
      ...${ID_NAME_PHOTO}
      cognitoId
      email
      dateOfBirth
      gender
      height
      weight
      roles
      signature
      facilities {
        _id
        name
        canUseBiofluxDirect
      }
    }
  }
`;

const USER_2 = gql`
  query user($_id: ID) {
    user(_id: $_id) {
      _id
      firstName
      lastName
    }
  }
`;

// for myprofile page
const USER_3 = gql`
  query user($_id: ID) {
    user(_id: $_id) {
      ...${ID_NAME_PHOTO}
      cognitoId
      email
      dateOfBirth
      gender
      height
      weight
      roles
      signature
      facilities {
        _id
        name
        canUseBiofluxDirect
      }
      contact {
        ...${CONTACT}
      }
      workingTime {
        mon {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        tues {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        wed {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        thurs {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        fri {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        sat {
          ...${INDIVIDUAL_WORKING_TIME}
        }
        sun {
          ...${INDIVIDUAL_WORKING_TIME}
        }
      }
    }
  }`;

const USER_4 = gql`
  query user($_id: ID!) {
    user(_id: $_id) {
      _id
      facilities {
        _id
        name
        contact {
          address
          city
          state
          country
          zip
        }
      }
    }
  }
`;

const USER = (key = 0) => {
  switch (key) {
    case 0:
      return USER_0;
    case 1:
      return USER_1;
    case 2:
      return USER_2;
    case 3:
      return USER_3;
    case 4:
      return USER_4;
    default:
      return USER_0;
  }
};

export default USER;
