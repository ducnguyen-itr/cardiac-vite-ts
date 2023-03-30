import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './style.scss';

function PatientTypeTag(props) {
  return (
    <>
      {props.isShow && (
        <div className={classNames('patient-type-tag', props.isCCM ? 'is-ccm-patient' : '', props.className)}>
          {props.isCCM ? 'CCM' : 'RPM'}
        </div>
      )}
    </>
  );
}

PatientTypeTag.defaultProps = {
  className: '',
  isShow: false,
  isCCM: false,
};

PatientTypeTag.propTypes = {
  /** overwrite clasname */
  className: PropTypes.string,
  /** condition show tag */
  isShow: PropTypes.bool,
  /** is ccm type */
  isCCM: PropTypes.bool,
};

export default PatientTypeTag;
