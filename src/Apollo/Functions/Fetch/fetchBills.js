import createClient from '../../apolloClient';
import BILL_QUERYS from '../../Queries/bills';

const fetchBills = async (variables, key) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BILL_QUERYS(key),
      variables,
    });
    const { data } = result;
    const { bills } = data;
    return bills;
  } catch (error) {
    throw error;
  }
};

export default fetchBills;
