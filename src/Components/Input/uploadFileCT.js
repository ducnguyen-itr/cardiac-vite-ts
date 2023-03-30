import { PaperClipOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd';
import classnames from 'classnames';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import mime from 'mime-types';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef } from 'react';
import Dropzone from 'react-dropzone';
import Blue1BgRow from '../UI/blue1BgRow';
import InputTitle from './inputTitle';


const { Dragger } = Upload;

const UploadFileCT = (props) => {
  const showNotificationTime = useRef(0);

  const {
    className, title, placeholder, titleClassName, name,
    fileList, isShowUpload,
    data, uploadClassName, customZoneContent,
    icon,
  } = props;


  // const uploadProps = {
  //   data,
  //   multiple: true,
  //   onChange(info) {
  //     props.onChange(name, info.fileList);
  //   },
  //   beforeUpload: () => false,
  //   progress: {
  //     strokeColor: { '0%': '#108ee9', '100%': '#87d068' },
  //     strokeWidth: 3,
  //     format: percent => `${parseFloat(percent.toFixed(2))}%`,
  //   },
  //   className: classnames('upload-files-ct-main', uploadClassName),
  //   fileList,
  //   accept: 'image/*',
  //   listType: 'picture',
  //   isImageUrl: () => true,
  // };


  const debounceShowNotification = (message) => {
    if (moment().valueOf() - showNotificationTime.current > 5000) {
      notification.error({
        message,
        placement: 'bottomLeft',
        duration: 5,
        onClose: () => {
          showNotificationTime.current = 0;
        },
      });
      showNotificationTime.current = moment().valueOf();
    }
  };

  const onDropRejected = () => {
    if (props.isShowDropRejected) {
      debounceShowNotification('Invalid file type');
    }
  };

  const onClickDownloadFile = (item) => {
    const type = mime.contentType(item.name);
    const blob = new Blob([item.arrayBuffer], { type });
    fileDownload(blob, item.name);
  };

  return (
    <div className={classnames('upload-files-ct-wrapper', className)}>
      <InputTitle title={title} className={titleClassName} />


      {/* <Dragger {...uploadProps}>
        <Button ghost className="upload-files-button">
          {placeholder}
        </Button>
      </Dragger> */}


      {
        isShowUpload && (
          <Dropzone
            onDrop={(acceptedFiles) => {
              props.onChange(name, acceptedFiles);
            }}
            onDropRejected={onDropRejected}
            accept={props.accept}
            multiple={props.multiple}
            maxSize={props.maxSize}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div className="upload-file-new">
                    {customZoneContent ? (
                      <>
                        {customZoneContent}
                      </>
                    ) : (
                      <>
                        <span>{placeholder}</span>
                      </>

                    )}
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
        )
      }
      {props.customFileList || (
        <>
          {
            _.map(fileList, item => (
              <Blue1BgRow
                icon={icon || <PaperClipOutlined className="paper-clip-ct" />}
                key={item?.name}
                value={item?.name}
                className={classnames('mt8', props.resClassName)}
                onClick={() => {
                  props.onClickDelete(name, item);
                }}
                isShowDeleteButton={props.isShowUpload}
                isAbleToDownload={props.isAbleToDownload}
                onClickDownloadFile={() => {
                  onClickDownloadFile(item);
                }}
              />
            ))
          }
        </>
      )}
    </div>
  );
};

UploadFileCT.defaultProps = {
  className: undefined,
  titleClassName: undefined,
  uploadClassName: undefined,
  title: '',
  placeholder: 'Click or drag files to this area to upload',
  onChange: () => { },
  name: '',
  data: undefined,
  fileList: [],
  isShowUpload: true,
  accept: undefined,
  resClassName: '',
  isAbleToDownload: false,
  onClickDelete: () => { },
  icon: undefined,
  customZoneContent: undefined,
  isShowDropRejected: true,
  multiple: true,
  maxSize: undefined,
  customFileList: undefined,
};

UploadFileCT.propTypes = {
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  uploadClassName: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.shape(), PropTypes.arrayOf(PropTypes.shape())]),
  fileList: PropTypes.arrayOf(PropTypes.shape()),
  isShowUpload: PropTypes.bool,
  onClickDelete: PropTypes.func,
  accept: PropTypes.string,
  resClassName: PropTypes.string,
  isAbleToDownload: PropTypes.bool,
  icon: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  customZoneContent: PropTypes.node,
  customFileList: PropTypes.node,
  isShowDropRejected: PropTypes.bool,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
};

export default UploadFileCT;
