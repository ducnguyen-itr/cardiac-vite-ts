import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Checkbox, Tooltip } from 'antd';
import InputTitle from './inputTitle';

const MultipleCheckbox = (props) => {
  const {
    className, data, suffix, title, isBoldValue,
    titleClassName, rowClassName,
    disabled,
  } = props;

  const onChange = (x, e) => {
    props.onChange(x, e.target.checked);
  };

  return (
    <div className={classnames('multiple-checkbox-wrapper', className)}>

      <InputTitle title={title} className={classnames('checkbox-ct-title', titleClassName)} />

      {
        _.map(data, (x, i) => (
          <div key={i} className={classnames('multiple-checkbox-main', rowClassName)}>
            <div className="multiple-checkbox-value">
              <Checkbox
                className={classnames('checkbox-item', isBoldValue ? 'fw600' : '')}
                checked={x?.isCheck}
                disabled={x?.disabled || disabled}
                onChange={e => onChange(x, e)}
              >
                {
                  x?.tooltip && x?.disabled ? (
                    <Tooltip
                      // visible
                      placement="bottom"
                      title={x.tooltip}
                      color="#262626"
                    >
                      {x?.value}
                    </Tooltip>
                  ) : x?.value
                }
              </Checkbox>
              {
              x?.content && (
              <div className="multiple-checkbox-content">
                <span>{x.content}</span>
              </div>
              )
            }
            </div>

            {
            x?.suffix && (
            <div className="checkbox-suffix">
              <span>{x.suffix}</span>
            </div>
            )
          }
          </div>
        ))
      }

    </div>
  );
};
MultipleCheckbox.defaultProps = {
  className: '',
  titleClassName: '',
  rowClassName: '',
  title: '',
  data: [],
  onChange: () => {},
  suffix: '',
  isBoldValue: false,
  disabled: false,
};
MultipleCheckbox.propTypes = {
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func,
  suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isBoldValue: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default MultipleCheckbox;
