import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const InputTitle = (props) => {
  const { className, title } = props
  if (title) {
    return (
      <div className={classnames('input-title-wrapper', className)}>
        <span>
          {title}
          <span className='star-sign'>{props.isRequire && <> *</>}</span>
        </span>
      </div>
    )
  }
  return null
}
InputTitle.defaultProps = {
  className: '',
  title: '',
  isRequire: false
}
InputTitle.propTypes = {
  /** Overwrite classname */
  className: PropTypes.string,
  /** Title of input */
  title: PropTypes.string,
  /** Whether the input is required */
  isRequire: PropTypes.bool
}

export default InputTitle
