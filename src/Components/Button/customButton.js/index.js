import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Tooltip } from 'antd';
import './style.scss';

const CustomButton = (props) => {
  // why wrap the button inside tooltip
  // -> because tooltip will not work when wrap the custom button
  // why check exist tooltipTitle
  // -> because it will wrap span tag automatically if the button is disabled

  const renderButton = () => (
    <Button
      onClick={props.onClick}
      className={classnames(
        'custom-button',
        props.type === 'primary-light' ? 'custom-button--primary-light' : '',
        props.isReverse ? 'custom-button--reverse' : '',
        props.className,
      )}
      icon={props.icon}
      type={props.type === 'primary-light' ? 'link' : props.type}
      block={props.block}
      danger={props.danger}
      disabled={props.disabled}
      ghost={props.ghost}
      href={props.href}
      htmlType={props.htmlType}
      loading={props.loading}
      shape={props.shape}
      size={props.size}
      target={props.target}
    >
      {props.label}
    </Button>
  );

  if (props.tooltipTitle) {
    return (
      <Tooltip placement={props.tooltipPlacement} title={props.tooltipTitle}>
        {renderButton()}
      </Tooltip>
    );
  }
  return (
    <>
      {renderButton()}
    </>
  );
};

CustomButton.defaultProps = {
  className: '',
  type: 'default',
  label: '',
  icon: undefined,
  block: false,
  danger: false,
  disabled: false,
  ghost: false,
  href: undefined,
  htmlType: 'button',
  loading: false,
  shape: 'default',
  size: 'middle',
  target: undefined,
  isReverse: false,
  tooltipTitle: undefined,
  tooltipPlacement: 'top',
  onClick: () => {},
};

CustomButton.propTypes = {
  /** Classname of button */
  className: PropTypes.string,
  /** Type of button */
  type: PropTypes.oneOf(['default', 'primary', 'primary-light', 'ghost', 'dashed', 'link', 'text']),
  /** Label of button */
  label: PropTypes.string,
  /** Set the icon component of button */
  icon: PropTypes.node,
  /** Option to fit button width to its parent width */
  block: PropTypes.bool,
  /** Set the danger status of button */
  danger: PropTypes.bool,
  /** Disabled state of button */
  disabled: PropTypes.bool,
  /** Make background transparent and invert text and border colors */
  ghost: PropTypes.bool,
  /** Redirect url of link button */
  href: PropTypes.string,
  /** Set the original html type */
  htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
  /** Set the loading status of button */
  loading: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      delay: PropTypes.number,
    }),
  ]),
  /** Can be set button shape */
  shape: PropTypes.oneOf(['default', 'circle', 'round']),
  /** Set the size of button */
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  /** Same as target attribute of a, works when href is specified */
  target: PropTypes.string,
  /** Set is suffix icon */
  isReverse: PropTypes.bool,
  /** The text shown in the tooltip */
  tooltipTitle: PropTypes.string,
  /** The position of the tooltip relative to the target */
  tooltipPlacement: PropTypes.oneOf(['top', 'left', 'right', 'bottom', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']),
  /** Set the handler to handle click event */
  onClick: PropTypes.func,
};

export default CustomButton;
