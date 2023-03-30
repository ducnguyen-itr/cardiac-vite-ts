
export const getMissingText = (patientData = {}) => {
  const missingText = [];
  if (patientData?.isMissingPaymentType) {
    missingText.push('Missing Payment type');
  }
  if (patientData?.isMissingDoB) {
    missingText.push('Missing Patient Date of birth');
  }
  if (patientData?.isMissingGender) {
    missingText.push('Missing Patient Gender');
  }
  if (patientData?.isMissingAddress) {
    missingText.push('Missing Patient Address');
  }
  if (patientData?.isNotSetUpFollowUp) {
    missingText.push('Follow-up schedules are not set up');
  }
  if (patientData?.isNotSignedCCMConsent) {
    missingText.push('CCM consent is not signed');
  }
  if (patientData?.isNotSignedRPMConsent) {
    missingText.push('RPM consent is not signed');
  }
  return missingText;
};
export default getMissingText;
