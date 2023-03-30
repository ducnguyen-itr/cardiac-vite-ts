import createClient from '../../apolloClient';
import CARE_PLAN_OVERVIEW_WAS_ADDED from '../../Queries/carePlanOverviewWasAdded';

const fetchCarePlanOverviewWasAdded = async (variables) => {
  const client = await createClient();
  const result = await client.query({
    query: CARE_PLAN_OVERVIEW_WAS_ADDED,
    variables,
  });
  const { carePlanOverviewWasAdded } = result?.data || {};
  return carePlanOverviewWasAdded;
};

export default fetchCarePlanOverviewWasAdded;
