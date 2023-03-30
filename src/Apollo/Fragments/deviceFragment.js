import gql from 'graphql-tag';

const DeviceFragment = gql`
  {
    id
    deviceId
    status
    additionalStatus
    firstStudyDate
    lastSync {
      time
      timezone
      operator
      networkMode
      leadOn
      isCharging
      batteryLevel
      rssi
      sdFree
      fwVersion
      schema
      gprs
    }
    facility {
      id
      name
      contact {
        country
      }
    }
  }
`;

export default DeviceFragment;
