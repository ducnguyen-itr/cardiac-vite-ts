import React from 'react';
import PropTypes from 'prop-types';
import { Space, Spin } from 'antd';

function LoadingSpace(props) {
  return (
    <>
      {props.loading && (
        <Space className="loading-space" size="middle">
          <Spin size="large" />
        </Space>
      )}
    </>
  );
}

LoadingSpace.defaultProps = {
  loading: false,
};
LoadingSpace.propTypes = {
  /** Whether show loading */
  loading: PropTypes.bool,
};

export default LoadingSpace;
