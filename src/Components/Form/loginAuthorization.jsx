import { Row, Col } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import _ from 'lodash'
import loginbg from '../../Image/Components/Form/newBg.jpg'
import logo from '../../Image/Pages/Login/appLogo.svg'

const LoginAuthorization = (props) => {
  const { children } = props
  return (
    <div className='login-authorization-wrapper'>
      <div className='login-authorization-bg-wrapper'>
        <div className='login-authorization-bg' style={{ backgroundImage: `url(${loginbg})` }} />
        {/* <div className="bg-cover" /> */}
      </div>

      <Row gutter={24} className='login-authorization-page'>
        <Col span={6} />
        {/* <Col span={4} className="login-authorization-left">
          <img src={logo} alt="Biocare logo" className="min-w-200" />
        </Col> */}
        <Col span={12} className='login-authorization-col'>
          <div className='login-authorization-logo-wrapper'>
            <img src={logo} alt='Biocare logo' className='login-authorization-logo' />
          </div>
          <div className='login-authorization-content'>
            <div className='login-authorization-main'>
              <div className='login-authorization-body'>{children}</div>
            </div>
          </div>
        </Col>
        <Col span={6} />
      </Row>
    </div>
  )
}
LoginAuthorization.defaultProps = {
  children: {}
}
LoginAuthorization.propTypes = {
  children: PropTypes.node
}

export default LoginAuthorization
