import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Popover, Tag } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './style.scss';
import classnames from 'classnames';

function TooltipTag(props) {
  const content = (
    <div className={classnames('tooltip-tag-content-wrapper', props.popoverClassName)}>
      {_.map(props.data, (x, i) => (
        <div className="tooltip-tag-content" key={i}>{`• ${x}`}</div>
      ))}
    </div>
  );
  return (
    <div className="tooltip-tag-wrapper">
      <Popover
        // getPopupContainer={trigger => trigger.parentElement}
        className="tooltip-tag-popover"
        content={content}
        title="Title"
        trigger={props.trigger}
      >
        <Tag
          className="fcen tooltip-tag"
          icon={props.icon ? props.icon : <ExclamationCircleOutlined />}
          color={props.type}
        >
          {props.title}
        </Tag>
      </Popover>
    </div>
  );
}
TooltipTag.defaultProps = {
  data: [],
  popoverClassName: '',
  icon: undefined,
  title: 'Missing info',
  type: 'error',
  trigger: 'hover',
};

TooltipTag.propTypes = {
  /* Array data show on popover */
  data: PropTypes.arrayOf(PropTypes.string),
  /* Over write popover classname */
  popoverClassName: PropTypes.string,
  /* Icon inside tag */
  icon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  /* Main name/title of tag */
  title: PropTypes.string,
  /* Type color use on tag */
  type: PropTypes.oneOf(['success', 'processing', 'error', 'warning', 'default']),
  /* Trigger popover method */
  trigger: PropTypes.oneOf(['hover', 'focus', 'click', 'contextMenu']),
};


export default TooltipTag;
