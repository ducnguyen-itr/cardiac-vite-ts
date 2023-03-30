import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { EditFilled } from '@ant-design/icons';
import { Button } from 'antd';

const EditButton = (props) => {
  const {
    className, onClick, id, title, icon, type, ghost,
  } = props;
  return (
    <Button
      id={id}
      onClick={onClick}
      className={classnames('edit-button-wrapper fcen', className)}
      icon={icon}
      type={type}
    >
      {title}
    </Button>
  );
};
EditButton.defaultProps = {
  title: 'Edit',
  className: '',
  onClick: () => {},
  id: '',
  icon: <EditFilled />,
  type: undefined,
};
EditButton.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
  icon: PropTypes.shape(),
  type: PropTypes.string,
};

export default EditButton;
