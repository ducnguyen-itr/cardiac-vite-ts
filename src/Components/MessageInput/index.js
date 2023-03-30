import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { Button, Input } from 'antd';
import {
  CloseOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined, InboxOutlined, PaperClipOutlined, PictureOutlined, PlaySquareOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import sendMessageIcon from '../../Image/Components/Form/send-message-icon.svg';
import sendIconDisabled from '../../Image/Components/Form/send-icon-disabled.svg';
import { useMergeState } from '../../Helpers/customHooks';
import UploadFileCT from '../Input/uploadFileCT';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import { showFailedMsg } from '../../Utils/showNotification';
import {
  ACCEPT_TYPE,
  checkIsValidFileType,
  DESC_TEXT, FILE_TYPE, INPUT_TYPE, LIMIT_FILE,
} from './helper';


function MessageInput(props) {
  const [state, setState] = useMergeState({
    inputValue: '',
    showMaxSizeModal: false,
    isEmptyError: false,
  });
  const [dragState, setDragState] = useState(false);
  const [inputState, setInputState] = useState(INPUT_TYPE.INPUT);
  const [fileLists, setFileLists] = useState([]);

  const onClickUpload = () => {
    if (inputState === INPUT_TYPE.INPUT) {
      setInputState(INPUT_TYPE.DROPPING_FILE);
    }
    if (inputState === INPUT_TYPE.DROPPING_FILE) {
      setInputState(INPUT_TYPE.INPUT);
    }
  };

  const onClickSend = (e) => {
    e.preventDefault();
    const trimMsg = state.inputValue?.trim() || '';
    if (trimMsg || !_.isEmpty(fileLists)) {
      props.onSend({
        text: trimMsg,
        files: fileLists,
      });
      setState({ inputValue: '' });
      setFileLists([]);
      setInputState(INPUT_TYPE.INPUT);
    } else {
      setState({ isEmptyError: true });
    }
    const element = document.querySelector('.normal-message-input');
    if (element) {
      element.focus();
    }
  };

  const onChangeUploadFile = (name, files) => {
    setDragState(false);
    setFileLists(files);
  };

  const onRemove = (file, index) => {
    const cloneList = _.cloneDeep(fileLists || []);
    _.remove(cloneList, (x, i) => i === index);
    setFileLists(cloneList);
    if (_.isEmpty(cloneList)) {
      setInputState(INPUT_TYPE.INPUT);
    }
  };

  const onChange = (e) => {
    setState({ inputValue: e.target.value, isEmptyError: false });
  };

  const onDropFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState(false);
    const cloneList = _.cloneDeep(fileLists || []);
    const newData = [...cloneList, ...e.dataTransfer.files];
    const findBiggerSize = newData.find(x => x.size > LIMIT_FILE);
    if (findBiggerSize) {
      setState({ showMaxSizeModal: true });
      _.remove(newData, x => x.size > LIMIT_FILE);
    }
    const invalidType = newData.find(x => !checkIsValidFileType(x.type));
    if (invalidType) {
      showFailedMsg('Invalid file type!');
      _.remove(newData, x => !checkIsValidFileType(x.type));
    }
    setFileLists(newData);
    if (!_.isEmpty(newData)) {
      setInputState(INPUT_TYPE.DROPPING_FILE);
    }
  };

  const toggleCancelModal = () => {
    setState({ showMaxSizeModal: !state.showMaxSizeModal });
  };
  useEffect(() => {
    window.addEventListener('dragover', (event) => {
      // prevent default to allow drop
      event.preventDefault();
      if (!dragState) {
        setDragState(true);
      }
    });
    window.addEventListener('dragleave', (event) => {
      // prevent default to allow drop
      event.preventDefault();
      if (dragState) {
        setDragState(false);
      }
    }, false);
    window.addEventListener('drop', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragState(false);
    });
    return () => {
      window.removeEventListener('drop', () => { });
      window.removeEventListener('dragover', () => { });
    };
  }, []);

  const getIcon = (file) => {
    const { type } = file || {};
    if (type?.includes(FILE_TYPE.IMAGE)) {
      return <PictureOutlined />;
    }
    if (type?.includes(FILE_TYPE.VIDEO)) {
      return <PlaySquareOutlined />;
    }
    if (type?.includes(FILE_TYPE.TEXT)) {
      return <FileTextOutlined />;
    }
    if (type?.includes(FILE_TYPE.PDF)) {
      return <FilePdfOutlined />;
    }
    if (type === FILE_TYPE.DOC || type === FILE_TYPE.DOCX) {
      return <FileWordOutlined />;
    }
    return <FileOutlined />;
  };

  const customFileList = () => (
    <>
      {!_.isEmpty(fileLists) && (
        <>
          <Input
            className="normal-message-input"
            placeholder="Write a message ..."
            onChange={onChange}
            value={state.inputValue}
          />
          <div className="file-list-container">
            {_.map(fileLists, (x, i) => (
              <div className="file-item" key={i}>
                <div className="file-item-title">
                  <div className="file-item-title-icon">
                    {getIcon(x)}
                  </div>
                  <div className="file-item-title-name">
                    {x?.name}
                  </div>
                </div>
                <Button
                  onClick={() => onRemove(x, i)}
                  className="delete-icon-btn"
                >
                  <CloseOutlined />
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );

  const customZoneContent = () => (
    <div className="drop-zone-container">
      <div className="icon"><InboxOutlined /></div>
      <div className="description">
        <div className="bold-blue">Click here</div>
        <div>or drag file to this area to upload</div>
      </div>
      <div className="second-desc">{DESC_TEXT}</div>
    </div>
  );

  const renderInput = () => {
    switch (inputState) {
      case INPUT_TYPE.INPUT:
        return (
          <Input
            className="normal-message-input"
            placeholder="Write a message ..."
            onChange={onChange}
            value={state.inputValue}
            disabled={props.isDisabled}
          />
        );
      case INPUT_TYPE.DROPPING_FILE:
        return (
          <UploadFileCT
            className="send-message-upload-file"
            customZoneContent={customZoneContent()}
            onChange={onChangeUploadFile}
            name="inputFiles"
            customFileList={customFileList()}
            isShowUpload={_.isEmpty(fileLists)}
            maxSize={LIMIT_FILE} // 25Mb
            accept={ACCEPT_TYPE}
          />
        );
      default:
        return (
          <Input
            className="normal-message-input"
            placeholder="Write a message ..."
            onChange={onChange}
            value={state.inputValue}
            disabled={props.isDisabled}
          />
        );
    }
  };
  const isShowDragBg = () => {
    if (!dragState) return false;
    if (inputState === INPUT_TYPE.DROPPING_FILE && _.isEmpty(fileLists)) return false;
    return true;
  };

  return (
    <>
      <form className={classNames('message-input-wrapper',
        props.isDisabled ? 'is-disabled' : '',
        state.isEmptyError ? 'empty-error' : '')}
      >
        <div
          onDrop={onDropFile}
          // onDragLeave={onDragLeave}
          // onDragOver={onDragOver}
          className={classNames('message-input-container', dragState ? 'on-drag' : '', inputState === INPUT_TYPE.DROPPING_FILE ? 'dropping-file' : '')}
        >
          {isShowDragBg() && <div className="drop-zone-text">Drop your files here!</div>}

          {props.isDisabled ? (
            <div className="disabled-text">{props.disabledText}</div>
          ) : (
            <div className="input-container">
              {renderInput()}
            </div>
          )}
          <div className="divider" />
          <Button
            onClick={onClickUpload}
            htmlType="button"
            className={classNames('upload-btn', inputState === INPUT_TYPE.DROPPING_FILE ? 'active' : '')}
            disabled={props.isDisabled}
          >
            <PaperClipOutlined />
          </Button>
        </div>
        <Button
          // disabled
          htmlType="submit"
          size="large"
          shape="circle"
          type="primary"
          icon={<img src={props.isDisabled ? sendIconDisabled : sendMessageIcon} alt="" />}
          onClick={e => onClickSend(e)}
          disabled={props.isDisabled}
        />
      </form>

      <ConfirmationLayout
        onClick={toggleCancelModal}
        type={CONFIRMATION_LAYOUT_TYPES.OVER_SIZE}
        visible={state.showMaxSizeModal}
      />
      {/* <ConfirmationLayout
        onClick={toggleCancelModal}
        type={CONFIRMATION_LAYOUT_TYPES.INVALID_TYPE}
        visible={state.showInvalidTypeModal}
      /> */}
    </>
  );
}
MessageInput.defaultProps = {
  onSend: () => { },
  isDisabled: false,
  disabledText: 'Write a message ...',
};
MessageInput.propTypes = {
  onSend: PropTypes.func,
  isDisabled: PropTypes.bool,
  disabledText: PropTypes.string,
};

export default MessageInput;
