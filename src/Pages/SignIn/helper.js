import _ from 'lodash';
import fetchCountryCodes from '../../Apollo/Functions/Fetch/fetchCountryCodes';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { setCountryData } from '../../Redux/Actions/country';
import store from '../../Redux/Store';

export const fetchCountry = async () => {
  try {
    const sendingData = {
      filter: {},
      pagination: {
        limit: 200,
      },
    };
    const { countryCodes } = await fetchCountryCodes(sendingData);
    const formatCountryCodes = _.map(countryCodes, x => ({ ...x, value: x.alpha2, label: x.name }));
    store.dispatch(setCountryData(formatCountryCodes));
    auth.setCountry(formatCountryCodes);
  } catch (error) {
    consoleLog(error);
  }
};

export default fetchCountry;
