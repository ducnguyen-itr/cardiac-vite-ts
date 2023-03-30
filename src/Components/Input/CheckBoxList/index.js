
import { Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './style.scss';
import _ from 'lodash';
import { checkDisabledReportSetting } from './helper';

const CheckboxGroup = Checkbox.Group;

function CheckBoxList(props) {
  const [checkedList, setCheckedList] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const onChange = (e) => {
    const isChecked = e.target?.checked;
    const options = e?.target?.options;
    const cloneCheckList = _.clone(checkedList);
    if (isChecked) {
      cloneCheckList.push(options?.value);
    } else {
      _.remove(cloneCheckList, x => x === options.value);
    }

    setCheckedList(cloneCheckList);
    setCheckAll(cloneCheckList.length > 0);
    props.onChange({
      isItemChange: true,
      isGroupChange: false,
      name: props.name,
      list: cloneCheckList,
      isCheckAll: cloneCheckList.length > 0,
    });
  };

  const onCheckAllChange = (e) => {
    if (props.isObjectOptions) {
      setCheckedList(e.target.checked ? props.options?.map(x => x.value) : []);
      setCheckAll(e.target.checked);
      props.onChange({
        isItemChange: false,
        isGroupChange: true,
        name: props.name,
        list: checkedList,
        isCheckAll: e.target.checked,
      });
      return;
    }
    setCheckedList(e.target.checked ? props.options : []);
    setCheckAll(e.target.checked);
    props.onChange({
      isItemChange: false,
      isGroupChange: true,
      name: props.name,
      list: checkedList,
      isCheckAll: e.target.checked,
    });
  };

  useEffect(() => {
    setCheckedList(props.defaultValue);
    setCheckAll(props.defaultValue?.length > 0);
  }, [props.defaultValue]);
  return (
    <div className={classnames('checkbox-list-wrapper', props.className)}>
      {props.isGroupTitle && (
        <>
          {_.isEmpty(props.options) ? (
            <Checkbox onChange={onCheckAllChange} checked={checkAll}>
              {props.groupTitle}
            </Checkbox>
          ) : (
            <div className="checkbox-list-title">
              {props.groupTitle}
            </div>
          )}
        </>
      )}
      <CheckboxGroup
        className={classnames('horizontal-checkbox-list', props.isGroupTitle ? '' : 'no-padding-left')}
        value={checkedList}
      >
        {_.map(props.options, x => (
          <Checkbox onChange={onChange} options={x} value={x.value} disabled={checkDisabledReportSetting(x, props.requiredEP)}>
            {x.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
}
CheckBoxList.defaultProps = {
  className: '',
  groupTitle: '',
  options: [],
  onChange: () => { },
  name: '',
  isGroupTitle: false,
  defaultValue: [],
  isObjectOptions: false,
  requiredEP: [],
};

CheckBoxList.propTypes = {
  /** class name of this component */
  className: PropTypes.string,
  /** group title of this component */
  groupTitle: PropTypes.string,
  /** list of check box */
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(),
      PropTypes.string,
    ]),
  ),
  /** on change handler */
  onChange: PropTypes.func,
  /** name of check box */
  name: PropTypes.string,
  /** has group name */
  isGroupTitle: PropTypes.bool,
  /** default value of check box list */
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  /** condition this value is object */
  isObjectOptions: PropTypes.bool,
  /** check disabled check box */
  requiredEP: PropTypes.arrayOf(PropTypes.shape()),
};

export default CheckBoxList;
