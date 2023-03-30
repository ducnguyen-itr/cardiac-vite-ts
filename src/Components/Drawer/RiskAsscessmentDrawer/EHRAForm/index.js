import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { Radio } from 'antd';
import _ from 'lodash';
import CustomButton from '../../../Button/customButton';
import { EHRA, RISK_ASSESSMENT } from '../helper';
import './style.scss';

const EHRAForm = (props) => {
  const [selectedEHRA, setSelectedEHRA] = useState('None');

  const onChange = (event) => {
    setSelectedEHRA(event.target.value);
    props.onChange();
  };

  const onSaveAndAddAnother = async () => {
    props.onAdd({ type: RISK_ASSESSMENT.EHRA, data: selectedEHRA, isAddAnother: true });
  };

  const onAdd = async () => {
    props.onAdd({ type: RISK_ASSESSMENT.EHRA, data: selectedEHRA });
  };

  const onSave = async () => {
    props.onSave({ type: RISK_ASSESSMENT.EHRA, data: selectedEHRA });
  };

  useEffect(() => {
    if (props.editingEHRA) {
      setSelectedEHRA(props.editingEHRA);
    }
  }, [props.editingEHRA]);
  return (
    <div className={classnames('ehra-form', props.className)}>
      <Radio.Group
        value={selectedEHRA}
        onChange={onChange}
      >
        {EHRA.map(item => (
          <div className="ehra-row">
            <Radio value={item.value}>
              <div className="ehra-row-title">
                {item.title}
              </div>
              {item?.content ? <div className="ehra-row-content">{item.content}</div> : <></>}
            </Radio>
          </div>
        ))}
      </Radio.Group>
      <div className="ehra-footer">
        {_.isEmpty(props.editingEHRA) ? (
          <>
            <CustomButton
              className="ehra-footer-btn"
              label="Save & add another"
              onClick={onSaveAndAddAnother}
              loading={props?.loading?.saveAndAddAnother}
              type="primary"
              ghost
            />
            <CustomButton
              className="ehra-footer-btn"
              label="Add"
              type="primary"
              onClick={onAdd}
              loading={props?.loading?.add}
            />
          </>
        ) : (
          <CustomButton
            className="ehra-footer-btn"
            label="Save"
            type="primary"
            disabled={_.isEqual(props.editingEHRA, selectedEHRA)}
            onClick={onSave}
            loading={props?.loading?.save}
          />
        )}
      </div>
    </div>
  );
};

EHRAForm.defaultProps = {
  className: undefined,
  editingEHRA: '',
  loading: {},
  onAdd: () => { },
  onSave: () => { },
  onChange: () => { },
};

EHRAForm.propTypes = {
  /** override className */
  className: PropTypes.func,
  /** editing ehra */
  editingEHRA: PropTypes.string,
  /** loading */
  loading: PropTypes.shape(),
  /** add event */
  onAdd: PropTypes.func,
  /** save event */
  onSave: PropTypes.func,
  /** change event */
  onChange: PropTypes.func,
};

export default EHRAForm;
