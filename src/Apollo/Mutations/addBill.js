import gql from 'graphql-tag';

const ADD_BILL = gql`
  mutation addBill($input: AddBillInput!) {
    addBill(input: $input) {
      isSuccess
      message
      bill {
        _id
      }
    }
  }
`;

export default ADD_BILL;
