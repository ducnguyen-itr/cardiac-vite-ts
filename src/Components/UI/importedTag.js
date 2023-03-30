import { FileSyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import React from 'react';

function ImportedTag(props) {
  return (
    <Tag icon={<FileSyncOutlined />} className="fw-normal f-al-center" color="#389E0D">
      Imported
    </Tag>
  );
}

ImportedTag.propTypes = {};

export default ImportedTag;
