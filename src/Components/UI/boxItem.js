import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CustomButton from '../Button/customButton';
// import { useMergeState } from '../../Helpers/customHooks';

const BoxItem = (props) => {
  // const [state, setState] = useMergeState({
  //   data: [],
  // });

  const {
    className, icon, value, onClick,
  } = props;

  return (
    <CustomButton className={classnames('box-item-wrapper', className)} onClick={onClick} icon={icon || null} label={value ? <span>{value}</span> : null} />
  );
};
BoxItem.defaultProps = {
  className: '',
  icon: {},
  value: '',
  onClick: () => {},
};
BoxItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.shape(),
  value: PropTypes.string,
  onClick: PropTypes.func,
};

export default BoxItem;
