import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons'
import Auth from '@aws-amplify/auth'
import { Hub } from '@aws-amplify/core'
import { Form, Modal, notification, Spin } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
// import { buildNumber, version } from '../../../package.json'
import fetchCheckAppInfoUpdate from '../../Apollo/Functions/Fetch/fetchCheckAppInfoUpdate'
import fetchMasterData from '../../Apollo/Functions/Fetch/fetchMasterData'
import fetchUser from '../../Apollo/Functions/Fetch/fetchUser'
import CustomButton from '../../Components/Button/customButton'
import LoginAuthorization from '../../Components/Form/loginAuthorization.jsx'
import InputCT from '../../Components/Input/inputCT'
import LoginHeader from '../../Components/Login/loginHeader'
import { getBase64Image } from '../../Components/Profile/helper'
import { FullMessageData, VERSION } from '../../Constants'
import auth from '../../Helpers/auth'
import consoleLog from '../../Helpers/consoleLog'
import { useMergeState } from '../../Helpers/customHooks'
import { loginRequest } from '../../Redux/Actions/login'
import { fetchCountry } from './helper'
import BiofluxSignIn from './Layout/BiofluxSignIn'

const { IncorrectDefault } = FullMessageData.Authorization
const { SENDING_TIME_SHEET_MASTER_DATA } = FullMessageData

