import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import TooltipTag from '../UI/TooltipTag';
import { getMissingText } from './helper';
import './style.scss';

function MissingPatientInfoTag(props) {
  const missingText = useMemo(() => getMissingText(props.patientMissingData), [props.patientMissingData]);

  return (
    <div className={classnames('missing-info-tag', props.className)}>
      <TooltipTag data={missingText} popoverClassName="missing-info-tag-popover" />
    </div>
  );
}

MissingPatientInfoTag.defaultProps = {
  className: '',
  patientMissingData: {
    isMissingPaymentType: false,
    isMissingDoB: false,
    isMissingGender: false,
    isMissingAddress: false,
    isNotSetUpFollowUp: false,
    isNotSignedCCMConsent: false,
  },
};

MissingPatientInfoTag.propTypes = {
  /** Classname of tag */
  className: PropTypes.string,
  /** Patient missing data */
  patientMissingData: PropTypes.shape({
    isMissingPaymentType: PropTypes.bool,
    isMissingDoB: PropTypes.bool,
    isMissingGender: PropTypes.bool,
    isMissingAddress: PropTypes.bool,
    isNotSetUpFollowUp: PropTypes.bool,
    isNotSignedCCMConsent: PropTypes.bool,
  }),
};

export default MissingPatientInfoTag;
