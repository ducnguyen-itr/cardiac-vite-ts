import createClient from '../../apolloClient';
import DRUG_BANK_TOKEN_QUERY from '../../Queries/drugBankToken';

const fetchDrugBankToken = async () => {
  try {
    const client = await createClient();
    const result = await client.query({
      query: DRUG_BANK_TOKEN_QUERY,
    });
    const { data } = result;
    return data.drugBankToken;
  } catch (error) {
    throw error;
  }
};
export default fetchDrugBankToken;
