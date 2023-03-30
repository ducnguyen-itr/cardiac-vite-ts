import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import { useMergeState } from '../../Helpers/customHooks';
import BoxItem from '../UI/boxItem';

const PagingCT = (props) => {
  // const [state, setState] = useMergeState({
  //   data: [],
  // });
  const {
    className, total, onClickPre, onClickNext, getCurrent,
  } = props;
  return (
    <div className={classnames('paging-ct-wrapper', className)}>
      <BoxItem icon={<LeftOutlined />} className="mr8" onClick={onClickPre} />
      {_.map(new Array(total), (x, i) => (
        <BoxItem value={i + 1} className="mr8" onClick={() => getCurrent(i + 1)} />
      ))}
      <BoxItem icon={<RightOutlined />} onClick={onClickNext} />
    </div>
  );
};
PagingCT.defaultProps = {
  className: '',
  total: 0,
  getCurrent: () => {},
  onClickPre: () => {},
  onClickNext: () => {},
};
PagingCT.propTypes = {
  className: PropTypes.string,
  total: PropTypes.number,
  getCurrent: PropTypes.func,
  onClickPre: PropTypes.func,
  onClickNext: PropTypes.func,
};

export default PagingCT;
