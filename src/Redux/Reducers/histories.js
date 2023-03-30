import initialState from './initialState';

const histories = (state = initialState.histories, action) => {
  switch (action.type) {
    case 'POP':
      return {
        current: state.current - 1,
        historyStack: state.historyStack.pop(),
      };
    case 'PUSH':
      return {
        current: state.current + 1,
        historyStack: [...state.historyStack, action.data],
      };
    case 'GO_BACK':
      // if (state.current === 0 || state.historyStack.length === 1) {
      //   return {
      //     current: state.current,
      //     historyStack: state.historyStack,
      //   };
      // }
      return {
        current: state.current - 1,
        historyStack: state.historyStack,
      };
    default:
      return state;
  }
};

export default histories;
