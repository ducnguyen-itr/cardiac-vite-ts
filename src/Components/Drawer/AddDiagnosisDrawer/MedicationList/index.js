/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import './style.scss';
import { CloseOutlined } from '@ant-design/icons';

const MedicationList = (props) => {
  const onDeleteMedication = (med) => {
    props.onDeleteMedication(med);
  };

  return (
    <div className={classnames('medications', props.className)}>
      {props.medications.length !== 0 && (
      <div className="medications">
        {props.medications.map(item => (
          <div className="medication-line" key={item._id}>
            <div className="medication-line-med-name">
              {item.label}
            </div>
            <div className="medication-line-action" onClick={() => onDeleteMedication(item)}>
              <CloseOutlined />
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

MedicationList.defaultProps = {
  className: undefined,
  medications: [],

  onDeleteMedication: () => { },
};

MedicationList.propTypes = {
  /** override className */
  className: PropTypes.string,
  /** medications data */
  medications: PropTypes.arrayOf(PropTypes.string),

  /** on delete medication event */
  onDeleteMedication: PropTypes.func,
};

export default MedicationList;
