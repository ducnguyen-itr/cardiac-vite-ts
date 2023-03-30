import createClient from '../../apolloClient';
import CALEBDAR_EVENT_BY_FOLLOW_UPS from '../../Queries/eventsByFollowUps';

const fetchEventsByFollowUps = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: CALEBDAR_EVENT_BY_FOLLOW_UPS,
    variables,
  });
  return result?.data?.eventsByFollowUps;
};
export default fetchEventsByFollowUps;
