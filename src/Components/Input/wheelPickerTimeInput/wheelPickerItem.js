import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import WheelPicker from './wheelPicker';
// import IconButton from '../../../../../Downloads/mdm-patient-web-staging/src/components/buttons/iconButton';
import downIcon from '../../../Assets/Images/Icons/downCaret.svg';
import upIcon from '../../../Assets/Images/Icons/upCaret.svg';
import CustomButton from '../../Button/customButton';
import './_wheel-picker-time-input.scss';

const WheelItem = (props) => {
  const timeRef = useRef(undefined);

  useEffect(() => {
    if (timeRef.current) {
      timeRef.current.reloadFunc(parseInt(props.defaultSelection, 10));
    }
  }, [props.defaultSelection]);

  const {
    className, name, parentName,
  } = props;
  const temp = parseInt(props.defaultSelection, 10);

  const onClickUp = () => {
    if (temp > 0) {
      props.updateSelection(name, temp - 1);
    } else {
      props.updateSelection(name, props.data?.length - 1);
    }
  };

  const onClickDown = () => {
    if (temp < props.data?.length - 1) {
      props.updateSelection(name, temp + 1);
    } else {
      props.updateSelection(name, 0);
    }
  };

  return (
    <div className={classnames('wheel-picker-item', className)}>
      <CustomButton
        className="wheel-picker-item__up-button"
        onClick={onClickUp}
        icon={(
          <img src={upIcon} alt="Up icon" />
        )}
      />

      <WheelPicker
        animation="flat"
        data={props.data}
        height={38}
        parentHeight={38}
        parentWidth={57}
        fontSize={14}
        defaultSelection={props.defaultSelection}
        updateSelection={(index) => {
          props.updateSelection(name, index);
        }}
        scrollerId={`${parentName}-scroll-select-${name}`}
        ref={timeRef}
      />

      <CustomButton
        className="wheel-picker-item__down-button"
        onClick={onClickDown}
        icon={(
          <img src={downIcon} alt="Down icon" />
        )}
      />
    </div>
  );
};
WheelItem.defaultProps = {
  className: '',
  updateSelection: () => { },
  defaultSelection: 0,
  data: [],
  name: '',
  parentName: '',
};
WheelItem.propTypes = {
  className: PropTypes.string,
  updateSelection: PropTypes.func,
  defaultSelection: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  data: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ])),
  name: PropTypes.string,
  parentName: PropTypes.string,
};

export default WheelItem;
