import createClient from '../../apolloClient';
import LATEST_CARE_PLAN_BY_COGNITOIDS from '../../Queries/latestCarePlanByCognitoIds';

const fetchLatestCarePlanByCognitoIds = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: LATEST_CARE_PLAN_BY_COGNITOIDS,
    variables,
  });
  return result?.data?.latestCarePlanByCognitoIds;
};

export default fetchLatestCarePlanByCognitoIds;
