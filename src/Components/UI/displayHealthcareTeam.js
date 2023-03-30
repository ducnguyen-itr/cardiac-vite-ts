import { ExclamationCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { CONFIRMATION_LAYOUT_TYPES, HEALTHCARE_TEAM } from '../../Constants';
import { getHealthcareTags } from '../../Helpers';
import auth from '../../Helpers/auth';
import { useMergeState } from '../../Helpers/customHooks';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import CustomButton from '../Button/customButton';
import HealthcareTag from '../PatientInfo/healthcareTag';
import '../PatientInfo/style.scss';

const DisplayHealthcareTeam = (props) => {
  const [state, setState] = useMergeState({
    mdTag: {},
    nurseTag: {},
    isShowModal: false,
    message: '',
  });

  const { isShowModal, message } = state;

  const toggleCancelModal = () => {
    setState({ isShowModal: !isShowModal, message: '' });
  };

  const handleOnClick = (i) => {
    props.onClickButton(i === 0 ? HEALTHCARE_TEAM.NURSE : HEALTHCARE_TEAM.PHYSICIAN);
  };

  const showButton = (i = 0) => ( // 0 = nurse, 1 = md
    <CustomButton
      key={i}
      className="fcen"
      block
      type="primary"
      icon={<UserAddOutlined />}
      // disabled={!props.isDisabledAssignNurse || (i !== 0 && props.isDisabledAssignMD)}
      onClick={() => {
        handleOnClick(i);
      }}
      label={`Assign ${i === 0 ? 'a nurse' : 'a physician'}`}
    />
  );

  const showAssignButtons = (i = 0) => {
    if (props.name === 'inactive') return null;
    if (auth.isNurse()) {
      if (i === 0) {
        return showButton(i);
      }
      if (!_.isEmpty(state.nurseTag)) {
        return showButton(i);
      }
    }
    return null;
  };

  const isShowPhysician = () => {
    if (auth.isMD() && _.isEmpty(state.mdTag)) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (props.caregiverInfo.length === 0) {
      setState({ mdTag: {}, nurseTag: {} });
      return;
    }
    const { mdTag, nurseTag } = getHealthcareTags(props.caregiverInfo);

    setState({ mdTag, nurseTag });
  }, [props.caregiverInfo]);

  return (
    <>
      <div className={classnames('display-healthcare-wrapper', props.className)}>
        <Space size={20} direction="vertical">
          {
            props.isDetails
              ? (
                <>
                  {
                    _.isEmpty(state.nurseTag) ? showAssignButtons(0)
                      : <HealthcareTag key={0} data={state.nurseTag} />
                  }
                  {
                    _.isEmpty(state.mdTag) || !state.mdTag?.firstName || !state.mdTag?.lastName ? showAssignButtons(1)
                      : <HealthcareTag key={1} data={state.mdTag} />
                  }
                </>
              )
              : (
                <>
                  {
                    _.isEmpty(state.nurseTag) ? null
                      : <HealthcareTag key={0} data={state.nurseTag} />
                  }
                  {
                    _.isEmpty(state.mdTag) ? null
                      : <HealthcareTag key={1} data={state.mdTag} />
                  }
                </>
              )
          }
        </Space>
      </div>

      <ConfirmationLayout
        toggleClick={toggleCancelModal}
        type={CONFIRMATION_LAYOUT_TYPES.INCOMPLETE_INFO}
        visible={isShowModal}
        onClick={toggleCancelModal}
        message={message}
        icon={<ExclamationCircleOutlined className="row-icon color-red-6" />}
      />
    </>
  );
};

DisplayHealthcareTeam.defaultProps = {
  className: undefined,
  isDetails: false,
  onClickButton: () => { },
  caregiverInfo: [],
  name: '',
};

DisplayHealthcareTeam.propTypes = {
  /** component class name */
  className: PropTypes.string,
  /** is detail */
  isDetails: PropTypes.bool,
  /** event click button */
  onClickButton: PropTypes.func,
  /** caregiver info */
  caregiverInfo: PropTypes.arrayOf(PropTypes.shape()),
  /** name */
  name: PropTypes.string,
};

export default DisplayHealthcareTeam;
