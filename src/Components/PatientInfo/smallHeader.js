import {
  EllipsisOutlined, ExclamationCircleFilled, MailOutlined, PlusOutlined, SwitcherOutlined,
} from '@ant-design/icons';
import {
  Dropdown, Menu, Popover, Tooltip,
} from 'antd';
import classNames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import editIcon from '../../Assets/Images/Icons/edit.svg';
import CustomAvatar from '../Avatar';
import CustomButton from '../Button/customButton';
import MissingPatientInfoTag from '../MissingPatientInfoTag';
import PatientTypeTag from '../PatientTypeTag';
import { onClick } from './helper';
import { zeroPad } from '../../Utils';


const SmallHeader = (props) => {
  const {
    firstName, lastName, fullName, carePlanId, photo, dateOfBirth, gender, willDeletedAt,
  } = props?.patientData || {};

  const {
    isShowMissing, patientMissingData, popoverContent, isOpenNote, handleOpenChangeNote, onClickNote, isShowButtonOrData, isShowSwitchButton,
  } = props || {};

  const menuMore = (
    <Menu onClick={({ key }) => onClick({ key, ...props })}>
      {isShowSwitchButton && (
        <Menu.Item key={7}>
          <div className="patient-info-detail-dropdown-item">
            <SwitcherOutlined className="patient-info-detail-dropdown-item-icon" />
            {props.patientData?.isCCM ? 'Switch to RPM' : 'Switch to CCM'}
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowReferenceCode && (
        <Menu.Item key={1}>
          <div className="patient-info-detail-dropdown-item">
            <MailOutlined className="patient-info-detail-dropdown-item-icon" />
            Resend reference code
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowCreateApt && (
        <Menu.Item key={2}>
          <div className="patient-info-detail-dropdown-item">
            <PlusOutlined className="patient-info-detail-dropdown-item-icon" />
            Schedule new appointment
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowStartCarePlan && (
        <Menu.Item key={3}>
          <div className="patient-info-detail-dropdown-item">
            Start care plan
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowStopCarePlan && (
        <Menu.Item key={4}>
          <div className="patient-info-detail-dropdown-item danger">
            Stop care plan
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowReactivateCarePlan && (
        <Menu.Item key={5}>
          <div className="patient-info-detail-dropdown-item">
            Reactivate care plan
          </div>
        </Menu.Item>
      )}
      {isShowButtonOrData?.isShowDeleteCarePlan && (
        <Menu.Item key={6}>
          <div className="patient-info-detail-dropdown-item danger">
            Delete care plan
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className={classNames(props?.className)}>
      <div className="patient-info-content">
        <div className="patient-info-avatar">
          <CustomAvatar
            avatarLink={photo}
            size={28}
            firstName={firstName}
            lastName={lastName}
          />
        </div>
        <div className="patient-info-detail-container">

          <div className="patient-info-detail">
            <div className="patient-info-detail-top">
              <div className="patient-info-detail-name f-start-cen">
                <span className="patient-info-detail-name-value">{fullName}</span>
                {!!willDeletedAt && (
                  <Tooltip
                    placement="bottomLeft"
                    className="delete-tag-tooltip"
                    title={`The patient has deleted their account since ${moment(willDeletedAt, 'YYYY-MM-DD').subtract(30, 'd').format('MM/DD/YYYY')}`}
                    overlayClassName="delete-tag-tooltip-overlay"
                    getPopupContainer={node => node}
                  >
                    <ExclamationCircleFilled className="delete-tag-icon" />
                  </Tooltip>
                )}
                {props.patientData?.isCCM && <PatientTypeTag className="patient-type-tag-item" title="CCM" isShow isCCM />}
                {props.patientData?.isRPM && <PatientTypeTag className="ml10" title="RPM" isShow />}
                {isShowMissing && (
                  <MissingPatientInfoTag
                    className="ml10"
                    patientMissingData={patientMissingData}
                  />
                )}
              </div>
              <div className="patient-info-detail-top-item">{`Care plan ID: ${zeroPad(carePlanId) || '--'}`}</div>
              {dateOfBirth && (
                <div className="patient-info-detail-top-item">
                  {`${moment(dateOfBirth).format('MM/DD/YYYY')} (${moment().diff(moment(dateOfBirth), 'year')})`}
                </div>
              )}
              {gender && <div className="patient-info-detail-top-item">{_.capitalize(gender)}</div>}
              <Popover
                className="patient-info-detail-popover"
                content={popoverContent}
                trigger="click"
                placement="rightTop"
                visible={isOpenNote}
                onVisibleChange={handleOpenChangeNote}
              >
                <CustomButton
                  type="primary"
                  className="patient-info-detail-button-note"
                  onClick={onClickNote}
                  ghost
                  title="Note"
                  icon={<img src={editIcon} alt="" />}
                  label="Note"
                />
              </Popover>
            </div>
          </div>
          {!_.isEmpty(isShowButtonOrData) && (
            <div className="patient-info-footer-content-right">
              <Dropdown
                overlayClassName="patient-info-detail-dropdown"
                overlay={menuMore}
                trigger="click"
                placement="bottomRight"
              >
                <CustomButton
                  type="primary"
                  className="patient-info-detail-button-more"
                  ghost
                  icon={<EllipsisOutlined />}
                />
              </Dropdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SmallHeader.defaultProps = {
  className: '',
  patientData: {},
};

SmallHeader.propTypes = {
  /** component class name */
  className: PropTypes.string,
  /** patient data */
  patientData: PropTypes.shape(),
};

export default SmallHeader;
