import { CloseOutlined } from '@ant-design/icons';
import {
  Drawer, Select, Space, Spin,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import handleUpdateCarePlanAssignee from '../../Apollo/Functions/Handle/handleUpdateCarePlanAssignee';
import handleUpdateStudy from '../../Apollo/Functions/Handle/handleUpdateStudy';
import auth from '../../Helpers/auth';
import consoleLog from '../../Helpers/consoleLog';
import { useMergeState } from '../../Helpers/customHooks';
import { formatNoEmptyString } from '../../Utils';
import { fetchingUsersData } from '../../Utils/patientDetails';
import { showFailedMsg, showSuccessMsg } from '../../Utils/showNotification';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import InputTitle from '../Input/inputTitle';
import ModalHeader from '../UI/modalHeader';
import './style.scss';

const { Option } = Select;

const ReAssignDrawer = (props) => {
  const historyRef = useRef({
    selectedMD: {},
    selectedNurse: {},
  });

  const [state, setState] = useMergeState({
    loading: false,
    loadingBtn: false,
    assignMD: '',
    assignNurse: '',
    nurseData: [],
    physicianData: [],
    selectedMD: {},
    selectedNurse: {},
    // studyId: '',
  });

  const params = useParams();
  const {
    facilityName, title, onClose, visible,
  } = props;

  const fetchOption = async () => {
    setState({ loading: true });
    try {
      const promises = [fetchingUsersData(props.facilityId, true, props.nurse)];
      if (!_.isEmpty(props.physician)) {
        promises.push(fetchingUsersData(props.facilityId, false, props.physician));
        // if (props.status === 'active') {
        //   promises.push(fetchOngoingStudy(params?.carePlanId));
        // }
      }
      const result = await Promise.all(promises);
      const selectedMD = _.find(result[1], x => x.userId === props.physician?._id);
      const selectedNurse = _.find(result[0], x => x.userId === props.nurse?._id);
      historyRef.current.selectedNurse = selectedNurse;
      historyRef.current.selectedMD = selectedMD;
      setState({
        nurseData: result[0],
        physicianData: result[1],
        selectedMD: selectedMD || {},
        selectedNurse: selectedNurse || {},
        loading: false,
        // studyId: result[2],
      });
    } catch (error) {
      consoleLog('Failed to fetch option');
      setState({
        loading: false,
      });
    }
  };
  const handleUpdateAssigneeStudy = async () => {
    if (!state.studyId) {
      return;
    }
    const updateStudyInput = {
      studyId: state.studyId,
      props: {},
    };
    if (historyRef.current.selectedNurse?.userId !== state.selectedNurse?.userId) {
      _.assign(updateStudyInput.props, { technician: state.selectedNurse?.userId });
    }
    if (historyRef.current.selectedMD?.userId !== state.selectedMD?.userId) {
      _.assign(updateStudyInput.props, { interprettingPhysician: state.selectedMD?.userId });
    }
    try {
      await handleUpdateStudy(updateStudyInput);
    } catch (error) {
      consoleLog('handleUpdateAssigneeStudy', error);
    }
  };

  const handleMutation = async () => {
    setState({ loadingBtn: true });
    const input = {
      _id: props._id || params?.carePlanId,
      nurse: state.selectedNurse?.userId || undefined,
      physician: state.selectedMD?.userId || undefined,
      date: moment().toISOString(),
    };
    try {
      await handleUpdateCarePlanAssignee({ input });
      // await handleUpdateAssigneeStudy();
      showSuccessMsg('Update careplan assignee successfully!');
      setState({ selectedNurse: {}, selectedMD: {} });
      onClose(true);
    } catch (error) {
      showFailedMsg('Failed to update careplan assignee!');
      consoleLog('Failed to update careplan assignee:', error);
    }
    setState({ loadingBtn: false });
  };

  const onChangeNurseSelect = (value) => {
    const item = _.find(state.nurseData, x => x.userId === value);
    setState({ selectedNurse: item });
  };

  const onChangeMDSelect = (value) => {
    const item = _.find(state.physicianData, x => x.userId === value);
    setState({ selectedMD: item });
  };


  const assignToUser = () => {
    handleMutation(false);
  };

  const isDisabledReAssign = () => {
    if (props.physician?._id === state.selectedMD.userId && props.nurse?._id === state.selectedNurse.userId) {
      return true;
    }
    return false;
  };

  const filterOption = (input, option) => {
    const optionText = formatNoEmptyString(option.label);
    const inputText = formatNoEmptyString(input);
    return optionText.indexOf(inputText) >= 0;
  };


  useEffect(() => {
    if (props.visible) {
      if (!props.nurse && !_.isEmpty(state.selectedNurse)) {
        setState({ selectedNurse: {} });
      }
      if (!props.physician && !_.isEmpty(state.selectedMD)) {
        setState({ selectedMD: {} });
      }
      fetchOption();
    } else {
      setState({ selectedUser: {} });
    }
  }, [props.visible]);

  return (
    <Drawer
      placement="right"
      width={400}
      closeIcon={<CloseOutlined className="color-gray-9" />}
      onClose={() => onClose(false)}
      visible={visible}
      className="assign-drawer-user"
    >
      <ModalHeader
        className="patient-info-drawer-header"
        title={title}
        onClick={() => onClose(false)}
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
        <InputTitle title="Nurse" className="mt12" />
        <Select
          placeholder="Select..."
          optionFilterProp="label"
          onChange={onChangeNurseSelect}
          filterOption={(input, option) => filterOption(input, option)}
          showSearch
          value={state.selectedNurse?.fullName}
        >
          {
            _.map(state.nurseData, (x, i) => (
              <Option key={i} value={x.userId} label={x?.fullName}>
                <div className="search-option">
                  <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                  <div className="search-option-name">
                    {x?.fullName}
                  </div>
                </div>
              </Option>
            ))
          }
        </Select>
        {!_.isEmpty(props.physician)
          && (
            <>
              <InputTitle title="MD" className="mt12" />
              <Select
                placeholder="Select..."
                optionFilterProp="label"
                onChange={onChangeMDSelect}
                filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                showSearch
                value={state.selectedMD?.fullName}
              >
                {
                  _.map(state.physicianData, (x, i) => (
                    <Option key={i} value={x.userId} label={x?.fullName}>
                      <div className="search-option">
                        <CustomAvatar avatarLink={x?.photo} firstName={x?.firstName} lastName={x.lastName} />
                        <div className="search-option-name">
                          {x?.fullName}
                        </div>
                      </div>
                    </Option>
                  ))
                }
              </Select>
            </>
          )}

        <div className="change-button-group f1-r">
          <CustomButton
            onClick={() => {
              onClose(false);
            }}
            disabled={state.loadingBtn}
            label="Cancel"
          />

          <CustomButton
            type="primary"
            onClick={assignToUser}
            disabled={isDisabledReAssign()}
            loading={state.loadingBtn}
            label="Change"
          />

        </div>
      </div>
    </Drawer>
  );
};

ReAssignDrawer.defaultProps = {
  _id: '',
  onClose: () => { },
  visible: false,
  title: '',
  facilityName: '',
  facilityId: '',
  // status: '',
  physician: {},
  nurse: {},
};

ReAssignDrawer.propTypes = {
  _id: PropTypes.string,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
  facilityName: PropTypes.string,
  facilityId: PropTypes.string,
  // status: PropTypes.string,
  physician: PropTypes.shape(),
  nurse: PropTypes.shape(),
};

export default ReAssignDrawer;
