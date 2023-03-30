import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Radio, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import InputTitle from './inputTitle';
import { RADIO_TYPES } from '../../Constants';

const RadioCT = (props) => {
  const {
    className, data, type, title, value, textClass,
    titleClassName, radioItemClassName, name,
    disabled,
  } = props;

  let itemMagrinTop = 'mt18';
  let itemClassName = '';
  let titleClass = '';
  switch (type) {
    case RADIO_TYPES.QUESTION:
      itemMagrinTop = 'mt8';
      itemClassName = 'question-item-normal';
      titleClass = titleClassName || 'question-title';
      break;
    case RADIO_TYPES.SCORE:
      itemClassName = 'score-ct';
      itemMagrinTop = '';
      break;
    case RADIO_TYPES.BIG:
      itemClassName = 'big-margin';
      break;
    case RADIO_TYPES.NONE:
      itemMagrinTop = 'mt12';
      itemClassName = 'fw-normal';
      break;
    case RADIO_TYPES.APPOINTMENT:
      titleClass = 'mb8';
      break;
    default:
      break;
  }

  const onChange = (e) => {
    if (props.isObject) {
      props.onChange(name, e.target.options);
      return;
    }
    props.onChange(name, e.target.value);
  };

  return (
    <div className={classnames('radio-ct-wrapper', className)}>
      <InputTitle title={title} className={titleClass} />
      {
        type === RADIO_TYPES.APPOINTMENT ? (
          <Radio.Group
            className="appointment-ct"
            options={data}
            onChange={onChange}
            value={value}
            disabled={disabled}
          />
        ) : (
          <Radio.Group
            disabled={disabled}
            onChange={onChange}
            value={props.isObject ? value.value : value}
          >
            {_.map(data, (x, i) => (
              <div key={i} className={classnames('radio-item', radioItemClassName)}>
                <Radio
                  value={props.isObject ? x.value : x}
                  options={x}
                  className={classnames(itemMagrinTop, itemClassName, textClass, x.content ? 'fw-600' : '')}
                  disabled={x.disabled}
                >
                  {x.title}
                  {!!x.toolTipText && (
                    <Tooltip placement="top" title={x.toolTipText}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  )}
                </Radio>
                {x.content ? (
                  <div className="radio-content">
                    <span>{x.content}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </Radio.Group>
        )
      }
    </div>
  );
};
RadioCT.defaultProps = {
  name: '',
  className: '',
  textClass: '',
  titleClassName: '',
  radioItemClassName: '',
  onChange: () => { },
  data: [],
  // itemMagrinTop: 'mt18',
  type: 'SCORE',
  title: '',
  value: undefined,
  disabled: false,
  isObject: false,
};
RadioCT.propTypes = {
  /** Name of radio */
  name: PropTypes.string,
  /** Classname of radio */
  className: PropTypes.string,
  /** Class of text of radio */
  textClass: PropTypes.string,
  /** Title classname */
  titleClassName: PropTypes.string,
  /** Classname of radio item */
  radioItemClassName: PropTypes.string,
  /** On change handler */
  onChange: PropTypes.func,
  /** of radio */
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape()),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** of radio */
  value: PropTypes.oneOfType([
    PropTypes.shape(),
    PropTypes.string,
  ]),
  /** of radio */
  title: PropTypes.string,
  /** of radio */
  type: PropTypes.string,
  /** of radio */
  disabled: PropTypes.bool,
  /** of radio */
  isObject: PropTypes.bool,
};

export default RadioCT;
