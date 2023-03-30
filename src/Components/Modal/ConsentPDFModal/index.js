import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import ConsentPDF from './ConsentPDF';

const ConsentPDFModal = props => (
  <Modal className="billing-pdf-modal-wrapper" width={1200} visible={props.visible} destroyOnClose>
    <ConsentPDF
      {...props}
    />
  </Modal>
);

ConsentPDFModal.defaultProps = {
  visible: false,
  isPdfFile: false,
  attachmentsUrl: '',
  onClose: () => {},
  onDownload: () => {},
};

ConsentPDFModal.propTypes = {
  /** visible */
  visible: PropTypes.bool,
  /** isPdfFile */
  isPdfFile: PropTypes.bool,
  /** attachmentsUrl */
  attachmentsUrl: PropTypes.string,
  /** onClose */
  onClose: PropTypes.func,
  /** onDownload */
  onDownload: PropTypes.func,
};

export default ConsentPDFModal;
