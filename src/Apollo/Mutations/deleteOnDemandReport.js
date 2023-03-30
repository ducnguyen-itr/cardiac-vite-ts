import gql from "graphql-tag";
const DELETE_ON_DEMAND_REPORT = gql`
mutation deleteOnDemandReport($_id: ID!, $facilityId: ID) {
  deleteOnDemandReport(_id: $_id, facilityId: $facilityId){
    isSuccess,
    message
  }
}
`
export default DELETE_ON_DEMAND_REPORT;