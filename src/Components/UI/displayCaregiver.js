import { EditOutlined, ExclamationCircleOutlined, UserAddOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { CONFIRMATION_LAYOUT_TYPES } from '../../Constants';
import { getCareGiverTags } from '../../Helpers';
import auth from '../../Helpers/auth';
import { useMergeState } from '../../Helpers/customHooks';
import ConfirmationLayout from '../../Pages/Reports/ReportDetails/Layout/confirmationLayout';
import CustomButton from '../Button/customButton';
import CareGiverTag from '../PatientInfoDrawer/careGiverTag';

const { Title } = Typography;

const DisplayCaregiver = (props) => {
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
  useEffect(() => {
    if (props.caregiverInfo.length === 0) {
      setState({ mdTag: {}, nurseTag: {} });
      return;
    }
    const { mdTag, nurseTag } = getCareGiverTags(props.caregiverInfo);

    setState({ mdTag, nurseTag });
  }, [props.caregiverInfo]);

  const handleOnClick = (i) => {
    props.onClickButton(i === 0 ? 'Nurse' : 'Physician');
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

  return (
    <>
      <div className={classnames('display-caregiver-wrapper', props.className)}>

        {
          props.isDetails || !(_.isEmpty(state.nurseTag) && _.isEmpty(state.mdTag))
            ? (
              <div className="display-caregiver-wrapper-title">
                <Title level={5} className="mb0">{props.isAttendee ? 'Attendees' : 'Healthcare team'}</Title>
                {props.isDetails
                  && !(_.isEmpty(state.nurseTag)
                    && _.isEmpty(state.mdTag))
                  && (props.name === 'active' || props.name === 'new-assigned' || props.name === 'new-md')
                  && isShowPhysician()
                  && (
                    <CustomButton
                      ghost
                      icon={<EditOutlined />}
                      type="primary"
                      size="small"
                      className="display-caregiver-wrapper-button"
                      onClick={props.onClickEdit}
                      label="Edit"
                    />
                  )}
              </div>
            )
            : null
        }

        <Space size={12} direction="vertical">
          {
            props.isDetails
              ? (
                <>
                  {
                    _.isEmpty(state.nurseTag) ? showAssignButtons(0)
                      : <CareGiverTag key={0} data={state.nurseTag} />
                  }
                  {
                    _.isEmpty(state.mdTag) || !state.mdTag?.firstName || !state.mdTag?.lastName ? showAssignButtons(1)
                      : <CareGiverTag key={1} data={state.mdTag} />
                  }
                </>
              )
              : (
                <>
                  {
                    _.isEmpty(state.nurseTag) ? null
                      : <CareGiverTag key={0} data={state.nurseTag} />
                  }
                  {
                    _.isEmpty(state.mdTag) ? null
                      : <CareGiverTag key={1} data={state.mdTag} />
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

DisplayCaregiver.defaultProps = {
  className: undefined,
  isDetails: false,
  onClickButton: () => { },
  caregiverInfo: [],
  onClickEdit: () => { },
  name: '',
  isAttendee: false,
  isDeleted: false,
};

DisplayCaregiver.propTypes = {
  className: PropTypes.string,
  isDetails: PropTypes.bool,
  onClickButton: PropTypes.func,
  caregiverInfo: PropTypes.arrayOf(PropTypes.shape()),
  onClickEdit: PropTypes.func,
  name: PropTypes.string,
  isAttendee: PropTypes.bool,
  isDeleted: PropTypes.bool,
};

export default DisplayCaregiver;
