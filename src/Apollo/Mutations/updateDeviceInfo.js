
import gql from 'graphql-tag';

const UPDATE_DEVICE_INFO = gql`
  mutation updateDeviceInfo($_id: ID!, $input: UpdateDeviceInfoInput!) {
    updateDeviceInfo(_id: $_id, input: $input) {
      isSuccess
      message
    }
  }
`;

export default UPDATE_DEVICE_INFO;
