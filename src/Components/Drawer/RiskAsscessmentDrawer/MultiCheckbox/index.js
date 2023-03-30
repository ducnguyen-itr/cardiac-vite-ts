import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './style.scss';
import { Checkbox } from 'antd';

const MultiCheckbox = (props) => {
  const onChange = (event) => {
    props.onChange(event);
  };
  return (
    <div className={classnames('multi-checkbox', props.className)}>
      {props.data.map(item => (
        <div className="multi-checkbox-row">
          <Checkbox
            key={item.key}
            checked={item.isChecked}
            name={item.key}
            onChange={onChange}
          >
            {item.value}
          </Checkbox>
          <div className="score">{item.suffix}</div>
        </div>
      ))}
    </div>
  );
};

MultiCheckbox.defaultProps = {
  className: undefined,
  data: [],

  onChange: () => {},
};
MultiCheckbox.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** data */
  data: PropTypes.arrayOf(PropTypes.shape()),

  /** on Change event */
  onChange: PropTypes.func,
};

export default MultiCheckbox;