const SignIn = (props) => {
  const history = useHistory()
  const tempSuccess = useRef(undefined)
  const showNotificationTime = useRef(0)

  const [state, setState] = useMergeState({
    email: '',
    password: '',
    errorStatus: undefined,
    newPassword: '',
    newPasswordErr: '',
    confirmPassword: '',
    confirmPasswordErr: '',

    loading: false,
    isUpdatePassword: false,
    isSignInWithBioflux: false,
    biofluxLoading: false,
    isShowVersionModal: false
  })

  const debounceShowNotification = () => {
    if (moment().valueOf() - showNotificationTime.current > 5000) {
      notification.error({
        message: 'There is no internet connection',
        placement: 'bottomLeft',
        duration: 5,
        onClose: () => {
          showNotificationTime.current = 0
        }
      })
      showNotificationTime.current = moment().valueOf()
    }
  }

  const {
    email,
    password,
    errorStatus,
    loading,
    newPassword,
    confirmPassword,
    newPasswordErr,
    confirmPasswordErr,
    isUpdatePassword,
    isSignInWithBioflux,
    biofluxLoading,
    isShowVersionModal
  } = state

  const onChange = (key, value) => {
    setState({
      [key]: value,
      errorStatus: undefined,
      newPasswordErr: '',
      confirmPasswordErr: ''
    })
  }

  const onClickSignIn = async () => {
    setState({ errorStatus: 'error', loading: false })
  }

  const loginWithBioflux = async () => {
    setState({ biofluxLoading: true })
    const obj = { biofluxLoading: false }
    try {
      const success = await Auth.currentAuthenticatedUser()
      const pendingPromises = [fetchUser(), fetchMasterData(SENDING_TIME_SHEET_MASTER_DATA)]

      const resArr = await Promise.all(pendingPromises)
      const { username, attributes } = success
      if (resArr[0]) {
        let base64
        if (resArr[0]?.photo) {
          base64 = await getBase64Image(resArr[0].photo)
        }
        _.assign(resArr[0], { photo: base64 || '' })
        props.loginRequest({
          ...attributes,
          username,
          ...resArr[0],
          timeSheetCode: resArr[1]?.value
        })
        auth.setLoginBioflux(true)
      } else {
        // props.logoutRequest();
        _.assign(obj, { errorStatus: 'error' })
      }
      fetchCountry()
      setState(obj)
    } catch (error) {
      // _.assign(obj, { errorStatus: 'error' });
    }
    setState(obj)
  }

  const checkUpdateConditions = () => {
    if (!newPassword || newPassword.length < 8) {
      setState({
        newPasswordErr: 'The password must be at least 8 characters'
      })
      return true
    }
    if (newPassword !== confirmPassword) {
      setState({ confirmPasswordErr: 'The specified passwords do not match' })
      return true
    }
    return false
  }

  const onClickUpdate = async () => {
    if (checkUpdateConditions() || _.isEmpty(tempSuccess.current)) {
      return
    }
    setState({ loading: true })
    const obj = { loading: false }
    try {
      await Auth.completeNewPassword(tempSuccess.current, newPassword)
      const pendingPromises = [fetchUser(), fetchMasterData(SENDING_TIME_SHEET_MASTER_DATA)]
      const resArr = await Promise.all(pendingPromises)
      const { username, attributes } = tempSuccess.current
      let base64
      if (resArr[0]?.photo) {
        base64 = await getBase64Image(resArr[0].photo)
      }
      _.assign(resArr[0], { photo: base64 || '' })
      props.loginRequest({
        ...attributes,
        username,
        ...resArr[0],
        timeSheetCode: resArr[1]?.value
      })
      fetchCountry()
      setState(obj)
    } catch (error) {
      consoleLog('Failed to update password', error)
      switch (error.code) {
        case 'NetworkError':
          debounceShowNotification()
          break
        default:
          _.assign(obj, { errorStatus: 'error' })
          break
      }
    }
    setState(obj)
  }

  useEffect(() => {
    if (props.login.isSuccess || auth.isSuccess()) {
      history.push('/dashboard')
    }
  }, [props.login])

  useEffect(() => {
    // get data if user logined
    // listen callback from social login
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          break
        case 'cognitoHostedUI':
          loginWithBioflux()
          break
        default:
          break
      }
    })
  }, [])

  const handleCheckVersion = async () => {
    try {
      const res = await fetchCheckAppInfoUpdate(VERSION.api)
      if (res || _.isNull(res)) {
        // if (res) {
        setState({ isShowVersionModal: true })
        return
      }
      Auth.federatedSignIn({ provider: 'Bioflux' })
      setState({ biofluxLoading: true })
    } catch (error) {
      consoleLog('Failed to check version: ', error)
    }
  }

  const onToggleBioflux = () => {
    setState({ isSignInWithBioflux: !isSignInWithBioflux })
  }

  const showInputForm = () => (
    <Form name='basic' className='mt24' initialValues={{ remember: false }} onFinish={onClickSignIn}>
      <Form.Item className='mb0' validateStatus={errorStatus}>
        <InputCT
          disabled={loading}
          name='email'
          title='Email'
          placeholder='Enter your email'
          value={email}
          onChange={onChange}
        />
      </Form.Item>

      <Form.Item className='mb0-mt16' validateStatus={errorStatus}>
        <InputCT
          disabled={loading}
          name='password'
          title='Password'
          placeholder='Enter your password'
          value={password}
          type='PASSWORD'
          onChange={onChange}
        />
      </Form.Item>

      {errorStatus === 'error' && (
        <div className='div-incorrect-mes'>
          <span>{IncorrectDefault}</span>
        </div>
      )}

      {/* {!isSignInWithBioflux && (
        <Link to="/forgot-password" className="remember-row">Forgot password?</Link>
      )} */}

      <Form.Item className='mb0-mt40'>
        <CustomButton
          className='sign-in-button'
          disabled={!email || !password || biofluxLoading || loading}
          loading={loading}
          type='primary'
          block
          htmlType='submit'
          label='Sign in'
        />
      </Form.Item>
    </Form>
  )

  const showUpdateForm = () => (
    <Form>
      <Form.Item className='mb0-mt32' validateStatus={newPasswordErr ? 'error' : undefined}>
        <InputCT
          name='newPassword'
          title='New password'
          placeholder='Enter new password'
          value={newPassword}
          type='PASSWORD'
          onChange={onChange}
          autoComplete='new-password'
          errMes={newPasswordErr}
        />
      </Form.Item>

      <Form.Item className='mb0-mt16' validateStatus={confirmPasswordErr ? 'error' : undefined}>
        <InputCT
          name='confirmPassword'
          title='Confirm new password'
          placeholder='Enter new password again'
          value={confirmPassword}
          type='PASSWORD'
          onChange={onChange}
          autoComplete='new-password'
          errMes={confirmPasswordErr}
        />
      </Form.Item>

      <Form.Item className='mb0-mt32'>
        <CustomButton
          disabled={!newPassword || !confirmPassword}
          type='primary'
          block
          onClick={onClickUpdate}
          loading={loading}
          label='Update'
        />
      </Form.Item>
    </Form>
  )

  const renderLeft = () => (
    <div className='sign-in-left'>
      {isUpdatePassword ? (
        <div>
          <LoginHeader
            title='Update password'
            content='You need to update your password because this is the first time you are signing in.'
          />

          {showUpdateForm()}
        </div>
      ) : (
        <>
          <div>
            {isSignInWithBioflux && (
              <CustomButton
                type='primary'
                ghost
                className='fcen mb24'
                icon={<ArrowLeftOutlined />}
                onClick={onToggleBioflux}
                label='Go back'
              />
            )}

            <LoginHeader
              title={isSignInWithBioflux ? 'Sign in with Bioflux' : 'Patient sign-in'}
              content={
                isSignInWithBioflux
                  ? 'Please fill out all the fields below to sign in'
                  : 'Please fill out all the fields below to sign in to your account'
              }
            />
            {showInputForm()}
            {/* {!isSignInWithBioflux && showSignInWithBiofluxButton()} */}
          </div>

          <div>
            {/* <div>{`Version ${version}.${buildNumber}`}</div> */}

            <div className='sign-in-copyright'>
              <span>{`© ${moment().format('YYYY')} Biotricity All rights reserved.`}</span>
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <>
      <LoginAuthorization>
        <div className='sign-in-wrapper'>
          {renderLeft()}

          <div className='sign-in-right'>
            <BiofluxSignIn
              // loading={biofluxLoading}
              onClickSignInBioflux={handleCheckVersion}
            />
          </div>
        </div>
      </LoginAuthorization>

      <Modal
        visible={biofluxLoading}
        className='modal-bioflux-loading'
        closable={false}
        footer={null}
        // afterClose={onResetState}
        centered
      >
        <div className='modal-bioflux-loading-wrapper'>
          <div className='modal-bioflux-loading-top'>
            <Spin indicator={<LoadingOutlined className='modal-bioflux-loading-top-spin' spin />} />
          </div>
          <div className='mt16'>
            <span>Signing in...</span>
          </div>
        </div>
      </Modal>
    </>
  )
}

SignIn.propTypes = {
  login: PropTypes.shape({
    isSuccess: PropTypes.bool
  }).isRequired,
  loginRequest: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  login: state.login
})

const mapDispatchToProps = {
  loginRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
