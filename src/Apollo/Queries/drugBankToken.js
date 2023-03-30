import gql from 'graphql-tag';

const DRUG_BANK_TOKEN_QUERY = gql`
  query drugBankToken {
    drugBankToken
  }
`;

export default DRUG_BANK_TOKEN_QUERY;
