import createClient from '../../apolloClient';
import BIOFLUX_0_SEND_STUDY_REFERENCE_CODE from '../../Mutations/Bioflux0sendStudyReferenceCode';

const handleBiofluxSendReferenceCode = async (variables) => {
  const client = await createClient();
  try {
    const result = await client.mutate({
      mutation: BIOFLUX_0_SEND_STUDY_REFERENCE_CODE,
      variables,
    });
    const { Bioflux0sendStudyReferenceCode } = result?.data;
    if (!Bioflux0sendStudyReferenceCode?.isSuccess) {
      throw Bioflux0sendStudyReferenceCode.message;
    }
    return Bioflux0sendStudyReferenceCode?.isSuccess;
  } catch (error) {
    throw error;
  }
};

export default handleBiofluxSendReferenceCode;
