import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Radio } from 'antd';
import InputTitle from './inputTitle';

const YesNoRadio = (props) => {
  const {
    className, title, data, value, onChange, name,
  } = props;

  return (
    <div className={classnames('yes-no-radio-wrapper', className)}>

      <InputTitle title={title} className="mb8" />

      <Radio.Group
        onChange={e => onChange(name, e.target.value)}
        value={value}
        className="yes-no-radio-main"
      >
        {_.map(data, (x, i) => (
          <div key={i} className="radio-item">
            <Radio value={x} className={i !== 0 ? 'mt8' : ''}>
              {x}
            </Radio>
          </div>
        ))}
      </Radio.Group>
    </div>
  );
};
YesNoRadio.defaultProps = {
  className: '',
  title: '',
  onChange: () => {},
  data: ['No', 'Yes'],
  value: undefined,
  name: '',
};
YesNoRadio.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onChange: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  name: PropTypes.string,
};

export default YesNoRadio;
