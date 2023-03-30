import { CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import CustomButton from '../Button/customButton'

const Blue1BgRow = (props) => (
  <div className={classnames('blue-1-bg-row-wrapper', props.className)}>
    {props.isAbleToDownload ? (
      <Button
        type='link'
        className={classnames('blue-1-bg-row-value', 'bas-0-btn')}
        onClick={props.onClickDownloadFile}
      >
        {props.icon || null}
        <span className='m0'>{props.value}</span>
      </Button>
    ) : (
      <div className='blue-1-bg-row-value'>
        {props.icon || null}
        <span>{props.value}</span>
      </div>
    )}

    {props.isShowDeleteButton && (
      <CustomButton onClick={props.onClick} className='blue-1-bg-row-button' icon={<CloseOutlined />} />
    )}
  </div>
)

Blue1BgRow.defaultProps = {
  className: undefined,
  value: '',
  onClick: () => {},
  icon: undefined,
  isShowDeleteButton: false,
  isAbleToDownload: false,
  onClickDownloadFile: () => {}
}

Blue1BgRow.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.shape(),
  isShowDeleteButton: PropTypes.bool,
  isAbleToDownload: PropTypes.bool,
  onClickDownloadFile: PropTypes.func
}

export default Blue1BgRow
