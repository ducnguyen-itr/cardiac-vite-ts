export const awsConfigAlpha = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id: 'us-east-2:f8c49f59-acfc-4b22-863f-46492cd69b4f',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_AGz5aEqPd',
  aws_user_pools_web_client_id: '1e9bsps3fcil66sbfd225flkg5',
  oauth: {
    domain: 'btcy-acc-delta.auth.us-east-2.amazoncognito.com/',
    scope: [
      'aws.cognito.signin.user.admin',
      'email',
      'openid',
      'phone',
      'profile',
    ],
    redirectSignIn: 'biocarecardiac://,biocaretelemed://,bioheart://,biotres://,http://localhost:3000,http://localhost:3000/login/,http://localhost:3001,http://localhost:3001/login/,https://biosphere.delta.bioheart.bioflux.io/login/,https://biotricity.com/,https://delta.cardiac.bioflux.io/login/,https://delta.telemed.bioflux.io/login,https://telemed.delta.bioflux.io/login/',
    redirectSignOut: 'biocarecardiac://,biocaretelemed://,bioheart://,biotres://,http://localhost:3000,http://localhost:3000/login/,http://localhost:3001,http://localhost:3001/login/,https://biosphere.delta.bioheart.bioflux.io/login/,https://biotricity.com/,https://delta.cardiac.bioflux.io/login/,https://delta.telemed.bioflux.io/login,https://telemed.delta.bioflux.io/login/',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_cognito_username_attributes: [
    'EMAIL',
  ],
  aws_cognito_social_providers: [
    'FACEBOOK',
    'GOOGLE',
    'APPLE',
  ],
  aws_cognito_signup_attributes: [
    'EMAIL',
  ],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: [
    'EMAIL',
  ],
  aws_mobile_analytics_app_id: '05d89e01e2134fdb82ecf4a73e3bf8b6',
  aws_mobile_analytics_app_region: 'us-east-1',
  aws_user_files_s3_bucket: 'biocare-cardiac-user-files00045-delta',
  aws_user_files_s3_bucket_region: 'us-east-2',
  aws_appsync_graphqlEndpoint: 'https://3p4o3yfo6jeytghtmgjryhkahi.appsync-api.us-east-2.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-2',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
};

export const awsConfigDelta = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id: 'us-east-2:f8c49f59-acfc-4b22-863f-46492cd69b4f',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_AGz5aEqPd',
  aws_user_pools_web_client_id: '1e9bsps3fcil66sbfd225flkg5',
  oauth: {
    domain: 'btcy-acc-delta.auth.us-east-2.amazoncognito.com/',
    scope: [
      'aws.cognito.signin.user.admin',
      'email',
      'openid',
      'phone',
      'profile',
    ],
    redirectSignIn: 'biocarecardiac://,biocaretelemed://,bioheart://,biotres://,http://localhost:3000,http://localhost:3000/login/,http://localhost:3001,http://localhost:3001/login/,https://biosphere.delta.bioheart.bioflux.io/login/,https://biotricity.com/,https://delta.cardiac.bioflux.io/login/,https://delta.telemed.bioflux.io/login,https://telemed.delta.bioflux.io/login/',
    redirectSignOut: 'biocarecardiac://,biocaretelemed://,bioheart://,biotres://,http://localhost:3000,http://localhost:3000/login/,http://localhost:3001,http://localhost:3001/login/,https://biosphere.delta.bioheart.bioflux.io/login/,https://biotricity.com/,https://delta.cardiac.bioflux.io/login/,https://delta.telemed.bioflux.io/login,https://telemed.delta.bioflux.io/login/',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_cognito_username_attributes: [
    'EMAIL',
  ],
  aws_cognito_social_providers: [
    'FACEBOOK',
    'GOOGLE',
    'APPLE',
  ],
  aws_cognito_signup_attributes: [
    'EMAIL',
  ],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: [],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: [
    'EMAIL',
  ],
  aws_mobile_analytics_app_id: '05d89e01e2134fdb82ecf4a73e3bf8b6',
  aws_mobile_analytics_app_region: 'us-east-1',
  aws_user_files_s3_bucket: 'biocare-cardiac-user-files00045-delta',
  aws_user_files_s3_bucket_region: 'us-east-2',

};

export const awsConfigStaging = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id: 'us-east-2:75b892cd-6e8b-4aa4-858d-c7141980437f',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_c5ETWFh5W',
  aws_user_pools_web_client_id: '23c0b2ev33nr664licvdfsbfv9',
  oauth: {
    domain: 'btcy-acc-staging.auth.us-east-2.amazoncognito.com',
    scope: [
      'aws.cognito.signin.user.admin',
      'email',
      'openid',
      'phone',
      'profile',
    ],
    redirectSignIn: 'https://biotricity.com/',
    redirectSignOut: 'https://biotricity.com/',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_mobile_analytics_app_id: '90e74b7dac294e87a5d53ccfa6976191',
  aws_mobile_analytics_app_region: 'us-east-1',
  aws_user_files_s3_bucket: 'biocare-cardiac-user-files170212-staging',
  aws_user_files_s3_bucket_region: 'us-east-2',
};

export const awsConfigCustomer = {
  aws_project_region: 'us-east-2',
  aws_cognito_identity_pool_id: 'us-east-2:d330654d-a73b-4a6f-93ff-595169d13abc',
  aws_cognito_region: 'us-east-2',
  aws_user_pools_id: 'us-east-2_cGLQ1C29F',
  aws_user_pools_web_client_id: '3ga26h7k7rgkj00iajk1he7b9k',
  oauth: {
    domain: 'biocare-customer.auth.us-east-2.amazoncognito.com',
    scope: [
      'aws.cognito.signin.user.admin',
      'email',
      'openid',
      'phone',
      'profile',
    ],
    redirectSignIn: 'https://biotricity.com/',
    redirectSignOut: 'https://biotricity.com/',
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
  aws_mobile_analytics_app_id: '31eb61bb696a4502814717d9669f3dc2',
  aws_mobile_analytics_app_region: 'us-east-1',
  aws_user_files_s3_bucket: 'biocare-cardiac-user-files234733-customer',
  aws_user_files_s3_bucket_region: 'us-east-2',
};
