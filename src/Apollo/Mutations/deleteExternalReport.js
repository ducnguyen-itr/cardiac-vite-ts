import gql from 'graphql-tag';

const DELETE_EXTERNAL_REPORT = gql`
  mutation deleteExternalReport($_id: ID!) {
    deleteExternalReport(_id: $_id){
      isSuccess
      message
    }
  }
`;

export default DELETE_EXTERNAL_REPORT;
