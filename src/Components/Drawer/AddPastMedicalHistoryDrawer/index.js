import { Drawer } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AddPastMedicalHistoryBody from './AddPastMedicalHistoryBody';
import './style.scss';

const AddPastMedicalHistoryDrawer = (props) => {
  const {
    visible, className, ...rest
  } = props;

  return (
    <Drawer
      width={400}
      placement="right"
      className={classNames('add-past-medical-history-drawer', className)}
      onClose={props.onClose}
      visible={visible}
      destroyOnClose
    >
      <AddPastMedicalHistoryBody {...rest} />
    </Drawer>
  );
};

AddPastMedicalHistoryDrawer.defaultProps = {
  className: '',
  visible: false,
  isAddAFib: false,
  initData: {},
  onClose: () => { },
};

AddPastMedicalHistoryDrawer.propTypes = {
  /** component class name */
  className: PropTypes.string,
  /** visible */
  visible: PropTypes.bool,
  /** is add new */
  isAddAFib: PropTypes.bool,
  /** component init data */
  initData: PropTypes.shape(),
  /** event cancel */
  onClose: PropTypes.func,
};

export default AddPastMedicalHistoryDrawer;
