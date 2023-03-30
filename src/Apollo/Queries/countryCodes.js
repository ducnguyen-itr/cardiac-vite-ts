import gql from 'graphql-tag';

const COUNTRY_CODES = gql`
  query countryCodes($filter: CountryCodesFilter!, $pagination: PaginationInput) {
    countryCodes(filter: $filter, pagination: $pagination) {
      isSuccess
      message
      countryCodes {
        _id
        isInUse
        name
        alpha2
        alpha3
        numeric
        dial
        flag
      }
      cursor
    }
  }
`;

export default COUNTRY_CODES;
