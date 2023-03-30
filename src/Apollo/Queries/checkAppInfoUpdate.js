import gql from 'graphql-tag';

const CHECK_APP_INFO_UPDATE = gql`
  query checkAppInfoUpdate($appName: String!, $platform: String!, $version: String!) {
    checkAppInfoUpdate(appName: $appName, platform: $platform, version: $version)
  }
`;

export default CHECK_APP_INFO_UPDATE;
