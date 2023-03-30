import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component, exact = false, path, authenticated,
}) => (
  <Route
    exact={exact}
    path={path}
    render={props => (
      authenticated
        ? (
          <Component {...props} />
        )
        : (
          <Redirect to={{ pathname: '/login' }} />
        )
    )}
  />
);

PrivateRoute.defaultProps = {
  exact: false,
  authenticated: false,
};

PrivateRoute.propTypes = {
  exact: PropTypes.bool,
  component: PropTypes.shape().isRequired,
  path: PropTypes.string.isRequired,
  authenticated: PropTypes.bool,
};

export default PrivateRoute;
