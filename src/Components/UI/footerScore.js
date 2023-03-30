import React, {
  useState, useContext, useEffect, useCallback, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Typography } from 'antd';
import { useMergeState } from '../../Helpers/customHooks';

const { Title, Text } = Typography;

const FooterScore = (props) => {
  const {
    className, totalScore, // title, data,
    arrayData,
  } = props;

  return (
    <div className={classnames('footer-score-wrapper', className)}>
      <div className="fr-sb">
        <Text strong>Total score:</Text>
        <Text strong>{totalScore}</Text>
      </div>
      {_.map(arrayData, (x, i) => (
        <div key={i} className="fr-sb mt8">
          <Text>{x.title}</Text>
          {x.value ? <Text>{x.value}</Text> : null}
        </div>
      ))}
      {/* ${data[totalScore]}%` */}
    </div>
  );
};
FooterScore.defaultProps = {
  className: '',
  arrayData: [],
  totalScore: 0,
};
FooterScore.propTypes = {
  className: PropTypes.string,
  arrayData: PropTypes.arrayOf(PropTypes.shape()),
  totalScore: PropTypes.number,
};

export default FooterScore;
