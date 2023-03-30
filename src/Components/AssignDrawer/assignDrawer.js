import { CloseOutlined } from '@ant-design/icons';
import {
  Button, Drawer, Space, Spin,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import fetchUsers from '../../Apollo/Functions/Fetch/fetchUsers';
import handleUpdateCarePlanAssignee from '../../Apollo/Functions/Handle/handleUpdateCarePlanAssignee';
import { ASSIGN_SELECT_TYPES, ROLES } from '../../Constants';
import { SORT_BY_ENUM, SORT_FIELD_ENUM } from '../../Constants/enum';
import { getUserAvatars } from '../../Helpers';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { useMergeState } from '../../Helpers/customHooks';
import { formatUserData } from '../../Utils/table';
import CustomButton from '../Button/customButton';
import AssignSelect from '../Input/assignSelect';
import { handleUpDateReportSetttings } from '../PatientInfoDrawer/helper';
import ModalHeader from '../UI/modalHeader';

const {
  CLINIC_PHYSICIAN, CLINIC_TECHNICIAN,
} = ROLES;


const AssignDrawer = (props) => {
  const debounceFetching = useRef(undefined);
  const userDataRef = useRef(undefined);

  const [state, setState] = useMergeState({
    selectedUser: {},
    userData: [],
    loading: false,
  });

  const {
    facilityName,
    type, title, onClose, visible, onClickAssign, _id,
  } = props;

  const { selectedUser, userData } = state;

  const isNurse = type === 'nurse';

  const handleMutation = async (isAssignToMe = false) => {
    setState({ loading: true });
    const item = _.find(userData, x => x.userId === selectedUser?.userId);

    let role = '';

    if (item?.roles?.includes(CLINIC_TECHNICIAN)) {
      role = CLINIC_TECHNICIAN;
    }
    if (item?.roles?.includes(CLINIC_PHYSICIAN)) {
      role = CLINIC_PHYSICIAN;
    }

    const input = {
      _id,
      nurse: isNurse ? isAssignToMe ? auth.userId() : item?.userId : undefined,
      physician: isNurse ? undefined : item?.userId,
      date: moment().toISOString(),
    };
    const pendingPromises = [
      handleUpdateCarePlanAssignee({ input }),
    ];
    // if (role === CLINIC_TECHNICIAN) {
    //   pendingPromises.push(handleUpDateReportSetttings(_id));
    // }
    try {
      await Promise.all(pendingPromises);
      onClickAssign();
    } catch (error) {
      consoleLog('Failed to update care plan assigneee', error);
    }
    setState({ loading: false });
  };

  const fetchingUserData = async (name = '') => {
    const sendingData = {
      filter: {
        name: name?.trim(), // search
        // role: isNurse ? 'Nurse' : 'Physician',
        facilityId: _.find(auth.getFacilities(), x => x?.name === facilityName)?._id || undefined,
        role: isNurse ? CLINIC_TECHNICIAN : CLINIC_PHYSICIAN,
        userCursor: undefined,
        sortOrder: SORT_BY_ENUM.ASC,
        sortField: SORT_FIELD_ENUM.ID,
      },
      limit: 10,
    };
    try {
      const users = await fetchUsers(sendingData);
      getUserAvatars(users);
      const userData = formatUserData(users);
      if (!name) {
        userDataRef.current = userData;
      }
      setState({ userData });
    } catch (error) {
      consoleLog('Failed to fetch user data', error);
    }
  };

  const callDebounceSearching = (input) => {
    if (input) {
      if (debounceFetching.current) {
        clearTimeout(debounceFetching.current);
      }
      debounceFetching.current = setTimeout(() => {
        fetchingUserData(input);
      }, 300);
    }
  };

  const onChange = (key, value) => {
    const item = _.find(userData, x => x.userId === value);
    setState({ [key]: item });
    // reset search option
    if (!_.isEqual(state.userData, userDataRef.current)) {
      const cloneUserData = _.cloneDeep(userDataRef.current);
      cloneUserData.push(item);
      setState({ userData: _.sortBy(_.uniqBy(cloneUserData, 'userId'), x => x?.firstName?.toLocaleLowerCase()) });
    }
  };
  const assignToMe = () => {
    handleMutation(true);
  };
  const assignToUser = () => {
    handleMutation(false);
  };
  const onDeleteTag = () => {
    setState({ selectedUser: {} });
  };

  const { userId } = selectedUser || {};

  useEffect(() => {
    setState({ selectedUser: {} });
    if (props.visible) {
      fetchingUserData();
    }
  }, [props.visible]);

  return (
    <Drawer
      // title={title}
      placement="right"
      width={400}
      closeIcon={<CloseOutlined className="color-gray-9" />}
      onClose={onClose}
      visible={visible}
      className="assign-drawer-user"
    >
      <ModalHeader
        className="patient-info-drawer-header"
        title={title}
        onClick={onClose}
      />
      {
        state.loading && (
          <Space className="loading-space" size="middle">
            <Spin size="large" />
          </Space>
        )
      }
      {
        facilityName && auth.isFacilities() && (
          <div className="assign-facility-name">
            <span>{facilityName}</span>
          </div>
        )
      }

      <div className="assign-drawer-wrapper">
        <span className="search-title">
          {`Search ${isNurse ? 'a nurse' : 'a physician'} to assign`}
        </span>

        <AssignSelect
          name="selectedUser"
          className="mt16"
          data={userData}
          value={userId}
          onChange={onChange}
          onDeleteTag={onDeleteTag}
          onSearch={callDebounceSearching}
          type={ASSIGN_SELECT_TYPES.PATIENT_DETAILS}
        />

        <div className="assign-button-group f1-r">
          {
            isNurse && (
              <CustomButton
                type="primary"
                ghost
                onClick={assignToMe}
                label="Assign to me"
              />
            )
          }
          <CustomButton
            className="btn-assign"
            type="primary"
            disabled={!userId}
            onClick={assignToUser}
            label="Assign"
          />
        </div>
      </div>
    </Drawer>
  );
};

AssignDrawer.defaultProps = {
  _id: '',
  type: '',
  onClose: () => { },
  onClickAssign: () => { },
  visible: false,
  title: '',
  facilityName: '',
};

AssignDrawer.propTypes = {
  _id: PropTypes.string,
  type: PropTypes.string,
  onClose: PropTypes.func,
  onClickAssign: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
  facilityName: PropTypes.string,
};

export default AssignDrawer;
