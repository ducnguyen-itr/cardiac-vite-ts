import Amplify from '@aws-amplify/core'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import SignIn from './SignIn';
// import ForgotPassword from './ForgotPassword';
import CONFIG from '../Config'
import auth from '../Helpers/auth'
import { updatedAwsConfig } from '../Helpers/socialHandler'

const SignIn = React.lazy(() => import('./SignIn'))

Amplify.configure(updatedAwsConfig(CONFIG.AWS_CONFIG))

class Main extends Component {
  render = () => {
    const authenticated = this.props.login?.isSuccess || auth.isSuccess()
    return (
      <main>
        <Router>
          <Switch>
            <Route path='/login' name='Sign In' component={SignIn} />
          </Switch>
        </Router>
      </main>
    )
  }
}

Main.propTypes = {
  login: PropTypes.shape({
    isSuccess: PropTypes.bool
  }).isRequired
}

const mapStateToProps = (state) => ({
  login: state.login
})

export default connect(mapStateToProps)(Main)
