import _ from 'lodash';

export const isEmptyFilters = (state = {}, options) => {
  if (_.isEmpty(state)) return true;
  let isEmpty = true;
  _.forEach(Object.keys(state), (key) => {
    if (!_.isEmpty(state?.[key]) && !!_.find(options, x => x.name === key)) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

export const handleSendingData = (state, options) => {
  const newState = {};
  _.forEach(state, (value, key) => {
    _.assign(newState, {
      [key]: _.map(value, (item) => {
        const currentOptions = _.find(options, option => option.name === key);
        return _.find(currentOptions.options, option => option.value === item);
      }),
    });
  });
  return newState;
};
