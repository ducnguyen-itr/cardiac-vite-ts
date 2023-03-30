import { PlusOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import noDocumentIc from '../../Image/Pages/PatientDetails/no-document-ic.svg';
import CustomButton from '../Button/customButton';

const EmptyCT = (props) => {
  const {
    className, onClick, description, emptyIcon, btnIcon, btnClassName, btnTitle,
  } = props;
  return (
    <Empty
      className={classnames('empty-ct-wrapper', className)}
      image={<img src={emptyIcon || noDocumentIc} alt="No data icon" />}
      description={<span>{description}</span>}
    >
      {btnTitle ? (
        <CustomButton
          onClick={onClick}
          className={classnames('f1-cen', btnClassName)}
          type="primary"
          icon={btnIcon || <PlusOutlined />}
          label={btnTitle}
        />
      ) : null}
    </Empty>
  );
};
EmptyCT.defaultProps = {
  className: '',
  onClick: () => { },
  description: 'There is no data to display',
  emptyIcon: undefined,
  btnIcon: undefined,
  btnClassName: '',
  btnTitle: '',
};
EmptyCT.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  description: PropTypes.string,
  emptyIcon: PropTypes.string,
  btnIcon: PropTypes.shape(),
  btnClassName: PropTypes.string,
  btnTitle: PropTypes.string,
};

export default EmptyCT;
