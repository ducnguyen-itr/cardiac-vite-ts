import createClient from '../../apolloClient';
import BILL_QUERY from '../../Queries/bill';

const fetchBill = async (variables) => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: BILL_QUERY,
      variables,
    });
    const { data } = result;
    const { bill } = data;
    return bill;
  } catch (error) {
    throw error;
  }
};

export default fetchBill;
