import { awsConfigAlpha, awsConfigDelta, awsConfigStaging, awsConfigCustomer } from './aws-exports'

export const ENV = {
  ALPHA: 'alpha',
  DELTA: 'delta',
  STAGING: 'staging',
  CUSTOMER: 'customer'
}

/* Selected environment */
export const ENVIRONMENT = ENV.DELTA
// console.log('process.env.ENV', process.env.HOST);
/* */

export const LINK_LOCAL_REDIRECT_AWS = 'http://localhost:3001/login/'

const configAlpha = {
  AWS_CONFIG: awsConfigAlpha,
  APOLLO_HOST_URL: 'https://gateway.alpha.cardiac.bioflux.io/',
  SOCKET_URL: 'https://sio.alpha.cardiac.bioflux.io',
  LINK_REDIRECT_AWS: 'https://alpha.cardiac.bioflux.io/login/',
  LINK_LOGOUT_AWS: 'https://login.alpha.bioflux.io/session/end',
  BIOFLUX_LINK: 'https://alpha.bioflux.io/studies/create',
  TELEMED_LINK: 'https://telemed.alpha.bioflux.io/'
}

const configDelta = {
  AWS_CONFIG: awsConfigDelta,
  APOLLO_HOST_URL: 'https://gateway.delta.cardiac.bioflux.io',
  SOCKET_URL: 'https://sio.delta.cardiac.bioflux.io',
  LINK_REDIRECT_AWS: 'https://delta.cardiac.bioflux.io/login/',
  LINK_LOGOUT_AWS: 'https://login.delta.bioflux.io/session/end',
  BIOFLUX_LINK: 'https://delta.bioflux.io/studies/create',
  TELEMED_LINK: 'https://delta.telemed.bioflux.io/'
}

const configStaging = {
  AWS_CONFIG: awsConfigStaging,
  APOLLO_HOST_URL: 'https://gateway.staging.cardiac.biotricity.com/',
  SOCKET_URL: 'https://sio.staging.cardiac.biotricity.com/',
  LINK_REDIRECT_AWS: 'https://staging.cardiac.biotricity.com/login/',
  LINK_LOGOUT_AWS: 'https://login.staging.biotricity.com/session/end',
  BIOFLUX_LINK: 'https://staging.biotricity.com/studies/create',
  TELEMED_LINK: 'https://staging.telemed.biotricity.com/'
}

const configCustomer = {
  AWS_CONFIG: awsConfigCustomer,
  APOLLO_HOST_URL: 'https://gateway.cardiac.biotricity.com/',
  SOCKET_URL: 'https://sio.cardiac.biotricity.com',
  LINK_REDIRECT_AWS: 'https://cardiac.biotricity.com/login/',
  LINK_LOGOUT_AWS: 'https://login.customer.biotricity.com/session/end',
  BIOFLUX_LINK: 'https://customer.biotricity.com/studies/create',
  TELEMED_LINK: 'https://telemed.biotricity.com/'
}

const generateConfig = () => {
  switch (ENVIRONMENT) {
    case ENV.ALPHA:
      return configAlpha
    case ENV.DELTA:
      return configDelta
    case ENV.STAGING:
      return configStaging
    case ENV.CUSTOMER:
      return configCustomer
    default:
      return configAlpha
  }
}

const CONFIG = {
  ...generateConfig()
}

export const SENDTRY_CONFIG = {
  SENTRY_CUSTOMER: 'https://742352bb8c0d4843abac6861d218be63@o773373.ingest.sentry.io/5796192',
  SENTRY_DEV: 'https://065e9de25b784ab0a1dec967ec2492c4@o773373.ingest.sentry.io/5796173'
}

export default CONFIG
