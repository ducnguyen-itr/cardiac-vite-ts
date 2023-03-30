import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const LoginHeader = (props) => {
  const { className, title, content } = props
  return (
    <div className={classnames('login-header-wrapper', className)}>
      {title && (
        <div className='login-header-title'>
          <span>{title}</span>
        </div>
      )}

      {content && (
        <div className='login-header-content'>
          <span>{content}</span>
        </div>
      )}
    </div>
  )
}
LoginHeader.defaultProps = {
  className: '',
  title: '',
  content: ''
}
LoginHeader.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Title of component */
  title: PropTypes.string,
  /** Content of component */
  content: PropTypes.string
}

export default LoginHeader
