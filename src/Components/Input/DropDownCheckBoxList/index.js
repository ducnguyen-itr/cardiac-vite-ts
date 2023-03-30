import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useMergeState } from '../../../Helpers/customHooks';
import CheckBoxList from '../CheckBoxList';
import './style.scss';

function DropDownCheckBoxList(props) {
  const [state, setState] = useMergeState(props.defaultValue || {});
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  };

  const onChange = ({
    isItemChange, isGroupChange, name, list, isCheckAll,
  }) => {
    if (isGroupChange) {
      if (isCheckAll) {
        const item = _.find(props.groupList, x => x.name === name);
        if (!item?.options || _.isEmpty(item?.options)) {
          setState({ [name]: [name] });
          return;
        }
        if (props.isObjectOptions) {
          setState({ [name]: item?.options?.map(x => x.value) });
        } else {
          setState({ [name]: item?.options });
        }
        return;
      }
      setState({ [name]: [] });
      return;
    }
    if (isItemChange) {
      setState({ [name]: list });
    }
  };

  useEffect(() => {
    // const count = getCountDisabled(state);
    // setCount(count);
    props.onChange(state);
  }, [state]);

  const menu = (
    <Menu className="dropdown-checkbox-list-menu">
      {_.map(props.groupList, (x, i) => (
        <Menu.Item className="drop-down-checkbox-item" key={i}>
          <CheckBoxList
            groupTitle={x.title}
            name={x.name}
            options={x.options}
            onChange={onChange}
            isGroupTitle={props.isGroupTitle}
            defaultValue={x.defaultValue}
            isObjectOptions={props.isObjectOptions}
            requiredEP={props.requiredEP}
          />
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="dropdown-checkbox-list-wrapper">
      <Dropdown
        onVisibleChange={handleVisibleChange}
        visible={visible}
        trigger={['click']}
        overlay={menu}
        placement="bottomRight"
        getPopupContainer={() => document.querySelector('.dropdown-checkbox-list-btn')}
      >
        <Button
          className="dropdown-checkbox-list-btn"
        >
          <div className="display-button-content">
            <div className="title">
              {/* {count > 0 ? `Selected ${count} item${count > 1 ? 's' : ''} to display` : 'Select item(s) to display...'} */}
              Select item(s) to display...
            </div>
            {!visible ? <DownOutlined /> : <UpOutlined />}
          </div>
        </Button>
      </Dropdown>
    </div>
  );
}

DropDownCheckBoxList.defaultProps = {
  groupList: [],
  isGroupTitle: true,
  onChange: () => { },
  isObjectOptions: false,
  defaultValue: {},
  requiredEP: [],
};

DropDownCheckBoxList.propTypes = {
  /** list of check box */
  groupList: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape(),
        PropTypes.string,
      ]),
    ),
    PropTypes.shape(),
  ]),
  /** has group name */
  isGroupTitle: PropTypes.bool,
  /** on change handler */
  onChange: PropTypes.func,
  /** condition this value is object */
  isObjectOptions: PropTypes.bool,
  /** default value of check box list */
  defaultValue: PropTypes.shape(),
  /** check disabled check box condition */
  requiredEP: PropTypes.arrayOf(PropTypes.shape()),
};


export default DropDownCheckBoxList;
