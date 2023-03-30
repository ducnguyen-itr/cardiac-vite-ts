import createClient from '../../apolloClient';
import UPDATE_DEVICE_INFO from '../../Mutations/updateDeviceInfo';

const handleUpdateDeviceInfo = async (variables) => {
  const client = await createClient();
  const result = await client.mutate({
    mutation: UPDATE_DEVICE_INFO,
    variables,
  });
  const { updateDeviceInfo } = result?.data;
  if (!updateDeviceInfo?.isSuccess) throw updateDeviceInfo.message;
};

export default handleUpdateDeviceInfo;
