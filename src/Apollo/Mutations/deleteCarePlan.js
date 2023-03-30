import gql from 'graphql-tag';

const DELETE_CAREPLAN = gql`
  mutation deleteCarePlan($_id: ID!, $deletedDate: DateTime!) {
    deleteCarePlan(_id: $_id, deletedDate: $deletedDate){
      isSuccess
      message
    }
  }
`;

export default DELETE_CAREPLAN;
