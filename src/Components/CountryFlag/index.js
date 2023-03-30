import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import classnames from 'classnames';

function CountryFlag(props) {
  return (
    <img
      className={classnames('flag-style', props.className)}
      // https://gist.github.com/bantya/9a619ab7b8f262e83fda
      src={`http://flags.fmcdn.net/data/flags/mini/${props.countryCode?.toLowerCase()}.png`}
      alt=""
    />
  );
}
CountryFlag.defaultProps = {
  className: '',
  countryCode: '',
};

CountryFlag.propTypes = {
  /** Classname of button */
  className: PropTypes.string,
  /** Country code (alpha-2) */
  countryCode: PropTypes.string,
};

export default CountryFlag;
