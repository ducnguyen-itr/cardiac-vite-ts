import gql from 'graphql-tag';

const BILLS = gql`
  query bills($filter: BillFilterInput!, $limit: Int) {
    bills(filter: $filter, limit: $limit) {
      _id
      friendlyId
      carePlan {
        _id
        friendlyId
        patientDemographic {
          firstName
          lastName
        }
      }
      unit
      status
      diagnoses {
        code
        description
      }
      services {
        code
        description
        quantity
        price
      }
      amountPaid
      balance
      createdAt
      updatedAt
    }
  }
`;

const BILLS_INFO = gql`
  query bills($filter: BillFilterInput!, $limit: Int) {
    bills(filter: $filter, limit: $limit) {
      _id
      friendlyId
      unit
      status
      diagnoses {
        code
        description
      }
      services {
        code
        description
        quantity
        price
      }
    }
  }
`;
const BILL_QUERYS = (key) => {
  switch (key) {
    case 1:
      return BILLS;
    case 2:
      return BILLS_INFO;
    default:
      return BILLS;
  }
};

export default BILL_QUERYS;
