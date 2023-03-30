import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Space, Spin } from 'antd';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import fileDownload from 'react-file-download';

import CustomButton from '../../Button/customButton';
import './style.scss';
import CustomVideoPlayer from '../../CustomVideoPlayer';
import { useMergeState } from '../../../Helpers/customHooks';
import consoleLog from '../../../Helpers/consoleLog';
import { handleFetchImageMessage } from '../../../Pages/Messages/MessageChatView/MessageItem/helper';

function PreviewFileModal(props) {
  return (
    <Modal
      className="preview-file-modal"
      title="Modal 1000px width"
      centered
      visible={props.visible}
      closable={false}
      width={1056}
      style={{ top: '40px' }}
      maskStyle={{ background: '#000000', opacity: '0.8' }}
    >
      <div className="preview-action-center">
        <CustomButton
          className="print-btn"
          onClick={() => props.onClickDowload(props.previewData)}
          icon={<DownloadOutlined />}
        />
        <CustomButton
          onClick={props.toggleModal}
          label="Close"
        />
      </div>
      <div className={classNames('preview-file-container')}>
        {props.loading ? (
          <Space className="loading-space" size="middle">
            <div className="loader" />
          </Space>
        ) : (
          <>
            {props?.previewData?.type === 'video'
              ? <CustomVideoPlayer onErrorVideo={props.onErrorVideo} url={props.previewData?.videoUrl || props.previewData?.presignedUrl} />
              : <img className="preview-file-image" src={props.previewData?.thumbnailUrl || props.previewData?.imageUrl} alt="" />}
          </>
        )}
      </div>
    </Modal>
  );
}

PreviewFileModal.defaultProps = {
  visible: false,
  previewData: {},
  onClickDowload: () => { },
  toggleModal: () => { },
  loading: false,
  onErrorVideo: () => { },
};

PreviewFileModal.propTypes = {
  visible: PropTypes.bool,
  previewData: PropTypes.shape(),
  onClickDowload: PropTypes.func,
  toggleModal: PropTypes.func,
  loading: PropTypes.bool,
  onErrorVideo: PropTypes.func,
};

export default PreviewFileModal;
