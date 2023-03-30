import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { AppstoreFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { } from 'antd';

const DisplayData1 = (props) => {
  const {
    className, title, data, icon,
  } = props;

  const showIcon = (isCheck = false) => {
    switch (icon) {
      case 'CHECK':
        return isCheck ? <CheckCircleFilled className={classnames('data-1-icon', 'color-green-6')} />
          : <CloseCircleFilled className={classnames('data-1-icon', 'color-red-5')} />;
      default:
        return <AppstoreFilled className="data-1-icon" />;
    }
  };

  return (
    <div className={classnames('display-data-1-wrapper', className)}>

      <div className="size-16-b-g9">
        <span>{title}</span>
      </div>

      {_.map(data, (x, i) => (
        x.isCheck && (
        <div key={i} className="display-data-1-item">
          {showIcon(x.isCheck)}

          <div className="size-14-n-g9">
            <span>{x.value}</span>
          </div>
        </div>
        )
      ))}

    </div>
  );
};
DisplayData1.defaultProps = {
  className: '',
  title: '',
  data: [],
  icon: '',
};
DisplayData1.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape()),
  icon: PropTypes.string,
};

export default DisplayData1;
