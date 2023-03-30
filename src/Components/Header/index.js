import { PageHeader } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MissingPatientInfoTag from '../MissingPatientInfoTag';
import ImportedTag from '../UI/importedTag';
import './style.scss';

export const Header = (props) => {
  const history = useHistory();
  const { title, isBack, onBack } = props;
  const showMissingTitle = (isShowMissing, isAthena) => (
    <div className="missing-data-title">
      <div className="mr12">{title}</div>
      {isShowMissing && (
        <MissingPatientInfoTag
          patientMissingData={props.patientMissingData}
        />
      )}
      {isAthena && (
        <ImportedTag />
      )}
    </div>
  );
  return (
    <div className="header-main">
      <PageHeader
        className={`header-navigation-left${isBack ? '' : '-noic'}`}
        onBack={onBack || history.goBack}
        title={showMissingTitle(props.isShowMissing, props.isAthena)}
      />
    </div>
  );
};

Header.defaultProps = {
  title: '',
  isBack: false,
  onBack: () => { },
  isShowMissing: false,
  isAthena: false,
  patientMissingData: {},
};

Header.propTypes = {
  /** Header title */
  title: PropTypes.string,
  /** Whether show back button */
  isBack: PropTypes.bool,
  /** Back button click event */
  onBack: PropTypes.func,
  /** Whether show missing info tag */
  isShowMissing: PropTypes.bool,
  /** Whether data from athena */
  isAthena: PropTypes.bool,
  /** Patient data */
  patientMissingData: PropTypes.shape({
    isMissingPaymentType: PropTypes.bool,
    isMissingDoB: PropTypes.bool,
    isMissingGender: PropTypes.bool,
    isMissingAddress: PropTypes.bool,
    isNotSetUpFollowUp: PropTypes.bool,
    isNotSignedCCMConsent: PropTypes.bool,
  }),
};

export default Header;
