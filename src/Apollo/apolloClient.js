import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Auth from '@aws-amplify/auth';
import _ from 'lodash';
import { VERSION } from '../Constants';
import packageJson from '../../package.json';
import CONFIG from '../Config';
import EMITTER_CONSTANTS from '../Constants/emitter';
import emitter from '../Utils/eventEmitter';
import consoleLog from '../Helpers/consoleLog';

const cache = new InMemoryCache({ addTypename: false });

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

const createClient = async (isUsingCache = false, isNotShowDisconnect = false) => {
  try {
    const currentSession = await Auth.currentSession();
    const token = currentSession.accessToken.jwtToken;
    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'access-token': token,
      },
    }));
    return new ApolloClient({
      link: authLink.concat(
        ApolloLink.from([
          onError(({
            graphQLErrors, networkError, response, operation, forward,
          }) => {
            if (graphQLErrors) {
              _.map(graphQLErrors, ({ message, extensions }) => {
                if (extensions.code === 'UNAUTHENTICATED') {
                  emitter.emit(EMITTER_CONSTANTS.LOGOUT);
                }
              });
            } else if (networkError) {
              consoleLog(`[Network error]: ${networkError}`);
              // if (!isNotShowDisconnect) {
              // openPopupDisconnect();
              // }
              emitter.emit(EMITTER_CONSTANTS.NET_WORK_ERROR);
              throw networkError;
            }
          }),
          new HttpLink({
            uri: CONFIG.APOLLO_HOST_URL,
            credentials: 'same-origin',
          }),
        ]),
      ),
      cache,
      defaultOptions: isUsingCache ? undefined : defaultOptions,
      name: VERSION.name,
      version: VERSION.api.version,
    });
  } catch (error) {
    throw error;
  }
};

export const client = new ApolloClient({
  link: new HttpLink({
    uri: CONFIG.APOLLO_HOST_URL,
    credentials: 'same-origin',
  }),
  cache,
  defaultOptions,
  name: VERSION.name,
  version: VERSION.api.version,
});

export default createClient;
