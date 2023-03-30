import { CloseOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomAvatar from '../Avatar';

const { Title } = Typography;

const AssignTag = (props) => {
  const {
    className, firstName, lastName, onDeleteTag, email, photo,
  } = props;
  return (
    <Tag
      onClose={onDeleteTag}
      closable
      closeIcon={<CloseOutlined className="color-gray-10" />}
      className={classnames('result-tag', ' f1-r fr-sb', className)}
    >
      <div className="fr fitems-center">
        <CustomAvatar
          avatarLink={photo}
          size={32}
          firstName={firstName}
          lastName={lastName}
        />
        <Title level={5} className={classnames('ml16', 'mb0')}>
          {`${firstName} ${lastName}`}
          {
            email && (
            <div className="assign-tag-email">
              {email}
            </div>
            )
          }
        </Title>
      </div>
    </Tag>
  );
};
AssignTag.defaultProps = {
  className: '',
  firstName: '',
  lastName: '',
  onDeleteTag: () => { },
  email: '',
  photo: '',
};
AssignTag.propTypes = {
  className: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onDeleteTag: PropTypes.func,
  email: PropTypes.string,
  photo: PropTypes.string,
};

export default AssignTag;
