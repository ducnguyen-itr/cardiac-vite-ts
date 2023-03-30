import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useState } from 'react';
import './style.scss';

const PatientInfoMissing = memo((props) => {
  const [seeMore, setSeeMore] = useState(false);

  const onClick = useCallback(() => {
    setSeeMore(seeMore => !seeMore);
  });

  return (
    <div className={classnames('patient-info-missing', props.className)}>
      <div className="fbtc">
        <span>Missing patient’s information</span>
        <button className="see-more-btn" onClick={onClick}>{`See ${!seeMore ? 'more' : 'less'}`}</button>
      </div>
      {seeMore && (
        <ul>
          {
            _.map(props.missingInfo, (x, i) => (
              <li key={i}>{x}</li>
            ))
          }
        </ul>
      )}
    </div>
  );
});
PatientInfoMissing.defaultProps = {
  className: '',
  missingInfo: [],
};
PatientInfoMissing.propTypes = {
  className: PropTypes.string,
  missingInfo: PropTypes.arrayOf(PropTypes.string),
};

export default PatientInfoMissing;
