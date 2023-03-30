import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { STUDY_STATUS } from '../../Constants/carePlan';

const {
  ONGOING,
  NOT_STARTED,
  STARTING,
  COMPLETED,
  FOLLOW_ON,
  FO_TAG,
  DONE,
  ABORTED,
} = STUDY_STATUS;

const StudyStatus = (props) => {
  const { className, type, title } = props;
  let str = '';
  let classCT = '';
  switch (type) {
    case ABORTED:
      str = 'Aborted';
      classCT = 'aborted';
      break;
    case ONGOING:
      str = 'Ongoing';
      classCT = 'ongoing';
      break;
    case NOT_STARTED:
      str = 'Not started';
      classCT = 'not-started';
      break;
    case FOLLOW_ON:
      str = 'Follow on';
      classCT = 'follow-on';
      break;
    case STARTING:
      str = 'Starting';
      classCT = 'starting';
      break;
    case COMPLETED:
      str = 'Completed';
      classCT = 'completed';
      break;
    case DONE:
      str = 'Done';
      classCT = 'done';
      break;
    case FO_TAG:
      str = 'FO';
      classCT = 'follow-on';
      break;
    default:
      break;
  }
  return (
    <div className={classnames(`study-status-${classCT}`, className)}>
      {title || str}
    </div>
  );
};
StudyStatus.defaultProps = {
  className: '',
  type: ONGOING,
  title: '',
};
StudyStatus.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
};

export default StudyStatus;
