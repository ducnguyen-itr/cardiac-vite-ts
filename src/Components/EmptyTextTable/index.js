import React from 'react';
import PropTypes from 'prop-types';
import NoReportIcon from '../../Image/Pages/PatientDetails/no-report-available.svg';
import './style.scss';

function EmptyTextTable(props) {
  return (
    <div className="table-empty-data">
      <div><img src={props.icon || NoReportIcon} alt="" /></div>
      <div className="mt10">{props.emptyText || 'There is no data to display'}</div>
    </div>
  );
}

EmptyTextTable.defaultProps = {
  icon: undefined,
  emptyText: '',
};

EmptyTextTable.propTypes = {
  /** Icon of component */
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  /** Empty text content */
  emptyText: PropTypes.string,
};

export default EmptyTextTable;
