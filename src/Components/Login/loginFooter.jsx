import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import CustomButton from '../Button/customButton'

const LoginFooter = (props) => {
  const { className, buttonTitle, content, onClick } = props
  return (
    <div className={classnames('login-footer-wrapper', className)}>
      <span>{content}</span>
      <CustomButton type='link' onClick={onClick} label={buttonTitle} />
    </div>
  )
}
LoginFooter.defaultProps = {
  className: '',
  content: '',
  buttonTitle: '',
  onClick: () => {}
}
LoginFooter.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Content of component */
  content: PropTypes.string,
  /** Button label of component */
  buttonTitle: PropTypes.string,
  /** Click event */
  onClick: PropTypes.func
}

export default LoginFooter
