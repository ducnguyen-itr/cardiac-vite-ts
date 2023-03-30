import { createStore, applyMiddleware } from 'redux';

import createSagaMiddleware from 'redux-saga';
import rootReducer from '../Reducers';
import rootSaga from '../Sagas';
import { loadState } from './localStorage';

const persistedState = loadState();
const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  return {
    ...createStore(
      rootReducer,
      persistedState,
      applyMiddleware(sagaMiddleware),
    ),
    runSaga: sagaMiddleware.run(rootSaga),
  };
};

const store = configureStore();

export default store;
