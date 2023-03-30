import React, {
  // useState, useContext, useEffect, useCallback, useMemo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import CustomButton from '../Button/customButton';
import { TOOLTIP_MESSAGES } from '../../Constants';
// import { useMergeState } from '../../Helpers/customHooks';

const VerticalText = (props) => {
  // const [state, setState] = useMergeState({
  //   data: [],
  // });
  const {
    className, title, content, contentClass, isNoSeparator, onClick,
  } = props;
  return (
    <Fragment>
      <div className={classnames('vertical-text-wrapper', className)}>
        <div className="vertical-text-title">
          <span>{title}</span>
        </div>

        {title === 'Patient' ? (
          <div className="fr">
            <CustomButton className={classnames('vertical-text-content', 'bas-0-btn', contentClass)} onClick={onClick} label={content} />
            {props?.willDeletedAt && (
              <Tooltip title={TOOLTIP_MESSAGES.DELETED_ACCOUNT} placement="bottom">
                <ExclamationCircleOutlined className="is-deleted-icon" />
              </Tooltip>
            )}
          </div>
        )

          : (
            <div className={classnames('vertical-text-content', contentClass)}>
              <span>{content}</span>
            </div>
          )}
      </div>

      {isNoSeparator ? null : <div className="vertical-text-separator" /> }
    </Fragment>
  );
};
VerticalText.defaultProps = {
  className: '',
  title: '',
  content: '',
  contentClass: '',
  isNoSeparator: false,
  willDeletedAt: '',
  onClick: () => {},
};
VerticalText.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  contentClass: PropTypes.string,
  isNoSeparator: PropTypes.bool,
  willDeletedAt: PropTypes.string,
  onClick: PropTypes.func,
};

export default VerticalText;
