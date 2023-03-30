import gql from 'graphql-tag';

const BILL_QUERY = gql`
  query bill($_id: ID!) {
    bill(_id: $_id) {
      _id
      friendlyId
      createdAt
      carePlan {
        _id
        friendlyId
        facility {
          _id
          name
          contact {
            address
            city
            state
            zip
            country
          }
        }
        physician {
          _id
          firstName
          lastName
        }
        patientDemographic {
          firstName
          lastName
          dateOfBirth  
          email
          contact {
            address
            city
            state
            stateCode
            zip
            country
            phone1
          }
          patientInfo {
            insuranceName
            insuranceType
            insuranceExpireDate
            insuranceProvincialBilling
          }
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

export default BILL_QUERY;
