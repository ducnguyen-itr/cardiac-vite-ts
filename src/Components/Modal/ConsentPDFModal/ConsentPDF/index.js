import { DownloadOutlined, PrinterFilled } from '@ant-design/icons';
import { Space, Spin } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import consoleLog from '../../../../Helpers/consoleLog';
import PDFViewer from '../../../../Pages/Support/Layout/PDFViewer';
import CustomButton from '../../../Button/customButton';
import './style.scss';

const ConsentPDF = (props) => {
  const [loading, setLoading] = useState(false);

  const hideOverlay = (time = 600, callback) => {
    const timer = setTimeout(() => {
      if (callback && _.isFunction(callback)) {
        callback();
      }
    }, time);
    return () => clearTimeout(timer);
  };

  const openPrintView = () => {
    try {
      const blobURL = props.attachmentsUrl;
      let iframe = document.getElementsByClassName('print-billing2-pdf')[0];
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.classList.add('print-billing2-pdf');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }
      iframe.src = blobURL;
      iframe.onload = () => {
        hideOverlay(300, () => {
          setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
          }, 100);
        });
      };
    } catch (error) {
      hideOverlay(300);
      consoleLog(error);
    }
  };

  useEffect(() => {
    if (props.visible) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [props.visible]);

  return (
    <>
      {loading || props.loading ? (
        <Space className="loading-space" size="middle">
          <Spin size="large" />
        </Space>
      ) : (
        <>
          <div className="header-action-button-container">
            <div />
            <div className="action-button-container">
              {props.isPdfFile && <CustomButton className="pdf-print-btn" onClick={openPrintView} icon={<PrinterFilled />} />}
              <CustomButton loading={false} className="pdf-download-btn" onClick={props.onDownload} icon={<DownloadOutlined />} />
            </div>
            <CustomButton onClick={props.onClose} className="pdf-close-btn" label="Close" />
          </div>
          {props.isPdfFile ? (
            <div className="pdf-viewer-wrapper consent-pdf-viewer-wrapper">
              <PDFViewer url={props.attachmentsUrl} />
            </div>
          )
            : (
              <div className="consent-image-viewer-wrapper">
                <img className="consent-image-display" src={props.attachmentsUrl} alt="" />
              </div>
            )
          }
        </>
      )}

    </>
  );
};

ConsentPDF.defaultProps = {
  visible: false,
  isPdfFile: false,
  loading: false,
  attachmentsUrl: '',
  onClose: () => {},
  onDownload: () => {},
};

ConsentPDF.propTypes = {
  /** visible */
  visible: PropTypes.bool,
  /** isPdfFile */
  isPdfFile: PropTypes.bool,
  /** loading */
  loading: PropTypes.bool,
  /** attachmentsUrl */
  attachmentsUrl: PropTypes.string,
  /** onClose */
  onClose: PropTypes.func,
  /** onDownload */
  onDownload: PropTypes.func,
};

export default ConsentPDF;
