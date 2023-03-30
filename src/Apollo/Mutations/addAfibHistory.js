import gql from 'graphql-tag';

const ADD_AFIB_HISTORY = gql`
  mutation addAfibHistory($carePlanId: ID!, $afibHistory: AfibHistoryInput) {
    addAfibHistory(carePlanId: $carePlanId, afibHistory: $afibHistory) {
      isSuccess
      message
    }
  }
`;

export default ADD_AFIB_HISTORY;
