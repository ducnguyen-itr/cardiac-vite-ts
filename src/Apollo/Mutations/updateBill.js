import gql from 'graphql-tag';

const UPDATE_BILL = gql`
  mutation updateBill($_id: ID!, $input: UpdateBillInput!) {
    updateBill(_id: $_id, input: $input) {
      isSuccess
      message
      bill {
        _id
      }
    }
  }
`;

export default UPDATE_BILL;
