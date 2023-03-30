import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CustomButton from '../Button/customButton';

const Rejoin = props => (
  <div
    className={classnames('rejoin-video', props.className)}
  >
    <p className="rejoin-video-title">
      You left the meeting
    </p>
    <div className="rejoin-video-btn-wrapper mt8">
      <CustomButton
        className="rejoin-btn"
        onClick={props.onRejoinClick}
        loading={props.isLoading}
        label="Rejoin"
      />
      <CustomButton
        type="primary"
        onClick={props.onReturnToPortalClick}
        label="Return to the portal"
      />
    </div>
  </div>
);

Rejoin.defaultProps = {
  className: '',
  isLoading: false,
  onRejoinClick: () => { },
  onReturnToPortalClick: () => { },
};

Rejoin.propTypes = {
  /** Classname of component */
  className: PropTypes.string,
  /** Set the loading status of Rejoin button */
  isLoading: PropTypes.bool,
  /** Set the handler to handle Rejoin button click */
  onRejoinClick: PropTypes.func,
  /** Set the handler to handle Return to portal button click */
  onReturnToPortalClick: PropTypes.func,
};

export default Rejoin;
