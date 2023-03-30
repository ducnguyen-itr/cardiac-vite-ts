import gql from 'graphql-tag';

import {
  AFIB_HISTORY_TEMPLATE,
} from '../Fragments/patient';


const TEMPLATES_QUERY = gql`
  query templates($filter: TemplateFilterInput, $limit: Int) {
    templates(filter: $filter, limit: $limit) {
      isSuccess
      message
      templates {
        _id
        title
        createdBy
        facility
        afibHistory {
          ...${AFIB_HISTORY_TEMPLATE}
        }
      }
    }
  }
`;

export default TEMPLATES_QUERY;
