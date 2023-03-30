export const isEnvCustomer = () => !window.location.hostname.includes('alpha.cardiac')
  && !window.location.hostname.includes('staging.cardiac');
export const isEnvLocalDev = () => window.location.hostname.includes('localhost');
